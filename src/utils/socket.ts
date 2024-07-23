import { getErrorMessageFromE } from "@/utils/errors.ts";

export enum NewWebSocketStatus {
	INIT = "INIT",
	CONNECTING = "CONNECTING",
	CONNECTED = "CONNECTED",
	DISCONNECTED = "DISCONNECTED",
	STOPPED = "STOPPED",
}

export type NewWebSocketConn = {
	connectionName: string;
	url: string;
	status: NewWebSocketStatus;
};
export type WebsocketError = {
	code: string;
	error: string;
	message: string;
	name: string;
	success: boolean;
};

export type NewWebSocketOptions = {
	connectionName: string;
	url: string;
	debugging?: boolean;
	debuggingMessages?: boolean;
	reconnectTimeout?: number;
	onRestore?: (data: NewWebSocketStore) => NewWebSocketStore;
	onOpened?: (conn: NewWebSocketInfo) => void;
	onError?: (conn: NewWebSocketInfo) => void;
	onClosed?: (conn: NewWebSocketInfo) => void;
	onConnection?: (conn: NewWebSocketInfo) => void;
	onUpdate?: (data: NewWebSocketInfo) => void;
};

export type NewWebSocketInfo = {
	error?: WebsocketError;
	conn?: NewWebSocketConn;
	data?: string;
	event?: MessageEvent;
};
export type NewWebSocketStore = Set<string>;

export class NewWebSocketClient {
	readonly connectionName: string;
	readonly url: string;
	readonly debug: boolean;
	readonly debugMessage: boolean;
	private ws: WebSocket | null = null;
	private status: NewWebSocketStatus = NewWebSocketStatus.INIT;
	private prevStatus: NewWebSocketStatus = NewWebSocketStatus.INIT;
	private isChangePrevStatus = false;
	private reconnectTimeout: number;
	private reconnectTimer: NodeJS.Timeout | null = null;
	private isStopped: boolean = false;
	protected options: NewWebSocketOptions;
	/**
	 * Store for storing requests
	 * @private
	 */
	private storedRequests: NewWebSocketStore = new Set();

	// Event handlers
	/**
	 * Process requests after reconnection
	 * @private
	 */
	private onRestore?: (data: NewWebSocketStore) => NewWebSocketStore | undefined;
	private onOpened?: (data: NewWebSocketInfo) => void;
	private onError?: (data: NewWebSocketInfo) => void;
	private onClosed?: (data: NewWebSocketInfo) => void;
	private onConnection?: (data: NewWebSocketInfo) => void;
	private onUpdate?: (data: NewWebSocketInfo) => void;

	constructor(options: NewWebSocketOptions) {
		this.connectionName = options.connectionName;
		this.url = options.url || 'url';
		this.debug = options.debugging || false;
		this.debugMessage = options.debuggingMessages || false;
		this.reconnectTimeout = options.reconnectTimeout || 3000;
		this.storedRequests = new Set();

		this.onRestore = options.onRestore;
		this.onOpened = options.onOpened;
		this.onError = options.onError;
		this.onClosed = options.onClosed;
		this.onConnection = options.onConnection;
		this.onUpdate = options.onUpdate;

		this.options = options
	}

	protected log(msg: string, type: "log" | "error" | "warn" = "log"): void {
		const data = `[WS:${this.connectionName}] ${msg}`;
		switch (type) {
			case "error": {
				console.error(data);
				return;
			}
			case "warn": {
				console.warn(data);
				return;
			}
			default: {
				console.log(data);
			}
		}
	}

	open(): void {
		if (this.debug) {
			this.log(`========================================== ${this.status}`);
		}
		if ([NewWebSocketStatus.CONNECTED].includes(this.status)) {
			if (this.debug) {
				this.log("Connection already established");
			}
			return;
		}
		if(this.isChangePrevStatus){
			this.prevStatus = this.status
		}

		if (
			[
				NewWebSocketStatus.INIT,
				NewWebSocketStatus.STOPPED,
				NewWebSocketStatus.CONNECTING,
			].includes(this.status)
		) {
			this.status = NewWebSocketStatus.CONNECTING;
			if (this.debug) {
				this.log("Initializing connection");
			}
			this.onConnection?.({
				conn: this.getConnectionInfo(),
			});
		}
		try {
			this.createNewConnection();
		} catch (e) {
			this.onError?.({
				conn: this.getConnectionInfo(),
				data: getErrorMessageFromE(e),
			});
		}
	}
	private createNewConnection(): void {
		this.isStopped = false;
		this.ws = new WebSocket(this.url);

		this.ws.onopen = () => {
			this.isChangePrevStatus = true;
			this.handleOpen();

			// Sending saved requests after the connection is restored
			if(this.prevStatus === NewWebSocketStatus.INIT) return
			if(this.onRestore){
				const newStore = this.onRestore(this.storedRequests)
				if(newStore !== undefined){
					this.storedRequests = new Set(newStore)
				}
			}
			this.storedRequests.forEach(elem=>{
				this.ws!.send(elem);
			})
		};
		this.ws.onclose = () => this.handleClose();
		this.ws.onerror = (error) => this.handleError(error);
		this.ws.onmessage = (event) => this.handleUpdateMessage(event);
	}

