package email

import (
	"context"
	"fmt"

	"cloud.google.com/go/firestore"
	"github.com/HenryGunadi/productivity-firebase/server/config"
	"gopkg.in/gomail.v2"
)

func SendEmail(ctx context.Context, client *firestore.Client) {
	emailStore := &Store{firestore: client}
	envData := config.Envs
	userEmails, err := emailStore.GetUserEmailsToSendEmail(ctx)
	if err != nil {
		fmt.Printf("error getting user emails : %v", err)
	} else if (userEmails == nil) {
		fmt.Println("no user that has upcoming deadline tasks")
	}

	msg := gomail.NewMessage()
    msg.SetHeader("From", envData.Email)
    msg.SetHeader("Subject", "TASKME")
	body := `
		<p>You have unfinished tasks to do.</p>
		<p>Click <a href="http://example.com/taskme">here</a> to view your tasks.</p>
	`

    msg.SetBody("text/html", body)

    n := gomail.NewDialer("smtp.gmail.com", 587, envData.Email, envData.EmailPass)

	for _, email := range userEmails {
		msg.SetHeader("To", email)
		
		// Send the email
		if err := n.DialAndSend(msg); err != nil {
			fmt.Printf("error sending email to %v", email)
			continue
		} else {
			fmt.Printf("Email is sent to %v", email)
		}
	}
}
