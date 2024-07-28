package email

import (
	"context"
	"fmt"
	"time"

	"cloud.google.com/go/firestore"
)

type Store struct {
	firestore *firestore.Client
}

func NewStore(firestoreClient *firestore.Client) *Store {
	return &Store{firestore: firestoreClient}
}

func (s *Store) DueDateTasks(ctx context.Context, userID string) ([]*firestore.DocumentSnapshot, error) {
	// in dates
	now := time.Now()
	oneDayFromNow := now.Add(24 * time.Hour)

	// in unixtime
	nowUnix := now.Unix()
	oneDayFromNowUnix := oneDayFromNow.Unix()

	query := s.firestore.Collection("tasks").Where("UserID", "==", userID).Where("DueDate", ">=", nowUnix).Where("DueDate", "<=", oneDayFromNowUnix)

	docs, err := query.Documents(ctx).GetAll()
	if err != nil {
		return nil, fmt.Errorf("error querying docs")
	}

	if len(docs) == 0 {
		return nil, nil
	}	

	return docs, nil
}

func (s *Store) GetUserEmailsToSendEmail(ctx context.Context) ([]string, error) {
	var userEmails []string

	// in dates
	now := time.Now()
	oneDayFromNow := now.Add(24 * time.Hour)

	// in unixtime
	nowUnix := now.Unix()
	oneDayFromNowUnix := oneDayFromNow.Unix()

	// tasks query
	tasksQuery := s.firestore.Collection("tasks").Where("DueDate", ">=", nowUnix).Where("DueDate", "<=", oneDayFromNowUnix)

	// users query
	docs, err := tasksQuery.Documents(ctx).GetAll()
	if err != nil {
		return nil, err
	}

	if len(docs) == 0 {
		return nil, fmt.Errorf("no deadline taks are found")
	}

	userIDSets := make(map[string]bool)
	for _, doc := range docs {
		data := doc.Data()
		
		userID, ok := data["UserID"].(string)
		if !ok {
			continue
		}

		userIDSets[userID] = true		
	}

	for userID := range userIDSets {
		userDoc, err := s.firestore.Collection("users").Doc(userID).Get(ctx)
		if err != nil {
			return nil, err
		}

		if userDoc.Exists() {
			userData := userDoc.Data()

			email, ok := userData["Email"].(string)
			if !ok {
				continue
			}

			userEmails = append(userEmails, email)
		}
	}

	if len(userEmails) > 0 {
		return userEmails, nil
	}

	return nil, nil
}