	close(): void {
		if (
			![NewWebSocketStatus.CONNECTED, NewWebSocketStatus.CONNECTING].includes(
				this.status,
			)
		){
			return;
		}
		this.isStopped = true;
		this.clearReconnectTimer();

		if (this.ws) {
			this.ws.close();
			this.ws = null;
		}

		this.status = NewWebSocketStatus.STOPPED;

		if (this.debug) {
			this.log("Connection closed");
		}
		this.onClosed?.({
			conn: this.getConnectionInfo(),
		});
	}

	/**
	 * Forcefully break the connection for reconnect debugging
	 */
	breakConnection(): void {
		if (
			![NewWebSocketStatus.CONNECTED, NewWebSocketStatus.CONNECTING].includes(
				this.status,
			)
		)
			return;

		if (this.debug) {
			this.log("Connection forcibly broken");
		}

		if (this.ws) {
			this.ws.close();
			this.ws = null;
		}
	}

	getInfo(): NewWebSocketInfo {
		return {
			conn: this.getConnectionInfo(),
		};
	}

	private _send(data: string): boolean{
		if (this.ws && this.status === NewWebSocketStatus.CONNECTED) {
			if (this.debugMessage) {
				let parseData = data;
				try {
					parseData = JSON.parse(data);
				} catch (e) {}
				this.log("Sent message: " + parseData);
			}
			this.ws.send(data);
			return true
		} else {
			if (this.debug) {
				this.log(
					"Failed to send data: socket is not connected",
				);
			}
			this.onError?.({
				conn: this.getConnectionInfo(),
				data:
					"Bad Request: The endpoint that you are trying to connect to is invalid",
			});
		}
		return false
	}
	sendMessage(data: string): boolean {
		return this._send(data);
	}
	subscribe(
		data: string,
	): void {
		if(this._send(data)) this.storedRequests.add(data)
	}
	unsubscribe(
		data: string,
	): void {
		if(this._send(data)) this.storedRequests.delete(data)
	}

	removeStoreKey(key: string): void{
		this.storedRequests.delete(key)
	}
	/**
	 * Method for clearing the query store
	 */
	clearStoredRequests(): void {
		this.storedRequests.clear();
	}
	/**
	 * Method for getting a list of keys and requests
	 */
	getStoredRequests(): NewWebSocketStore {
		return new Set(this.storedRequests);
	}

	private handleOpen(): void {
		if ([NewWebSocketStatus.CONNECTED].includes(this.status)) return;
		this.status = NewWebSocketStatus.CONNECTED;
		this.clearReconnectTimer();
		if (this.debug) {
			this.log("Connection established");
		}
		this.onOpened?.({
			conn: this.getConnectionInfo(),
		});
	}

	private handleClose(): void {
		if (
			![
				NewWebSocketStatus.CONNECTED,
				NewWebSocketStatus.CONNECTING,
				NewWebSocketStatus.DISCONNECTED,
			].includes(this.status)
		)
			return;
		this.status = NewWebSocketStatus.DISCONNECTED;
		this.ws = null;

		if (this.debug) {
			this.log("Connection closed");
		}

		this.onClosed?.({
			conn: this.getConnectionInfo(),
		});

		if (!this.isStopped) {
			this.startReconnectTimer();
		}
	}
	private startReconnectTimer(): void {
		this.status = NewWebSocketStatus.CONNECTING;

		this.reconnectTimer = setTimeout(() => {
			if (this.debug) {
				this.log("Trying to reconnect...");
			}
			this.open();
		}, this.reconnectTimeout);
	}

	private handleError(error: Event): void {
		const websocketError: WebsocketError = {
			code: "WebSocketError",
			error: error.type,
			message: (error as ErrorEvent).message || "WebSocket error",
			name: "WebSocketError",
			success: false,
		};

		if (this.debug) {
			this.log("WebSocket error: " + error, "error");
		}
		this.onError?.({
			conn: this.getConnectionInfo(),
			data: websocketError.message,
			error: websocketError,
		});
	}

	private handleUpdateMessage(event: MessageEvent): void {
		if (this.status === NewWebSocketStatus.CONNECTED) {
			const data: NewWebSocketInfo = {
				conn: this.getConnectionInfo(),
				data: event.data,
			};
			this.onUpdate?.(data);
		} else {
			this.onError?.({
				conn: this.getConnectionInfo(),
				data: event.data,
				event,
			});
		}
	}

	private clearReconnectTimer(): void {
		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer);
			this.reconnectTimer = null;
		}
	}

	private getConnectionInfo(): NewWebSocketConn {
		return {
			connectionName: this.connectionName,
			url: this.url,
			status: this.status,
		};
	}
}
