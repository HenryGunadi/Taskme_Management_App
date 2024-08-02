package tasks

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"github.com/HenryGunadi/Taskme_Management_App/server/service/auth"
	"github.com/HenryGunadi/Taskme_Management_App/server/types"
	"github.com/HenryGunadi/Taskme_Management_App/server/utils"
	"github.com/go-playground/validator"
	"github.com/gorilla/mux"
)

type Handler struct {
	store types.TaskStore
}

func NewHandler(store types.TaskStore) *Handler {
	return &Handler{store: store}
}

func (h *Handler) RegisteredRoutes(r *mux.Router) {
	r.HandleFunc("/task", h.handleAddTask).Methods("POST")
	r.HandleFunc("/task", h.handleGetAllTask).Methods("GET")
	r.HandleFunc("/task/{id}", h.handleDeleteTask).Methods("DELETE")
	r.HandleFunc("/task/{id}", h.handleCompleteTask).Methods("PATCH")
	r.HandleFunc("/task/update/{id}", h.handleEditTask).Methods("PATCH")
	r.HandleFunc("/dashboardTasks", h.handleGetDashboardTask).Methods("GET")
	r.HandleFunc("/task/daily", h.handleAddDailyTask).Methods("POST")
	r.HandleFunc("/task/daily", h.handleGetDailyTasks).Methods("GET")
	r.HandleFunc("/task/daily/{id}", h.handleCompleteDailyTask).Methods("PATCH")
	r.HandleFunc("/task/daily/{id}", h.handleDeleteDailyTask).Methods("DELETE")
}

func (h *Handler) handleAddTask(w http.ResponseWriter, r *http.Request) {
	var payload types.TaskPayload
	ctx := context.Background()

	// authorize user
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("user is not authorized"))
		return
	}

	token := strings.TrimPrefix(authHeader, "Bearer ")

	userIDStr, err := auth.ValidateUser(token)
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("user is not authorized : %v", err))
		return
	}

	if err := utils.ParseJSON(r, &payload); err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid JSON payload  : %v", err))
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload validation : %v", errors))
		return
	}

	// add Task
	if err := h.store.AddTask(ctx, types.Task{
		UserID: userIDStr,
		Title: payload.Title,
		Description: payload.Description,
		Priority: payload.Priority,
		DueDate: payload.DueDate,
		Status: payload.Status,
	}); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("adding task error : %v", err))
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]string{
		"status add task": "success",
	})
}

func (h *Handler) handleGetAllTask(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("user is not authorized"))
		return
	}

	token := strings.TrimPrefix(authHeader, "Bearer ")

	userIDStr, err := auth.ValidateUser(token)
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("user is not authorized : %v", err))
		return
	}

	data, err := h.store.GetAllTask(ctx, userIDStr)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("error iterating user tasks : %v", err))
		return
	}

	utils.WriteJSON(w, http.StatusOK, data)
}

func (h *Handler) handleDeleteTask(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("user is not authorized"))
		return
	}

	token := strings.TrimPrefix(authHeader, "Bearer ")

	_, err := auth.ValidateUser(token)
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("user is not authorized : %v", err))
		return
	}

	vars := mux.Vars(r)
	taskID , ok:= vars["id"]
	if !ok {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("task id not found"))
		return
	}

	if err := h.store.DeleteTask(ctx, taskID); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("error removing task : %v", err))
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]string{
		"status": "deleted",
	})
}

func (h *Handler) handleCompleteTask(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("user is not authorized"))
		return
	}

	token := strings.TrimPrefix(authHeader, "Bearer ")

	_, err := auth.ValidateUser(token)
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("user is not authorized : %v", err))
		return
	}

	vars := mux.Vars(r)
	taskID, ok := vars["id"]
	if !ok {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("missing required request parameter"))
		return
	}

	if err := h.store.UpdateTaskStatus(ctx, taskID); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("error completing task : %v", err))
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]bool{
		"status": true,
	})
}

