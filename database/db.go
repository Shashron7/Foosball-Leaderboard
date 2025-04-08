package database

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"foosball-leaderboard/models"
)

var DB *gorm.DB

func ConnectDatabase() {

	db, err := gorm.Open(sqlite.Open("foosball.db"),&gorm.Config{})

	if err != nil {
		panic("Failed to connect to database!")
	}

	db.AutoMigrate(&models.User{})
	DB = db
}

