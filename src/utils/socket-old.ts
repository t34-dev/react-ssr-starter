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

type KeyGetter<T> = (data: T) => string;
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

	getReqKeySubscribe?: KeyGetter<string>;
	getResKeySubscribe?: KeyGetter<string>;
};

export type NewWebSocketInfo = {
	error?: WebsocketError;
	conn?: NewWebSocketConn;
	data?: string;
	event?: MessageEvent;
};

type NewWebSocketStoreFunc = (res: string) => void
export type NewWebSocketStoreType = 'request' | 'subscribe' | 'unsubscribe';

type NewWebSocketStoreItem = {
	reqKey: string,
	type: NewWebSocketStoreType,
	func: NewWebSocketStoreFunc[],
}
export type NewWebSocketStore = Map<string, NewWebSocketStoreItem>;

// @ts-ignore
window['ws_store'] = new Map()

export class NewWebSocketClient {
	readonly connectionName: string;
	readonly options: NewWebSocketOptions;
	readonly url: string;
	readonly logger: boolean;
	readonly loggerMessage: boolean;
	private ws: WebSocket | null = null;
	private status: NewWebSocketStatus = NewWebSocketStatus.INIT;
	private prevStatus: NewWebSocketStatus = NewWebSocketStatus.INIT;
	private isChangePrevStatus = false;
	private reconnectTimeout: number;
	private reconnectTimer: NodeJS.Timeout | null = null;
	private isStopped: boolean = false;
	/**
	 * Store for storing requests
	 * @private
	 */
	private storedRequests: NewWebSocketStore = new Map<string, NewWebSocketStoreItem>();

	// Event handlers
	/**
	 * Process requests after reconnection
	 * @private
	 */
	private onRestore?: (data: NewWebSocketStore) => NewWebSocketStore;
	private onOpened?: (data: NewWebSocketInfo) => void;
	private onError?: (data: NewWebSocketInfo) => void;
	private onClosed?: (data: NewWebSocketInfo) => void;
	private onConnection?: (data: NewWebSocketInfo) => void;
	private onUpdate?: (data: NewWebSocketInfo) => void;

	constructor(options: NewWebSocketOptions) {
		this.connectionName = options.connectionName;
		this.url = options.url || 'url';
		this.logger = options.debugging || false;
		this.loggerMessage = options.debuggingMessages || false;
		this.reconnectTimeout = options.reconnectTimeout || 3000;

		const key = 'ws_store';
		const store = new Map
		// @ts-ignore
		if(!window?.[key]){
			// @ts-ignore
			window[key] = {[this.connectionName]: store}
		}else {
			// @ts-ignore
			window[key] = {...window[key], [this.connectionName]: store}
		}
		this.storedRequests = store;

		this.onRestore = options.onRestore;
		this.onOpened = options.onOpened;
		this.onError = options.onError;
		this.onClosed = options.onClosed;
		this.onConnection = options.onConnection;
		this.onUpdate = options.onUpdate;

		this.options = options
	}

	private log(msg: string, type: "log" | "error" | "warn" = "log"): void {
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
		if (this.logger) {
			this.log(`========================================== ${this.status}`);
		}
		if ([NewWebSocketStatus.CONNECTED].includes(this.status)) {
			if (this.logger) {
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
			if (this.logger) {
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
					this.storedRequests = new Map(newStore)
				}
			}
			for (const [, request] of this.storedRequests) {
				this.ws!.send(request.reqKey);
			}
		};
		this.ws.onclose = () => this.handleClose();
		this.ws.onerror = (error) => this.handleError(error);
		this.ws.onmessage = (event) => this.handleGetUpdateMessage(event);
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

		if (this.logger) {
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

		if (this.logger) {
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

	// call func for res
	getStore(data?: string): void{
		if(!data) return;
		const resKey = this.options.getResKeySubscribe?.(data);
		if(resKey){
			let func = this.storedRequests.get(resKey)?.func
			func?.map(fn=>fn(String(data)))
		}
	}
	setStore(data: string, type: NewWebSocketStoreType, func?: NewWebSocketStoreFunc): number{
		let reqKey = data
		const newReqKey = this.options.getReqKeySubscribe?.(data);
		if(newReqKey){
			reqKey = newReqKey
		}
		if(func){
			let newStoreData: NewWebSocketStoreItem | null = {
				func: [func],
				type,
				reqKey
			}
			switch (type) {
				case "subscribe":{
					let oldStoreData = this.storedRequests.get(reqKey)
					if(oldStoreData){
						newStoreData = {...oldStoreData, func: [...oldStoreData.func, func], }
					}
					break;
				}
				case "unsubscribe":{
					let oldStoreData = this.storedRequests.get(reqKey)
					if(oldStoreData){
						const newFunc = oldStoreData.func.filter(elem=>elem === func)
						newStoreData = {...oldStoreData, func: newFunc}
					}
					if(newStoreData.func.length <= 0){
						newStoreData = null
					}
					break
				}
			}
			if(newStoreData){
				this.storedRequests.set(reqKey, newStoreData)
				return newStoreData.func.length
			} else {
				this.storedRequests.delete(reqKey)
			}
		}else {
			if(type === 'unsubscribe'){
				this.storedRequests.delete(reqKey)
			}
		}
		return 0
	}

	private send(data: string, type: NewWebSocketStoreType, func?: NewWebSocketStoreFunc){
		if (this.ws && this.status === NewWebSocketStatus.CONNECTED) {
			if (this.loggerMessage) {
				let parseData = data;
				try {
					parseData = JSON.parse(data);
				} catch (e) {}
				this.log("Sent message: " + parseData);
			}
			const count = this.setStore(data, type, func)
			if(count === 1) this.ws.send(data);
		} else {
			if (this.logger) {
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
	}
	sendMessage(data: string, func?: NewWebSocketStoreFunc): void {
		this.send(data, 'request', func);
	}
	subscribe(
		data: string,
		func?: NewWebSocketStoreFunc
	): void {
		this.send(data, 'subscribe', func);
	}
	unsubscribe(
		data: string,
	): void {
		this.send(data, 'unsubscribe');
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
		return new Map(this.storedRequests);
	}

	private handleOpen(): void {
		if ([NewWebSocketStatus.CONNECTED].includes(this.status)) return;
		this.status = NewWebSocketStatus.CONNECTED;
		this.clearReconnectTimer();
		if (this.logger) {
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

		if (this.logger) {
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
			if (this.logger) {
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

		if (this.logger) {
			this.log("WebSocket error: " + error, "error");
		}
		this.onError?.({
			conn: this.getConnectionInfo(),
			data: websocketError.message,
			error: websocketError,
		});
	}

	private handleGetUpdateMessage(event: MessageEvent): void {
		if (this.status === NewWebSocketStatus.CONNECTED) {
			const data: NewWebSocketInfo = {
				conn: this.getConnectionInfo(),
				data: event.data,
			};
			this.getStore(data.data)
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
