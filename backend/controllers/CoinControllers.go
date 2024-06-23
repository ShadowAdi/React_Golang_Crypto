package controllers

import (
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"stock_project/utils"
	"time"
)

type Coin struct {
	CoinId             string    `json:"id"`
	Symbol             string    `json:"symbol"`
	Name               string    `json:"name"`
	CurrentPrice       int64     `json:"current_price"`
	MarketCap          int64     `json:"market_cap"`
	MarketCapRank      int64     `json:"market_cap_rank"`
	High24h            int32     `json:"high_24h"`
	Low24h             int64     `json:"low_24h"`
	PriceChange24H     int64     `json:"price_change_24h"`
	MarketCapChange24h float64   `json:"market_cap_change_24h"`
	ATH                int64     `json:"ath"`
	ATL                int64     `json:"atl"`
	ATH_Date           time.Time `json:"ath_date"`
	ATL_Date           time.Time `json:"atl_date"`
}

type PriceChangePercentage24h struct {
	Aed float64 `json:"aed"`
	Ars float64 `json:"ars"`
	Aud float64 `json:"aud"`
	// Add other currencies if needed
}

type Data struct {
	Price                    float64                  `json:"price"`
	PriceBtc                 string                   `json:"price_btc"`
	MarketCap                string                   `json:"market_cap"`
	PriceChangePercentage24h PriceChangePercentage24h `json:"price_change_percentage_24h"`
	MarketCapBtc             string                   `json:"market_cap_btc"`
	TotalVolume              string                   `json:"total_volume"`
	TotalVolumeBtc           string                   `json:"total_volume_btc"`
	Sparkline                string                   `json:"sparkline"`
	Content                  interface{}              `json:"content"`
}

type CoinItem struct {
	Id            string  `json:"id"`
	CoinId        int32   `json:"coin_id"`
	Name          string  `json:"name"`
	Symbol        string  `json:"symbol"`
	MarketCapRank int     `json:"market_cap_rank"`
	Thumb         string  `json:"thumb"`
	Small         string  `json:"small"`
	Large         string  `json:"large"`
	Slug          string  `json:"slug"`
	PriceBtc      float64 `json:"price_btc"`
	Score         int     `json:"score"`
	Data          Data    `json:"data"`
}

type TrendingResponse struct {
	Coins []struct {
		Item CoinItem `json:"item"`
	} `json:"coins"`
}

func TrendingCoins(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	url := "https://api.coingecko.com/api/v3/search/trending"

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		// Handle error
		utils.ErrorOccured(w, http.StatusInternalServerError, "Failed to create request")
		return
	}

	req.Header.Add("accept", "application/json")
	req.Header.Add("x-cg-api-key", os.Getenv("API_KEY"))

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		// Handle error
		utils.ErrorOccured(w, http.StatusInternalServerError, "Failed to send request")
		return
	}
	defer res.Body.Close()

	// Copy response body to the http.ResponseWriter
	_, err = io.Copy(w, res.Body)
	if err != nil {
		// Handle error
		utils.ErrorOccured(w, http.StatusInternalServerError, "Failed to write response")
		return
	}
}

func SearchCoins(w http.ResponseWriter, r *http.Request) {
	coin := r.URL.Query().Get("coin")
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	if coin == "" {
		w.Header().Set("Content-Type", "application/json")

		// Write the response body to the client
		_, err := w.Write([]byte("You Don't Have any Saved"))

		if err != nil {
			// Handle error
			utils.ErrorOccured(w, http.StatusInternalServerError, "Failed to write response body")
			return
		}
		return
	}

	// if coin == "" {
	// 	w.Header().Set("Content-Type", "application/json")

	// 	// Write the response body to the client
	// 	_, err1 := w.Write([]byte("You Don't Save Anything"))
	// 	if err1 != nil {
	// 		// Handle error
	// 		utils.ErrorOccured(w, http.StatusInternalServerError, "Failed to write response body")
	// 		return
	// 	}
	// 	return
	// }

	url := "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=" + coin

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("accept", "application/json")
	req.Header.Add("x-cg-api-key", os.Getenv("API_KEY"))

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		// Handle error
		utils.ErrorOccured(w, http.StatusInternalServerError, "Failed to send request")
		return
	}
	defer res.Body.Close()

	// Read the response body
	responseBody, err := ioutil.ReadAll(res.Body)
	if err != nil {
		// Handle error
		utils.ErrorOccured(w, http.StatusInternalServerError, "Failed to read response body")
		return
	}

	// Set the content type header to application/json
	w.Header().Set("Content-Type", "application/json")

	// Write the response body to the client
	_, err = w.Write(responseBody)
	if err != nil {
		// Handle error
		utils.ErrorOccured(w, http.StatusInternalServerError, "Failed to write response body")
		return
	}

}

