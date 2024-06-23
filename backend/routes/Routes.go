package routes

import (
	"net/http"
	"stock_project/controllers"
	"stock_project/middlewares"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func Router() http.Handler {
	router := mux.NewRouter()

	// Public Routes
	router.HandleFunc("/api/Register", controllers.SignUp).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/Login", controllers.Login).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/Trending", controllers.TrendingCoins).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/Markets", controllers.MarketCoins).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/Search", controllers.SearchCoins).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/SearchByName", controllers.SearchByCoinName).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/SingleCoin", controllers.GetSingleCoin).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/SingleCoinChart", controllers.GetChartCoin).Methods("GET", "OPTIONS")

	// Protected Routes
	router.Handle("/api/Validate", middlewares.IsAuthenticated(http.HandlerFunc(controllers.Validate))).Methods("GET", "OPTIONS")

	// CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type", "Accept"},
		AllowCredentials: true,
	})

	return c.Handler(router)
}
