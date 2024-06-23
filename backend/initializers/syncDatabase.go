package initializers

import (
	"stock_project/models"
)

func SyncDatabase() {
	DB.AutoMigrate(&models.User{})
}
