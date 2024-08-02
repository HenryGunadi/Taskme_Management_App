package email

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"github.com/HenryGunadi/Taskme_Management_App/server/service/auth"
	"github.com/HenryGunadi/Taskme_Management_App/server/types"
	"github.com/HenryGunadi/Taskme_Management_App/server/utils"
	"github.com/gorilla/mux"
)

type Handler struct {
	store types.EmailStore
}

func NewHandler(store types.EmailStore) *Handler {
	return &Handler{store: store}
} 

func (h *Handler) RegisteredRoutes(r *mux.Router) {
	r.HandleFunc("/notification", h.handleGetNotification).Methods("GET")
}

func (h *Handler) handleGetNotification(w http.ResponseWriter, r *http.Request) {
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

	tasks, err := h.store.DueDateTasks(ctx, userID)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("querying tasks error : %v", err))
		return
	} else if tasks == nil {
		utils.WriteJSON(w, http.StatusOK, map[string]string {
			"tasks deadline": "no tasks",
		})
		return
	}

	utils.WriteJSON(w, http.StatusOK, tasks)
}

