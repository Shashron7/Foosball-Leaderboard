package routes

import (
	"github.com/gin-gonic/gin"
	"foosball-leaderboard/controllers"
)

func SetupRoutes(router *gin.Engine) {
	api := router.Group("/api")

	api.POST("/signup", controllers.SignUp)
	api.POST("/login", controllers.Login)

	// Protected routes will be added later with middleware
}
