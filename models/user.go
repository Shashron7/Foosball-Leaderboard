package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Username string `gorm:"unique" json:"username"`
	Password string `json:"password"`
	IsAdmin  bool   `json:"is_admin"`
	Score    int    `json:"score"`
}
