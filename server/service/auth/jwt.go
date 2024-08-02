package auth

import (
	"fmt"
	"time"

	"github.com/HenryGunadi/Taskme_Management_App/server/config"
	"github.com/golang-jwt/jwt"
)

func CreateJWT(secret []byte, userID string) (string, error) {
	JWTExpiration := time.Second * time.Duration(config.Envs.JWTExpirationInSeconds)
	
	// make jwt
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userID": userID,
		"expiredAt": time.Now().Add(JWTExpiration).Unix(),
	})

	signedToken, err := token.SignedString(secret)
	if err != nil {
		return "", fmt.Errorf("cannot convert token to string : %v", err)
	}

	return signedToken, nil
}

func ValidateUser(tokenStr string) (string, error) {
	// parse tokenstring
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(config.Envs.JWTSecret), nil
	})

	if err != nil {
		return "", fmt.Errorf("error parsing jwt string")
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid{
		if userIDStr, ok := claims["userID"].(string); ok {
			return userIDStr, nil
		}

		return "", fmt.Errorf("user id not found in token claims")
	} else {
		return "", fmt.Errorf("invalid token claims")
	}
}