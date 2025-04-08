package utils


import (
	"time"
	"os"
	"github.com/golang-jwt/jwt/v5"
)

var jwtKey = []byte(getSecret())

func getSecret() string {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return "dev_secret_key" // fallback for local dev
	}
	return secret
}


func GenerateToken(username string, isAdmin bool) (string, error) {
	claims := jwt.MapClaims{
		"username": username,
		"is_admin": isAdmin,
		"exp":      time.Now().Add(time.Hour * 72).Unix(), // Token valid for 3 days
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtKey)
}