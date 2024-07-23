package main

import "fmt"

// Types for arguments and payload
type WebSocketArgsValue map[string]any
type WebSocketArgs []WebSocketArgsValue
type WebSocketPayload any

// Interface for requests
type WebSocketRequest struct {
	Op   string              `json:"op"`
	Args *WebSocketArgsValue `json:"args,omitempty"`
}

// Interface for responses
type WebSocketResponse struct {
	Res  string              `json:"res"`
	Args *WebSocketArgsValue `json:"args,omitempty"`
	P    WebSocketPayload    `json:"p,omitempty"`
}

func main() {
	// Ping request
	pingRequest := WebSocketRequest{Op: "ping"}
	fmt.Println("Ping request:", pingRequest)

	// Ping response
	pongResponse := WebSocketResponse{Res: "pong"}
	fmt.Println("Ping response:", pongResponse)

	// Subscribe request
	subscribeRequest := WebSocketRequest{
		Op:   "subscribe",
		Args: stringToArgsValue("markets.BTN.10min"),
	}
	fmt.Println("Subscribe request:", subscribeRequest)

	// Subscribe response (array of strings)
	subscribeResponseSimple := WebSocketResponse{
		Res:  "subscribe",
		Args: stringToArgsValue("markets.BTN.10min"),
		P:    WebSocketPayload([]string{"hi", "ho"}),
	}
	fmt.Println("Subscribe response (simple):", subscribeResponseSimple)

	// Subscribe response (complex object)
	subscribeResponseComplex := WebSocketResponse{
		Res:  "subscribe",
		Args: stringToArgsValue("markets.BTN.10min"),
		P: WebSocketPayload(map[string]any{
			"status":    true,
			"timestamp": 1717833130,
			"arr":       []string{"hi", "ho"},
		}),
	}
	fmt.Println("Subscribe response (complex):", subscribeResponseComplex)

	// Request to get the name
	messageRequest := WebSocketRequest{
		Op:   "message",
		Args: stringToArgsValue("get_name"),
	}
	fmt.Println("Message request:", messageRequest)

	// Response with the name (string)
	messageResponseString := WebSocketResponse{
		Res:  "message",
		Args: stringToArgsValue("get_name"),
		P:    WebSocketPayload("zakon47"),
	}
	fmt.Println("Message response (string):", messageResponseString)

	// Response with the name (object)
	messageResponseObject := WebSocketResponse{
		Res:  "message",
		Args: stringToArgsValue("get_name"),
		P:    WebSocketPayload(map[string]string{"name": "zakon47"}),
	}
	fmt.Println("Message response (object):", messageResponseObject)

	// 1. Request for the current time from the server
	getTimeRequest := WebSocketRequest{Op: "get_time"}
	fmt.Println("Get time request:", getTimeRequest)

	getTimeResponse := WebSocketResponse{
		Res: "get_time",
		P: WebSocketPayload(map[string]any{
			"timeStamp": 1686746954231,
			"arr":       []string{},
			"data": map[string]int{
				"age":   11,
				"value": 11,
			},
		}),
	}
	fmt.Println("Get time response:", getTimeResponse)

	// 2. Sending an array of objects to the backend
	dataArray := []map[string]string{
		{"id": "1", "value": "apple"},
		{"id": "2", "value": "banana"},
		{"id": "3", "value": "cherry"},
	}

	sendDataRequest := WebSocketRequest{
		Op:   "send_data",
		Args: &WebSocketArgsValue{"data": dataArray},
	}
	fmt.Println("Send data request:", sendDataRequest)

	sendDataResponse := WebSocketResponse{
		Res:  "send_data",
		Args: &WebSocketArgsValue{"data": dataArray},
		P:    WebSocketPayload("Data received successfully"),
	}
	fmt.Println("Send data response:", sendDataResponse)

	// 3. Subscribe to BTC-USDT price updates (1 minute, 5 hours)
	subscribeMarketRequest := WebSocketRequest{
		Op: "subscribe_market",
		Args: &WebSocketArgsValue{
			"symbol":    "BTC-USDT",
			"timeframe": "1m",
			"candles":   "5h",
		},
	}
	fmt.Println("Subscribe market request:", subscribeMarketRequest)

	subscribeMarketResponse := WebSocketResponse{
		Res: "subscribe_market",
		Args: &WebSocketArgsValue{
			"symbol":    "BTC-USDT",
			"timeframe": "1m",
			"candles":   "5h",
		},
		P: WebSocketPayload("Subscribed to BTC-USDT market data"),
	}
	fmt.Println("Subscribe market response:", subscribeMarketResponse)
}

// Helper function to convert string to *WebSocketArgsValue
func stringToArgsValue(s string) *WebSocketArgsValue {
	return &WebSocketArgsValue{"": s}
}
