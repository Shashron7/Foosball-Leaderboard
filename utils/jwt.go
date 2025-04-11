package utils


import (
	"time"
	"os"
	"github.com/golang-jwt/jwt/v5"
	"errors"
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


// Custom struct for decoded claims
type Claims struct {
	Username string
	IsAdmin  bool
	jwt.RegisteredClaims
}

// Validate token string 
func ValidateToken(tokenString string) (*Claims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Check token signing method etc.
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return jwtKey, nil
	})

	if err != nil || !token.Valid {
		return nil, errors.New("invalid or expired token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, errors.New("could not parse claims")
	}

	username, _ := claims["username"].(string)
	isAdmin, _ := claims["is_admin"].(bool)

	return &Claims{
		Username: username,
		IsAdmin:  isAdmin,
	}, nil
}