package email

import (
	"context"
	"fmt"

	"cloud.google.com/go/firestore"
	"github.com/HenryGunadi/Taskme_Management_App/server/config"
	"gopkg.in/gomail.v2"
)

func SendEmail(ctx context.Context, client *firestore.Client, emailBody string, userEmails []string) error {
	envData := config.Envs

	msg := gomail.NewMessage()
    msg.SetHeader("From", envData.Email)
    msg.SetHeader("Subject", "TASKME")
	body := emailBody

    msg.SetBody("text/html", body)

    n := gomail.NewDialer("smtp.gmail.com", 587, envData.Email, envData.EmailPass)

	for _, email := range userEmails {
		msg.SetHeader("To", email)
		
		// Send the email
		if err := n.DialAndSend(msg); err != nil {
			return err
		} else {
			fmt.Printf("Email is sent to %v", email)
		}
	}

	return nil
}
