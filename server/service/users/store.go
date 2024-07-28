package users

import (
	"context"
	"fmt"

	"cloud.google.com/go/firestore"
	"github.com/HenryGunadi/productivity-firebase/server/types"
	"google.golang.org/api/iterator"
)

type Store struct {
	fireStoreClient *firestore.Client
}

func NewStore(fireStoreClient *firestore.Client) *Store {
	return &Store{fireStoreClient: fireStoreClient}
}

func (s *Store) AddUser(user types.User) error {
	ctx := context.Background()
	// add user
	_, _, err := s.fireStoreClient.Collection("users").Add(ctx, user)
	if err != nil {
		return fmt.Errorf("add user error : %v", err)
	}

	return nil
}

func (s *Store) GetUserByEmail(ctx context.Context, email string) (string, *types.User, error) {
	iter := s.fireStoreClient.Collection("users").Where("Email", "==", email).Limit(1).Documents(ctx)
	// iterator stop when function exits	
	defer iter.Stop()
	
	doc, err := iter.Next()
	if err == iterator.Done {
		return "", nil, err
	}

	if err != nil {
		return "", nil, err
	}

	user := new(types.User)
	if err := doc.DataTo(user); err != nil {
		return "", nil, fmt.Errorf("error parsing user data : %v", err)
	}

	return doc.Ref.ID, user, nil
}

func (s *Store) CheckUserExists(email string) (bool, error) {
	ctx := context.Background()

	iter := s.fireStoreClient.Collection("users").Where("email", "==", email).Limit(1).Documents(ctx)
	defer iter.Stop()

	_, err := iter.Next()
	if err == iterator.Done {
		return false, nil
	}

	if err != nil {
		return false, err
	}

	return true, nil
}

func (s *Store) UploadImage(ctx context.Context, upload types.Upload) error {
	_, _, err := s.fireStoreClient.Collection("uploads").Add(ctx, upload)
	if err != nil {
		return fmt.Errorf("error uploading file upload to database : %v", err)
	}

	return  nil
}

func (s *Store) ChangeUserSettings(ctx context.Context, userID string, user *types.User) error {
	updates := make([]firestore.Update, 0)

	if user.FirstName != "" {
        updates = append(updates, firestore.Update{Path: "FirstName", Value: user.FirstName})
    }
    if user.LastName != "" {
        updates = append(updates, firestore.Update{Path: "LastName", Value: user.LastName})
    }
    if user.Email != "" {
        updates = append(updates, firestore.Update{Path: "Email", Value: user.Email})
    }
    if user.Password != "" {
        updates = append(updates, firestore.Update{Path: "Password", Value: user.Password})
    }
    if user.Bio != "" {
        updates = append(updates, firestore.Update{Path: "Bio", Value: user.Bio})
    }

	_, err := s.fireStoreClient.Collection("users").Doc(userID).Update(ctx, updates)
	if err != nil {
		return err
	}

	return nil
}

func (s *Store) GetUserByID(ctx context.Context, userID string) (*types.User, error) {
	docRef := s.fireStoreClient.Collection("users").Doc(userID)

	doc, err := docRef.Get(ctx)
	if err != nil {
		return nil, err
	}

	user := new(types.User)
	if err := doc.DataTo(user); err != nil {
		return nil, err
	}

	return user, nil
}




