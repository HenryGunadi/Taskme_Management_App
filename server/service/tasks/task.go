package tasks

import (
	"context"
	"fmt"
	"time"

	"cloud.google.com/go/firestore"
)

func HandleDeleteTask24Hour(ctx context.Context, time time.Time, client *firestore.Client) {
	taskStore := &Store{firestore: client}
	if err := taskStore.DeleteCompletedTasks(ctx); err != nil {
		fmt.Printf("error delete completed tasks automation : %v", err)
	} else {
		fmt.Printf("Completed tasks are deleted at %v", time)
	}
	
	if err := taskStore.ResetDailyTask(ctx); err != nil {
		fmt.Printf("reset daily task error : %v", err)
	} else {
		fmt.Printf("daily task are reset at :  %v", time)
	}
}