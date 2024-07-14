package uploads

import (
	"context"
	"fmt"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"
)

type Store struct {
	fireStoreClient *firestore.Client
}

func NewStore(fireStoreClient *firestore.Client) *Store {
	return &Store{fireStoreClient: fireStoreClient}
}

func (s *Store) DeletePrevUpload(ctx context.Context, currentTime int64, userID string) error {
    fmt.Printf("Starting to delete documents created before: %v for userID: %s\n", currentTime, userID)

    query := s.fireStoreClient.Collection("uploads").
        Where("CreatedAt", "<", currentTime).
        Where("UserID", "==", userID)

    iter := query.Documents(ctx)
    defer iter.Stop()

    deleted := false

    for {
        doc, err := iter.Next()
        if err == iterator.Done {
            break
        }
        if err != nil {
            return fmt.Errorf("error iterating over documents: %v", err)
        }

        // Delete the document
        _, err = doc.Ref.Delete(ctx)
        if err != nil {
            return fmt.Errorf("error deleting document %s: %v", doc.Ref.ID, err)
        }

        fmt.Printf("Document deleted: %s\n", doc.Ref.ID)
        deleted = true
    }

    if !deleted {
        fmt.Println("No documents matched the deletion criteria.")
    }

    return nil
}

func (s * Store) GetUserProfilePict(userID string, ctx context.Context) (string, error) {
    query := s.fireStoreClient.Collection("uploads").Where("UserID", "==", userID).Limit(1)
    iter := query.Documents(ctx)
    // close when function unmount
    defer iter.Stop()

    doc, err := iter.Next()
    if err == iterator.Done {
        return "", fmt.Errorf("profile picture not found : %v", err)
    }

    if err != nil {
        return "", fmt.Errorf("querying user profile picture error : %v", err)
    }

    url, err := doc.DataAt("Url")
    if err != nil {
        return "", fmt.Errorf("error getting url field in the document : %v", err)
    }

    imgUrl, ok := url.(string)
    if !ok {
        return "", fmt.Errorf("error parsing url type to string")
    }

    if imgUrl == "" {
        return "", fmt.Errorf("image url is empty")
    }

    return imgUrl, nil
}
