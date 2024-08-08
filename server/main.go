package main

import (
	"context"
	"log"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/HenryGunadi/Taskme_Management_App/server/api"
	"github.com/HenryGunadi/Taskme_Management_App/server/config"
	"github.com/HenryGunadi/Taskme_Management_App/server/service/email"
	"github.com/HenryGunadi/Taskme_Management_App/server/service/tasks"
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
	
	emailStore := email.NewStore(client)
	userEmails, err := emailStore.GetUserEmailsToSendEmail(ctx)
	
	for time := range ticker.C {
		if err := email.SendEmail(ctx, client, `
		<p>You have unfinished tasks to do.</p>
		<p>Click <a href="http://example.com/taskme">here</a> to view your tasks.</p>
		`, userEmails); err != nil {
		log.Printf("error sending email notification : %v", err)
		}

		tasks.HandleDeleteTask24Hour(ctx, time, client)
	}
}
