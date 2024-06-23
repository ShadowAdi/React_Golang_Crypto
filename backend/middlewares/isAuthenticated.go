package middlewares

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"stock_project/initializers"
	"stock_project/models"
	"stock_project/utils"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
)

const UserContextKey = "user"

func IsAuthenticated(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Get token from Authorization header
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			utils.ErrorOccured(w, http.StatusUnauthorized, "Authorization header not found")
			return
		}

		// Check if the token is a Bearer token
		tokenString := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer"))
		if tokenString == "" {
			utils.ErrorOccured(w, http.StatusUnauthorized, "Bearer token not found")
			return
		}

		// Parse the token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["HS256"])
			}
			return []byte(os.Getenv("JSON_SECRET")), nil
		})
		if err != nil {
			utils.ErrorOccured(w, http.StatusUnauthorized, "Invalid token")
			fmt.Println(err)
			return
		}

		// Validate token claims
		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			if float64(time.Now().Unix()) > claims["exp"].(float64) {
				utils.ErrorOccured(w, http.StatusUnauthorized, "Token has expired")
				return
			}

			var user models.User
			initializers.DB.First(&user, claims["sub"])

			if user.ID == 0 {
				utils.ErrorOccured(w, http.StatusUnauthorized, "User not found")
				return
			}

			ctx := context.WithValue(r.Context(), UserContextKey, user)
			r = r.WithContext(ctx)

			next.ServeHTTP(w, r)
		} else {
			utils.ErrorOccured(w, http.StatusUnauthorized, "Invalid token claims")
			return
		}
	})
}
