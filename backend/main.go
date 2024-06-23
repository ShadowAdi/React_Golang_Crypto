package main

import (
	"fmt"
	"net/http"
	"os"
	"stock_project/initializers"
	"stock_project/routes"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.DBConnect()
	initializers.SyncDatabase()
}

func main() {
	r := routes.Router()

	port := os.Getenv("PORT")
	if port == "" {
		port = ":8090" // Default to port 8090 if PORT is not set
	}

	err := http.ListenAndServe(port, r)
	if err != nil {
		fmt.Println("There is an error in server: ", err)
	}
}
