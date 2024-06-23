package controllers

import (
	"context"
	"encoding/json"
	"net/http"
	"os"
	"stock_project/initializers"
	"stock_project/middlewares"
	"stock_project/models"
	"stock_project/utils"
	"time"

	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
)

func setupCORS(w *http.ResponseWriter, r *http.Request) {
	(*w).Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	(*w).Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	(*w).Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept")
	(*w).Header().Set("Access-Control-Allow-Credentials", "true")
}

func handlePreflight(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
}

func SignUp(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w, r)
	if (*r).Method == "OPTIONS" {
		return
	}
	var body struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		Name     string `json:"name"`
		Profile  string `json:"profile"`
	}

	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		utils.ErrorOccured(w, http.StatusBadRequest, "Failed to read Body")
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), 10)
	if err != nil {
		utils.ErrorOccured(w, http.StatusBadRequest, "Failed In Hashing")
		return
	}

	user := models.User{Name: body.Name, Email: body.Email, Password: string(hash), Profile: body.Profile}

	result := initializers.DB.Create(&user)

	if result.Error != nil {
		utils.ErrorOccured(w, http.StatusBadRequest, "Failed In User Creation")
		return
	}
	w.WriteHeader(http.StatusOK)

}

func Login(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w, r)
	if r.Method == "OPTIONS" {
		handlePreflight(w, r)
		return
	}
	var body struct {
		Email    string
		Password string
	}

	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		utils.ErrorOccured(w, http.StatusBadRequest, "Failed to read Body")
		return
	}

	var user models.User
	initializers.DB.First(&user, "email = ?", body.Email)
	if user.ID == 0 {
		utils.ErrorOccured(w, http.StatusBadRequest, "Invalid Email And Pssword")
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password))

	if err != nil {
		utils.ErrorOccured(w, http.StatusBadRequest, "Invalid Credentials")
		return
	}
	expirationTime := time.Now().Add(30 * 24 * time.Hour)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID,
		"exp": expirationTime.Unix(),
	})

	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := token.SignedString([]byte(os.Getenv("JSON_SECRET")))
	if err != nil {
		utils.ErrorOccured(w, http.StatusBadRequest, "JWT Error")
		return
	}
	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    tokenString,
		Expires:  expirationTime,
		HttpOnly: true,
		SameSite: http.SameSiteNoneMode,
		Domain:   "localhost",
		Secure:   true,
	})
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"token": tokenString,
		"user":  user,
	})

}

func GetUserFromContext(ctx context.Context) (*models.User, bool) {
	user, ok := ctx.Value(middlewares.UserContextKey).(*models.User)
	if !ok {
		return nil, false
	}
	return user, true
}

func Validate(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w, r)
	if r.Method == "OPTIONS" {
		handlePreflight(w, r)
		return
	}
	user, ok := GetUserFromContext(r.Context())
	if !ok || user == nil {
		http.Error(w, "User not found in context", http.StatusUnauthorized)
		return
	}

	// Respond with user information
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "I Am Logged In",
		"user":    user,
	})
}
