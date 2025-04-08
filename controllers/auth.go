package controllers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"

	"foosball-leaderboard/models"
	"foosball-leaderboard/database"
	"foosball-leaderboard/utils"
)


func SignUp(c *gin.Context) {
	var input models.User

	// checks if the input has valid JSON structure
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})

		return
	}

	// Hash the password 

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error" : "Password hashing failed"})
		return 
	}

	user := models.User{
		Username: strings.ToLower(input.Username),
		Password: string(hashedPassword),
		IsAdmin:  false,
		Score:    0,
	}

	if err := database.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username already taken"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User registered successfully"})


}


// login function 

func Login(c *gin.Context) {
	var input models.User
	if err:= c.ShouldBindJSON(&input); err!=nil {
		c.JSON(http.StatusBadRequest, gin.H{"error" : "Invalid input"})
		return 
	}

	username := strings.ToLower(input.Username)
	password := input.Password
	

	// admin login (hardcoded)
	if username == "admin" && password == "shash" {
		token, err := utils.GenerateToken("admin", true)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Token generation failed"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"token": token, "is_admin": true})
		return
	}

	// Player login 

	var user models.User

	if err := database.DB.Where("username = ?", username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	// Compare password
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect password"})
		return
	}
	
	// if password is correct , generate token 
	token, err := utils.GenerateToken(user.Username, false)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Token generation failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token, "is_admin": false})


}