func MarketCoins(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	url := "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		// Handle error
		utils.ErrorOccured(w, http.StatusInternalServerError, "Failed to create request")
		return
	}

	req.Header.Add("accept", "application/json")
	req.Header.Add("x-cg-api-key", os.Getenv("API_KEY"))

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		// Handle error
		utils.ErrorOccured(w, http.StatusInternalServerError, "Failed to send request")
		return
	}
	defer res.Body.Close()

	// Read the response body
	responseBody, err := ioutil.ReadAll(res.Body)
	if err != nil {
		// Handle error
		utils.ErrorOccured(w, http.StatusInternalServerError, "Failed to read response body")
		return
	}

	// Set the content type header to application/json
	w.Header().Set("Content-Type", "application/json")

	// Write the response body to the client
	_, err = w.Write(responseBody)
	if err != nil {
		// Handle error
		utils.ErrorOccured(w, http.StatusInternalServerError, "Failed to write response body")
		return
	}
}

func SearchByCoinName(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()["q"]
	if query[0] == "" {
		return
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	url := "https://api.coingecko.com/api/v3/search?query=" + query[0]

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("accept", "application/json")
	req.Header.Add("x-cg-api-key", os.Getenv("API_KEY"))

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		utils.ErrorOccured(w, http.StatusInternalServerError, "Failed to send request")
		return
	}
	defer res.Body.Close()

	responseBody, err := ioutil.ReadAll(res.Body)
	if err != nil {
		// Handle error
		utils.ErrorOccured(w, http.StatusInternalServerError, "Failed to read response body")
		return
	}

	w.Header().Set("Content-Type", "application/json")

	// Write the response body to the client
	_, err = w.Write(responseBody)
	if err != nil {
		// Handle error
		utils.ErrorOccured(w, http.StatusInternalServerError, "Failed to write response body")
		return
	}

}

func GetSingleCoin(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()["q"]
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	url := "https://api.coingecko.com/api/v3/coins/" + query[0] + "?localization=false&tickers=false&market_data=true&community_data=false&developer_data=true&sparkline=false"

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("accept", "application/json")
	req.Header.Add("x-cg-api-key", os.Getenv("API_KEY"))
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		utils.ErrorOccured(w, http.StatusInternalServerError, "Failed to send request")
		return
	}
	defer res.Body.Close()

	responseBody, err := ioutil.ReadAll(res.Body)
	if err != nil {
		utils.ErrorOccured(w, http.StatusInternalServerError, "Failed to read response body")
		return
	}

	w.Header().Set("Content-Type", "application/json")

	_, err = w.Write(responseBody)
	if err != nil {
		// Handle error
		utils.ErrorOccured(w, http.StatusInternalServerError, "Failed to write response body")
		return
	}

}

func GetChartCoin(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()["q"]
	days := r.URL.Query()["days"]

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	url := "https://api.coingecko.com/api/v3/coins/" + query[0] + "/market_chart?days=" + days[0] + "&interval=daily&vs_currency=usd"

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("accept", "application/json")
	req.Header.Add("x-cg-api-key", os.Getenv("API_KEY"))
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		utils.ErrorOccured(w, http.StatusInternalServerError, "Failed to send request")
		return
	}
	defer res.Body.Close()

	responseBody, err := ioutil.ReadAll(res.Body)
	if err != nil {
		utils.ErrorOccured(w, http.StatusInternalServerError, "Failed to read response body")
		return
	}

	w.Header().Set("Content-Type", "application/json")

	_, err = w.Write(responseBody)
	if err != nil {
		// Handle error
		utils.ErrorOccured(w, http.StatusInternalServerError, "Failed to write response body")
		return
	}

}
