package email

import (
	"context"
	"fmt"
	"math/rand"
	"strconv"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/HenryGunadi/Taskme_Management_App/server/service/auth"
	"github.com/HenryGunadi/Taskme_Management_App/server/types"
	"google.golang.org/api/iterator"
)

func GenerateFourDigitNumber() int {
    // Seed the random number generator
    rand.Seed(time.Now().UnixNano())

    // Generate a random number between 1000 and 9999
    return rand.Intn(9000) + 1000
}

type Store struct {
	firestore *firestore.Client
}

func NewStore(firestoreClient *firestore.Client) *Store {
	return &Store{firestore: firestoreClient}
}

func (s *Store) DueDateTasks(ctx context.Context, userID string) ([]*types.Task, error) {
	var dueDateTasks []*types.Task
	// in dates
	now := time.Now()
	oneDayFromNow := now.Add(24 * time.Hour)

	// in unixtime
	nowUnix := now.Unix()
	oneDayFromNowUnix := oneDayFromNow.Unix()

	iter := s.firestore.Collection("tasks").Where("UserID", "==", userID).Where("DueDate", ">=", nowUnix).Where("DueDate", "<=", oneDayFromNowUnix).Documents(ctx)
	defer iter.Stop()

	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}

		if err != nil {
			return nil, err
		}

		dueDateTask := new(types.Task)
		if err := doc.DataTo(dueDateTask); err != nil {
			return nil, err
		}

		dueDateTasks = append(dueDateTasks, dueDateTask)
	}

	if len(dueDateTasks) == 0 {
		return nil, nil
	}

	return dueDateTasks, nil
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

func (s *Store) SendEmailOTP(ctx context.Context, userEmails []string) (int, error) {
	otp := GenerateFourDigitNumber()
	otpStr := strconv.Itoa(otp)
	content := fmt.Sprintf(`
	<p>Here is your verification code: %s</p>
	<p>Your verification token expires within 5 minutes</p>
	<p>Click <a href="http://localhost:5173/OTP">here</a> to verify</p>
	`, otpStr)

	if err := SendEmail(ctx, s.firestore, content, userEmails); err != nil {
		return 0, err
	}
	
	return otp, nil
}

func (s *Store) AddOTPToDatabase(ctx context.Context, otp *types.Otp) (string, error) {
	doc, _, err := s.firestore.Collection("otp").Add(ctx, otp)
	if err != nil {
		return "", err
	}

	return doc.ID, nil
}

func (s *Store) DeleteOTP(ctx context.Context) error {
	iter := s.firestore.Collection("otp").Where("Status", "==", false).Documents(ctx)
	defer iter.Stop()

	for {
		docRef, err := iter.Next()
		if err == iterator.Done {
			break
		}

		if err != nil {
			return err
		}

		docID := docRef.Ref.ID

		_, err = docRef.Ref.Delete(ctx)
		if err != nil {
			return err
		}
		
		fmt.Printf("otp with id : %v is deleted", docID)
	}

	return nil
}

func (s *Store) ValidateOTP(ctx context.Context, otpPayload types.OTPValidationPayload) error {
	otpData := new(types.Otp)
	fmt.Println("otpID", otpPayload.OtpID)
	doc := s.firestore.Collection("otp").Doc(otpPayload.OtpID)
	
	docSnap, err := doc.Get(ctx)
	if err != nil {
		return fmt.Errorf("error getting document snapshot")
	}

	if err := docSnap.DataTo(otpData); err != nil {
		return fmt.Errorf("error transefering snapshot")
	}

	if otpData.Status || time.Now().After(otpData.ExpiresAt) {
		return fmt.Errorf("otp is invalid")// OTP is invalid or expired
	}

	otpPayloadInt, err := strconv.Atoi(otpPayload.Otp)
	if err != nil {
		return err
	}

	// if otp payload is the same as real otp in db
	if otpPayloadInt == otpData.Otp {
		doc.Update(ctx, []firestore.Update{
			{
				Path: "Status",
				Value: true,
			},
		})
	}

	return nil
}

func (s *Store) GenerateJWT(ctx context.Context, secret []byte) (string, error) {
	jwtToken, err := auth.CreateJWT(secret, "")
	if err != nil {
		return "", err
	}

	_, _, err = s.firestore.Collection("jwtBlacklists").Add(ctx, &types.JwtBlacklists{
		Token: jwtToken,
		Status: false,
	})

	if err != nil {
		return "", err
	}
	
	return jwtToken, nil
}

func (s *Store) BlackListJWT(ctx context.Context, token string) error {
	_, _, err := s.firestore.Collection("JWTBlacklists").Add(ctx, map[string]interface{}{
		"token": token,
	})
	if err != nil {
		return err
	}

	return nil
}

func (s *Store) CheckBlackListsToken(ctx context.Context, token string) error {
	iter := s.firestore.Collection("JWTBlacklists").Where("token", "==", token).Documents(ctx)
	defer iter.Stop()

	for {
		_, err := iter.Next()
		if err == iterator.Done {
			break
		}

		if err != nil {
			return err
		}

		return fmt.Errorf("token is blacklisted")
	}

	return nil
}
