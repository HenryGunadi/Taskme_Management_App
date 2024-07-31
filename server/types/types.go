package types

import (
	"context"

	"cloud.google.com/go/firestore"
)

type UserStore interface {
	GetUserByEmail(ctx context.Context, email string) (string, *User, error)
	AddUser(User) error
	CheckUserExists(email string) (bool, error)
	UploadImage(ctx context.Context, upload Upload) error
	ChangeUserSettings(ctx context.Context, userID string, user *User) error
	GetUserByID(ctx context.Context, userID string) (*User, error)
}

type TaskStore interface {
	AddTask(ctx context.Context, task Task) error
	GetAllTask(ctx context.Context, userID string) ([]*SendTask, error)
	DeleteTask(ctx context.Context, taskID string) error
	UpdateTaskStatus(ctx context.Context, taskID string) error
	EditTask(ctx context.Context, taskID string, updatedTask *Task) error
	GetDasboardTasks(ctx context.Context, userID string) ([]*DashboardTasks, error)
	DeleteCompletedTasks(ctx context.Context) error 
	AddDailyTask(userID string, ctx context.Context, dailyTask *DailyTasks) error
	GetDailyTasks(ctx context.Context, userID string) ([]*SendDailyTask, error)
	CompleteDailyTask(ctx context.Context, taskID string) error
	DeleteDailyTask(ctx context.Context, taskID string) error 
}

type UploadStore interface {
	DeletePrevUpload(ctx context.Context, currentTime int64, userID string) error
	GetUserProfilePict(userID string, ctx context.Context) (string, error)
}

type EmailStore interface {
	DueDateTasks(ctx context.Context, userID string) ([]*firestore.DocumentSnapshot, error)
	GetUserEmailsToSendEmail(ctx context.Context) ([]string, error)
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

type TaskPayload struct {
	Title string `json:"title" validate:"required"`
	Description string `json:"description" validate:"required"`
	Priority *string `json:"priority"`
	DueDate int64 `json:"dueDate" validate:"required"`
	Status *bool `json:"status"`
}

type Task struct {
	UserID string `json:"userID"`
	Title string `json:"title"`
	Description string `json:"description"`
	Priority *string `json:"priority"`
	DueDate int64 `json:"dueDate"`
	Status *bool `json:"status"`
}

type SendTask struct {
	TaskID string `json:"taskID"`
	UserID string `json:"userID"`
	Title string `json:"title"`
	Description string `json:"description"`
	Priority *string `json:"priority"`
	DueDate int64 `json:"dueDate"`
	Status *bool `json:"status"`
}

type DashboardTasks struct {
	TaskID string `json:"taskID"`	
	Title string `json:"title"`
	Status *bool `json:"status"`
	DueDate int64 `json:"dueDate"`
	Priority *string `json:"priority"`
}

type Time struct {
	Hour int64 `json:"hour"`
	Minute int64 `json:"minute"`
}

type DailyTasksPayload struct {
	Task string `json:"task" validate:"required"`
	Status bool `json:"status"`
	Time  *Time `json:"time" validate:"required"`
	Category *string `json:"category" validate:"required"`
}

type DailyTasks struct {
	UserID string `json:"userID"`
	Task string `json:"task"`
	Status bool `json:"status"`
	Time  *Time `json:"time"`
	Category *string `json:"category"`
}

type SendDailyTask struct {
	TaskID string `json:"taskID"`
	UserID string `json:"userID"`
	Task string `json:"task"`
	Status bool `json:"status"`
	Time  *Time `json:"time"`
	Category *string `json:"category"`
}

type ValidateUser func (token string) (int, error)
