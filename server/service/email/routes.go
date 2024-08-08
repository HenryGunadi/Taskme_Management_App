package email

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/HenryGunadi/Taskme_Management_App/server/config"
	"github.com/HenryGunadi/Taskme_Management_App/server/service/auth"
	"github.com/HenryGunadi/Taskme_Management_App/server/types"
	"github.com/HenryGunadi/Taskme_Management_App/server/utils"
	"github.com/go-playground/validator"
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
	r.HandleFunc("/otp", h.handleOTP).Methods("POST")
	r.HandleFunc("/validateOTP", h.handleValidateOTP).Methods("POST")
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

func (h *Handler) handleOTP(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	var emailPayload []string 

	// parse json
	if err := utils.ParseJSON(r, &emailPayload); err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid JSON payload : %v", err))
		return
	}

	// send email otp to user
	otp, err := h.store.SendEmailOTP(ctx, emailPayload)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("error sending email otp : %v", err))
		return
	}
	
	expirationTime := time.Now().Add(5 * time.Minute)

	// add otp info to database
	otpID, err := h.store.AddOTPToDatabase(ctx, &types.Otp{
		Otp: otp,
		ExpiresAt: expirationTime,
		Status: false,
	})
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("error adding otp doc to collection : %v", err))
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]string{
		"otp": otpID,
	})
}

func (h *Handler) handleValidateOTP(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	var otpPayload types.OTPValidationPayload
	
	if err := utils.ParseJSON(r, &otpPayload); err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid JSON payload : %v", err))
		return
	}

	if err := utils.Validate.Struct(otpPayload); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload validation : %v", errors))
		return
	}

	// validate otp
	if err := h.store.ValidateOTP(ctx, otpPayload); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("error validate otp : %v", err))
		return
	}

	secret := config.Envs.JWTSecret

	// get otp jwt token
	otpToken, err := h.store.GenerateJWT(ctx, []byte(secret))
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("error generating otp jwt token : %v", err))
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]string{
		"token": otpToken,
	})
}


