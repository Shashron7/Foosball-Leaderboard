package routes

import (
	"foosball-leaderboard/controllers"
	"foosball-leaderboard/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	api := router.Group("/api")

	// handlers for POST request to /signup and /login endpoints -- public endpoints
	api.POST("/signup", controllers.SignUp)
	api.POST("/login", controllers.Login)

	api.GET("/leaderboard",middleware.UserAuthMiddleware(),controllers.GetLeaderboard)

	adminRoutes := router.Group("/admin")
	adminRoutes.Use(middleware.AdminAuthMiddleware()) // apply Admin middleware 
	{
		adminRoutes.POST("/increase-score", controllers.IncreasePlayerScore)
		
		adminRoutes.POST("/clear-leaderboard",controllers.ClearLeaderboard)
	}

}