func (h *Handler) handleEditTask(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	var payload types.Task

	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("user is not authorized"))
		return
	}

	token := strings.TrimPrefix(authHeader, "Bearer ")

	_, err := auth.ValidateUser(token)
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("user is not authorized : %v", err))
		return
	}

	if err := utils.ParseJSON(r, &payload); err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid JSON payload : %v", err))
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload validation : %v", errors))
		return
	}

	vars := mux.Vars(r)
	taskID, ok := vars["id"]
	if !ok {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("missing task id"))
		return
	}

	if err := h.store.EditTask(ctx, taskID, &payload); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("error updating task : %v", err))
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]bool{
		"updated": true,
	})
}

func (h *Handler) handleGetDashboardTask(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("user is not authorized"))
		return
	}

	token := strings.TrimPrefix(authHeader, "Bearer ")

	userID, err := auth.ValidateUser(token)
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("user is not authorized : %v", err))
		return
	}

	tasks, err := h.store.GetDasboardTasks(ctx, userID)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("error getting dashboard tasks : %v", err))
		return
	}

	utils.WriteJSON(w, http.StatusOK, tasks)
}

func (h *Handler) handleAddDailyTask(w http.ResponseWriter, r *http.Request) {
	var payload types.DailyTasksPayload
	ctx := context.Background()

	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("user is not authorized"))
		return
	}

	token := strings.TrimPrefix(authHeader, "Bearer ")

	userID, err := auth.ValidateUser(token)
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("user is not authorized : %v", err))
		return
	}

	if err := utils.ParseJSON(r, &payload); err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid JSON payload : %v", err))
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload validation : %v", errors))
		return
	}

	dailyTask := &types.DailyTasks{
		UserID: userID,
		Task: payload.Task,
		Status: payload.Status,
		Time: &types.Time{
			Hour: payload.Time.Hour,
			Minute: payload.Time.Minute,
		},
		Category: payload.Category,
	}

	if err := h.store.AddDailyTask(userID, ctx, dailyTask); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("error adding daily task : %v", err))
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]bool{
		"status": true,
	})
}

func (h *Handler) handleGetDailyTasks(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("user is not authorized"))
		return
	}

	token := strings.TrimPrefix(authHeader, "Bearer ")

	userID, err := auth.ValidateUser(token)
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("user is not authorized : %v", err))
		return
	}

	dailyTasks, err := h.store.GetDailyTasks(ctx, userID)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("error getting daily tasks : %v", err))
		return
	} else if dailyTasks == nil {
		utils.WriteJSON(w, http.StatusOK, dailyTasks)
		return
	}

	utils.WriteJSON(w, http.StatusOK, dailyTasks)
}

func (h *Handler) handleCompleteDailyTask(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	vars := mux.Vars(r)
	taskID, ok := vars["id"]
	if !ok {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("missing required request parameter"))
		return
	}

	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("user is not authorized"))
		return
	}

	token := strings.TrimPrefix(authHeader, "Bearer ")

	_, err := auth.ValidateUser(token)
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("user is not authorized : %v", err))
		return
	}

	if err := h.store.CompleteDailyTask(ctx, taskID); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("error completing daily task : %v", err))
		return
	}
	
	utils.WriteJSON(w, http.StatusOK, map[string]bool{
		"completed": true,
	})
}

func (h *Handler) handleDeleteDailyTask(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("user is not authorized"))
		return
	}

	token := strings.TrimPrefix(authHeader, "Bearer ")

	_, err := auth.ValidateUser(token)
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("user is not authorized : %v", err))
		return
	}

	vars := mux.Vars(r)
	taskID, ok := vars["id"]
	if !ok {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("missing required request argument : %v", err))
		return
	}

	if err := h.store.DeleteDailyTask(ctx, taskID); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("error deleting daily task : %v", err))
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]bool {
		"deleted": true,
	})
}
