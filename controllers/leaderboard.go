package controllers

import (
	"foosball-leaderboard/database"
	"foosball-leaderboard/models"
	"github.com/gin-gonic/gin"
	"net/http"
)

func GetLeaderboard(c *gin.Context) {
	var players []models.User

	if err := database.DB.Order("score desc").Find(&players).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch leaderboard"})
		return
	}

	// We’ll return only username & score, not passwords
	var response []gin.H
	for _, player := range players {
		
		response = append(response, gin.H{
			"username": player.Username,
			"score":    player.Score,
		})
	}

	c.JSON(http.StatusOK, response)
}
