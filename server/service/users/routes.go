package users

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"github.com/HenryGunadi/productivity-firebase/server/config"
	"github.com/HenryGunadi/productivity-firebase/server/service/auth"
	"github.com/HenryGunadi/productivity-firebase/server/types"
	"github.com/HenryGunadi/productivity-firebase/server/utils"
	"github.com/go-playground/validator"
	"github.com/gorilla/mux"
)

type Handler struct {
	store types.UserStore
}

func NewHandler(store types.UserStore) *Handler {
	return &Handler{store: store}
}

func (h *Handler) RegisteredRoutes(router *mux.Router) {
	router.HandleFunc("/register", h.handleRegister).Methods("POST")
	router.HandleFunc("/login", h.handleLogin).Methods("POST")
	router.HandleFunc("/settings", h.handleUserSettings).Methods("POST")
	router.HandleFunc("/user", h.handleFetchUser).Methods("GET")
}

func (h *Handler) handleRegister(w http.ResponseWriter, r *http.Request) {
	var payload types.RegisterUserPayload
	ctx := context.Background()

	if err := utils.ParseJSON(r, &payload); err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid JSON payload %v", err))
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("validate payload error :%v", errors))
		return
	}

	_, _, err := h.store.GetUserByEmail(ctx, payload.Email)
	if err == nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("email already exists"))
		return
	}

	hashedPass, err := auth.HashedPassword(payload.Password)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("error making hashed password : %v", err))
		return
	}
	
	err = h.store.AddUser(types.User{
		FirstName: payload.FirstName,
		LastName: payload.LastName,
		Email: payload.Email,
		Password: hashedPass,
	})
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("error creating new user : %v", err))
		return
	}

	utils.WriteJSON(w, http.StatusCreated, payload)
}	

func (h *Handler) handleLogin(w http.ResponseWriter, r *http.Request) {
	var payload types.LoginUserPayload
	ctx := context.Background()

	// parse JSON payload
	if err := utils.ParseJSON(r, &payload); err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid JSON payload %v", err))
		return
	}

	// check validation payload
	if err := utils.Validate.Struct(payload); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("validate payload error : %v", errors))
		return
	}

	// check and get user by email
	userId, user, err := h.store.GetUserByEmail(ctx, payload.Email)
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid email : %v", err))
		return
	}
	
	// check password
	if err := auth.ComparePass(user.Password, []byte(payload.Password)); err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid password : %v", err))
		return
	}

	// create jwt auth
	token, err := auth.CreateJWT([]byte(config.Envs.JWTSecret), userId)
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("error creating jwt : %v", err))
		return
	}


	utils.WriteJSON(w, http.StatusAccepted, map[string]string{
		"token": token,
		"firstName": user.FirstName,
		"lastName": user.LastName,
		"userID": userId,
		"email": user.Email,
		"bio": user.Bio,
	})
}

func (h *Handler) handleUserSettings(w http.ResponseWriter, r *http.Request) {
	var payload types.User

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

	// parse JSON payload
	if err := utils.ParseJSON(r, &payload); err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid JSON payload %v", err))
		return
	}

	if payload.Password != "" {
		newPassHashed, err := auth.HashedPassword(payload.Password)
		if err != nil {
			utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("hashing new password error : %v", err))
		}
		
		payload.Password = newPassHashed
	}


	err = h.store.ChangeUserSettings(ctx, userIDStr, &payload)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("error changing user settings : %v", err))
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]bool{
		"status": true,
	})
}

func (h *Handler) handleFetchUser(w http.ResponseWriter, r *http.Request) {
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

	user, err := h.store.GetUserByID(ctx, userIDStr)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("could not get user data : %v", err))
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]string{
		"firstName": user.FirstName,
		"lastName": user.LastName,
		"email": user.Email,
		"bio": user.Bio,
	})
}