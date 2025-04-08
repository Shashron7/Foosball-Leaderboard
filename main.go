package main

import (
	"github.com/gin-gonic/gin"
	"foosball-leaderboard/routes"
	"foosball-leaderboard/database"
	"github.com/joho/godotenv"

)

func main() {

	godotenv.Load()
	r := gin.Default()
	database.ConnectDatabase()

	

	routes.SetupRoutes(r)

	r.Run(":8080") // Run on port 8080
}
