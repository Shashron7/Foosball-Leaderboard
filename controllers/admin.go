package controllers

import (
	"foosball-leaderboard/database"
	"foosball-leaderboard/models"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

type ScoreUpdateInput struct {
	Username string `json:"username"`
}

func IncreasePlayerScore(c *gin.Context) {
	var input ScoreUpdateInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	username := strings.ToLower(input.Username)

	var user models.User
	if err := database.DB.Where("username = ?", username).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Player not found"})
		return
	}

	// Prevent score update for admin
	if user.Username == "admin" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot update score for admin"})
		return
	}

	user.Score += 1
	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update score"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "Score updated",
		"username": user.Username,
		"score":    user.Score,
	})
}

func ClearLeaderboard(c *gin.Context) {

	// reset scores of all players
	err := database.DB.Model(&models.User{}).Where("1 = 1").Update("score", 0).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to clear leaderboard"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Leaderboard cleared successfully"})
}
