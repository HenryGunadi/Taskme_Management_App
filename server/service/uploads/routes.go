package uploads

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/HenryGunadi/Taskme_Management_App/server/service/auth"
	"github.com/HenryGunadi/Taskme_Management_App/server/types"
	"github.com/HenryGunadi/Taskme_Management_App/server/utils"
	"github.com/go-playground/validator"
	"github.com/gorilla/mux"
)

type Handler struct {
	store types.UserStore
	uploadStore types.UploadStore
}

func NewHandler(store types.UserStore, uploadStore types.UploadStore) *Handler {
	return &Handler{store: store, uploadStore: uploadStore}
}

func (h *Handler) RegisteredRoutes(router *mux.Router) {
	router.HandleFunc("/uploads", h.handleUpload).Methods("POST")
	router.HandleFunc("/fetchUploads", h.handleFetchUploads).Methods("GET")
}

func (h *Handler) handleUpload(w http.ResponseWriter, r *http.Request) {
	var payload types.UploadPayload
	ctx := context.Background()

	// get token from header request
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
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid JSON payload : %v", err))
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("validate payload error : %v", errors))
		return
	}

	currentTime := time.Now().Unix()
	// upload image
	if err := h.store.UploadImage(ctx, types.Upload{
		UserID: userIDStr,
		UploadName: payload.UploadName,
		Url: payload.Url,
		CreatedAt: currentTime,
	}); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("error uploading file : %v", err))
		return
	}

	// delete prev image
	if err := h.uploadStore.DeletePrevUpload(ctx, currentTime, userIDStr); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("failed to delete previous file : %v", err))
	}

	utils.WriteJSON(w, http.StatusCreated, map[string]string{
		"fileUploaded": payload.UploadName,
		"fileURL": payload.Url,
	})
}

func (h *Handler) handleFetchUploads(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("user is not authorized"))
		return
	}

	tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

	userID, err := auth.ValidateUser(tokenStr)
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("token is not valid : %v", err))
		return
	}

	imgUrl, err := h.uploadStore.GetUserProfilePict(userID, ctx)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("error fetching user profile picture : %v", err))
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]string{
		"imgUrl": imgUrl,
	})
}