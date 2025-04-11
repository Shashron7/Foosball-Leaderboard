package middleware

import (
	"foosball-leaderboard/utils"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)

func AdminAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing or invalid Authorization header"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		claims, err := utils.ValidateToken(tokenString)
		if err != nil || !claims.IsAdmin {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: admin access required"})
			c.Abort()
			return
		}

		// Optional: set user info in context if needed later
		c.Set("username", claims.Username)
		c.Set("is_admin", true)

		c.Next()
	}
}
