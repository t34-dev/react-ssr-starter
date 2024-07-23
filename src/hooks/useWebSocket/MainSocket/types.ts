// Types for arguments and payload
export type SocketValue = string | boolean | number | null | Record<string, unknown> | unknown[];
export type SocketPayload<T extends SocketValue = SocketValue> = T;

// Interface for responses
export interface MainSocketRequest<T extends string, U extends SocketValue | undefined = undefined, V extends SocketPayload | undefined = undefined> {
	op: T;
	args?: U;
	data?: V;
	res?: [boolean, string];
}
export type MainSocketResponseDTO = MainSocketSubscribeResponseDTO | MainSocketSubscribeResponseDataDTO | MainSocketMessageResponseDTO

// export type MainSocketSendMessageArgs = MainSocketArgsValue | MainSocketRequest<string, MainSocketArgsValue>;
// export type MainSocketSubscribeCallback<T extends MainSocketSendMessageArgs> = (data: { req: T, res?: MainSocketRequest<any, any, any> }) => void;
type MainSubscribeCallback<T> = (data: { res: T, err: boolean }) => void;

export type MainSocketCallbackDTO = MainSubscribeCallback<MainSocketSubscribeResponseDataDTO|MainSocketMessageResponseDTO>


const fnSubscribe:MainSocketCallbackDTO  = ({err, res}) => {
	console.log(res, err)
}
// ================================ Sockets
export type MainSocketSubscribeRequestDTO = MainSocketRequest<'subscribe'|'unsubscribe', string>
export type MainSocketSubscribeResponseDTO = MainSocketRequest<'subscribe'|'unsubscribe', string>
export type MainSocketSubscribeResponseDataDTO = MainSocketRequest<'subscribe', string, SocketValue>

const subscribeRequest: MainSocketSubscribeRequestDTO = {
	op: 'subscribe',
	args: ['markets.BTN.10min', 'Test'],
};
const unsubscribeRequest: MainSocketSubscribeRequestDTO = {
	op: 'unsubscribe',
	args: ['markets.BTN.10min'],
};
const subscribeResponse: MainSocketSubscribeResponseDTO = {
	op: 'subscribe',
	topics: [
		['markets.BTN.10min', true],
		['Test', true],
	],
};
const subscribeResponseData: MainSocketSubscribeResponseDataDTO = {
	topic: 'markets.BTN.10min',
	timestamp: 1718484030037,
	data: {name: true}
};

// ================================ Requests
type SocketSubMessageRequestDTO<TArgs = SocketValue> = {
	op: string;
	args?: TArgs;
};

// type SocketMessageRequestDTO = {
// 	id: number;
// 	req: SocketSubMessageRequestDTO[];
// };


type SocketMessageResponseDTO = {
	id: number;
	res: SocketSubMessageTypeDTO[];
};

const messageRequest: SocketMessageRequestDTO = {
	id: 1,
	req: [
		{op: 'getMarkets', args: {name: 'USD', age: 11}},
		{op: 'getName'},
	],
};

const messageResponse: SocketMessageResponseDTO = {
	id: 1,
	res: [
		{op: 'getMarkets', args: {name: 'USD', age: 11}},
		{op: 'getName', data: 'zakon'},
	]
};


// (messageRequest.req?.[0] as SocketSubMessageMarketDTO).data?.markets


// ================================= Message Types
export type SocketMessageRequestDTO<T> = {
	id: number;
	subs: T;
};
export type SocketSubMessageTypeDTO<TOp extends string, TArgs extends SocketValue, TData extends SocketValue> = {
	op: TOp;
	args?: TArgs;
	data?: TData;
};
export type SocketSubMessageMarketDTO = SocketSubMessageTypeDTO<'getMarkets', {
	cat: string,
	value: number,
	name: string
} , {
	markets: string[]
}>
export type SocketSubMessageAssetDTO = SocketSubMessageTypeDTO<'getAssets', {
	cat: string,
	value: number,
} , {
	assets: string[]
}>

export type SocketSubMessageDTO = SocketSubMessageMarketDTO | SocketSubMessageAssetDTO



