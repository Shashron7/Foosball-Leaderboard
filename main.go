package main

import (
	"github.com/gin-gonic/gin"
	"foosball-leaderboard/routes"
	"foosball-leaderboard/database"
	"github.com/joho/godotenv"
	"github.com/gin-contrib/cors"
	"time"

)

func main() {

	// load env file 
	godotenv.Load()
	r := gin.Default()
	database.ConnectDatabase()

	// Allow frontend to talk to backend
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"https://foosball-leaderboard.vercel.app/"}, // your React dev server
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	
	// routes package to set up routes
	routes.SetupRoutes(r)

	r.Run(":8080") // Run on port 8080
}