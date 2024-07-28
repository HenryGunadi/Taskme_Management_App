package tasks

import (
	"context"
	"fmt"

	"cloud.google.com/go/firestore"
	"github.com/HenryGunadi/productivity-firebase/server/types"
	"google.golang.org/api/iterator"
)

type Store struct {
	firestore *firestore.Client
}

func NewStore(firestoreClient *firestore.Client) *Store {
	return &Store{firestore: firestoreClient}
}

func (s *Store) AddTask(ctx context.Context, task types.Task) error {
	_, _, err := s.firestore.Collection("tasks").Add(ctx, task)
	if err != nil {
		return fmt.Errorf("add user error : %v", err)
	}

	return nil
}

func (s *Store) GetAllTask(ctx context.Context, userID string) ([]*types.SendTask, error) {
	var allTask []*types.SendTask

	iter := s.firestore.Collection("tasks").Where("UserID", "==", userID).Documents(ctx)
	defer iter.Stop()

	for {
		doc, err := iter.Next()
		
		if err == iterator.Done {
			break
		}

		if err != nil {
			return nil, err
		}
		
		task := new(types.SendTask)
		if err = doc.DataTo(task); err != nil {
			return nil, err
		}
		task.TaskID = doc.Ref.ID
		
		allTask = append(allTask, task)
	}

	return allTask, nil
}

func (s *Store) DeleteTask(ctx context.Context, taskID string) error {
	doc := s.firestore.Collection("tasks").Doc(taskID)

	_, err := doc.Delete(ctx)
	if err != nil {
		return err
	}

	return nil
}

func (s *Store) DeleteCompletedTasks(ctx context.Context) error {
	iter := s.firestore.Collection("tasks").Where("Status", "==", true).Documents(ctx)
	defer iter.Stop()

	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return err
		}
		
		if _, err := doc.Ref.Delete(ctx); err != nil {
			return err
		}
	}

	return nil
}

func (s *Store) UpdateTaskStatus(ctx context.Context, taskID string) error {
	doc := s.firestore.Collection("tasks").Doc(taskID)
	
	_, err := doc.Update(ctx, []firestore.Update{
		{
			Path: "Status",
			Value: true,
		},
	})
	if err != nil {
		return err
	}

	return nil
}

func (s *Store) EditTask(ctx context.Context, taskID string, updatedTask *types.Task) error {
	doc := s.firestore.Collection("tasks").Doc(taskID)

	_, err := doc.Set(ctx, updatedTask)
	if err != nil {
		return err
	}

	return nil
}

func (s *Store) GetDasboardTasks(ctx context.Context, userID string) ([]*types.DashboardTasks, error) {
	var tasks []*types.DashboardTasks

	iter := s.firestore.Collection("tasks").Where("UserID", "==", userID).Documents(ctx)
	defer iter.Stop()

	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		
		if err != nil {
			return nil, err
		}

		task := new(types.DashboardTasks)
		if err := doc.DataTo(task); err != nil {
			return nil, err
		}
		task.TaskID = doc.Ref.ID

		tasks = append(tasks, task)
	}

	return tasks, nil
}