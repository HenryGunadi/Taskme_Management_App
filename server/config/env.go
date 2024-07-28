package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	FireStoreProjectId 	string
	FSServiceAccKey    	string
	JWTSecret 			string
	JWTExpirationInSeconds 	int64
	Email string
	EmailPass string
	EmailRecipient string
}

var Envs = initConfig()

func initConfig() Config {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("initialize env error : %v", err)
	}

	return Config{
		FireStoreProjectId: getEnv("FIRESTORE_PROJECT_ID", "taskme-project-cf4cf"),
		FSServiceAccKey: getEnv("FIRESTORE_SERVICE_ACCOUNT_KEY_FILEPATH", "../taskme-credentials.json"),
		JWTSecret: getEnv("JWT_SECRET", "secret-secret-hello"),
		JWTExpirationInSeconds: getEnvAsInt("JWT_EXPIRATION", 3600 * 24 * 7),
		Email: getEnv("EMAIL", "henrywilliamgunadi25@gmail.com"),
		EmailPass: getEnv("EMAIL_PASS", "09desember2004Hen."),
		EmailRecipient: getEnv("EMAIL_RECIPIENT", "henrywilliamgunadi09@gmail.com"),
	}
}

func getEnv(key string, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}

	return fallback
}

func getEnvAsInt(key string, fallback int64) int64 {
	if value, ok := os.LookupEnv(key); ok {
		valueInt, err := strconv.ParseInt(value, 10, 64)
		if err != nil {
			return fallback
		}
		
		return valueInt
	}
	
	return fallback
} 