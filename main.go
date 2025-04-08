package main

import (
	"github.com/gin-gonic/gin"
	"foosball-leaderboard/routes"
	"foosball-leaderboard/database"
)

func main() {
	r := gin.Default()
	database.ConnectDatabase()

	routes.SetupRoutes(r)

	r.Run(":8080") // Run on port 8080
}
