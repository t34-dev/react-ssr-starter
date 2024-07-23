// Ping request
import { MainSocketRequest } from '../types.ts';

// ################################## Ping-Pong

const pingRequest = 'ping';
const pingResponse = 'pong';

const helloRequest: MainSocketRequest<'hello'> = { id: 1, op: 'hello' };

// Ping response
const helloResponse: MainSocketRequest<'hello'> = { id: 1, op: 'hello' };

// ################################################################################# Subscribe
// Subscribe request
const subscribeRequest: MainSocketRequest<'subscribe', string> = {
	op: 'subscribe',
	args: 'markets.BTN.10min',
};
const subscribeResponse: MainSocketRequest<'subscribe', string, boolean> = {
	op: 'subscribe',
	args: 'markets.BTN.10min',
	data: true,
};

// Subscribe response (array of strings)
const subscribeResponseData: MainSocketRequest<'subscribe', string, string[]> =
	{
		op: 'subscribe',
		args: 'markets.BTN.10min',
		data: ['hi', 'ho'],
	};

// Subscribe response (complex object)
const subscribeResponseDataComplex: MainSocketRequest<
	'subscribe',
	string,
	{ status: boolean; timestamp: number; arr: string[] }
> = {
	op: 'subscribe',
	args: 'markets.BTN.10min',
	data: {
		status: true,
		timestamp: 1717833130,
		arr: ['hi', 'ho'],
	},
};

// ################################################################################# Unsubscribe

// Unsubscribe request
const unsubscribeRequest: MainSocketRequest<'unsubscribe', string> = {
	op: 'unsubscribe',
	args: 'markets.BTN.10min',
};
// Unsubscribe response
const unsubscribeResponse: MainSocketRequest<'unsubscribe', string, boolean> = {
	op: 'unsubscribe',
	args: 'markets.BTN.10min',
	data: true,
};

// ################################################################################# Message

// Request to get the name
const messageRequest: MainSocketRequest<'message', string> = {
	id: 2,
	op: 'message',
	args: 'get_name',
};

// Response with the name (string)
const messageResponse: MainSocketRequest<'message', string, string> = {
	id: 2,
	op: 'message',
	args: 'get_name',
	data: 'zakon47',
};

// Response with the name (object)
const messageResponseObject: MainSocketRequest<
	'message',
	string,
	{ name: string }
> = {
	id: 2,
	op: 'message',
	args: 'get_name',
	data: { name: 'zakon47' },
};

// 1. Request for the current time from the server
const getTimeRequest: MainSocketRequest<'get_time'> = { id: 3, op: 'get_time' };

type TimeStamp = {
	timeStamp: number;
	arr: string[];
	data?: {
		age: number;
		value: number;
	};
};
const getTimeResponse: MainSocketRequest<'get_time', undefined, TimeStamp> = {
	id: 3,
	op: 'get_time',
	data: {
		timeStamp: 1686746954231,
		arr: [],
		data: {
			age: 11,
			value: 11,
		},
	},
};

// 2. Sending an array of objects to the backend
const dataArray = [
	{ id: 1, value: 'apple' },
	{ id: 2, value: 'banana' },
	{ id: 3, value: 'cherry' },
];

const sendDataRequest: MainSocketRequest<
	'send_data',
	{ data: typeof dataArray }
> = {
	id: 4,
	op: 'send_data',
	args: { data: dataArray },
};

const sendDataResponse: MainSocketRequest<
	'send_data',
	{ data: typeof dataArray },
	string
> = {
	id: 4,
	op: 'send_data',
	args: { data: dataArray }, // You can return the sent data in the response
	data: 'Data received successfully', // Or just a success message
};

// 3. Subscribe to BTC-USDT price updates (1 minute, 5 hours)
const subscribeMarketRequest: MainSocketRequest<
	'subscribe',
	{ symbol: string; timeframe: string; candles: string }
> = {
	op: 'subscribe',
	args: { symbol: 'BTC-USDT', timeframe: '1m', candles: '5h' },
};

const subscribeMarketResponse: MainSocketRequest<
	'subscribe',
	{ symbol: string; timeframe: string; candles: string },
	string
> = {
	op: 'subscribe',
	args: { symbol: 'BTC-USDT', timeframe: '1m', candles: '5h' },
	data: 'Subscribed to BTC-USDT market data',
};

export {
	pingRequest,
	pingResponse,
	helloRequest,
	helloResponse,
	subscribeRequest,
	subscribeResponse,
	subscribeResponseData,
	subscribeResponseDataComplex,
	messageRequest,
	messageResponse,
	messageResponseObject,
	getTimeRequest,
	getTimeResponse,
	sendDataRequest,
	sendDataResponse,
	subscribeMarketRequest,
	subscribeMarketResponse,
	unsubscribeRequest,
	unsubscribeResponse,
};
