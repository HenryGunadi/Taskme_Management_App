package types

import (
	"context"
)

type UserStore interface {
	GetUserByEmail(ctx context.Context, email string) (string, *User, error)
	AddUser(User) error
	CheckUserExists(email string) (bool, error)
	UploadImage(ctx context.Context, upload Upload) error
	ChangeUserSettings(ctx context.Context, userID string, user *User) error
}

type UploadStore interface {
	DeletePrevUpload(ctx context.Context, currentTime int64, userID string) error
	GetUserProfilePict(userID string, ctx context.Context) (string, error)
}

type User struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Password  string `json:"password"`
	Email     string `json:"email"`
	Bio string `json:"bio"`
}

type RegisterUserPayload struct {
	FirstName string `json:"firstName" validate:"required"`
	LastName  string `json:"lastName" validate:"required"`
	Email     string `json:"email" validate:"required"`
	Password  string `json:"password" validate:"required"`
}

type LoginUserPayload struct {
	Password string `json:"password" validate:"required"`
	Email    string `json:"email" validate:"required"`
}

type Upload struct {
	UserID 		string `json:"userID"`
	UploadName 	string `json:"uploadName"`
	Url 		string `json:"url"`
	CreatedAt 	int64 `json:"createdAt"`
}

type UploadPayload struct {
	UploadName 	string `json:"uploadName" validate:"required"`
	Url 		string `json:"url" validate:"required"`
}

type ValidateUser func (token string) (int, error)
