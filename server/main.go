package main

import (
	"context"
	"log"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/HenryGunadi/productivity-firebase/server/api"
	"github.com/HenryGunadi/productivity-firebase/server/config"
	"github.com/HenryGunadi/productivity-firebase/server/service/email"
	"github.com/HenryGunadi/productivity-firebase/server/service/tasks"
	"google.golang.org/api/option"
)

func main() {
	ctx := context.Background()
	credentials := config.Envs

	if credentials.FireStoreProjectId == "" || credentials.FSServiceAccKey == "" {
		log.Fatal("credentials are empty")
	}

	client, err := firestore.NewClient(ctx, credentials.FireStoreProjectId, option.WithCredentialsFile(credentials.FSServiceAccKey))
	if err != nil {
		log.Fatalf("Failed to create Firestore client: %v", err)
	}
	// preventing data leaks
	defer client.Close()

	// api server
	server := api.NewApiServer(":8080",client)
	go func() {
		if err := server.Run(); err != nil {
			log.Fatalf("error running the server : %v", err)
		}
	}()

	
	ticker := time.NewTicker(24 * time.Hour)
	defer ticker.Stop()
	
	for time := range ticker.C {
		email.SendEmail(ctx, client)
		tasks.HandleDeleteTask24Hour(ctx, time, client)
	}
}
