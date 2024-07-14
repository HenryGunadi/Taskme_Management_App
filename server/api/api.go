package api

import (
	"log"
	"net/http"

	"cloud.google.com/go/firestore"
	"github.com/HenryGunadi/productivity-firebase/server/service/uploads"
	"github.com/HenryGunadi/productivity-firebase/server/service/users"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

type APIServer struct {
	addr string
	fireStoreClient *firestore.Client
}

func NewApiServer(addr string,fireStoreClient *firestore.Client) *APIServer {
	return &APIServer{
		addr: addr,
		fireStoreClient: fireStoreClient,
	}
}

func (s *APIServer) Run() error {
	router := mux.NewRouter()
	subrouter := router.PathPrefix("/api/v1").Subrouter()

	// user service
	userStore := users.NewStore(s.fireStoreClient)
	userHandler := users.NewHandler(userStore)
	userHandler.RegisteredRoutes(subrouter)
	// upload service
	uploadStore := uploads.NewStore(s.fireStoreClient)
	uploadHandler := uploads.NewHandler(userStore, uploadStore)
	uploadHandler.RegisteredRoutes(subrouter)

	// cors
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
        AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowedHeaders:   []string{"Authorization", "Content-Type"},
        AllowCredentials: true,
	})
	corsHandler := c.Handler(router)

	log.Println("Listening on", s.addr)
	return http.ListenAndServe(s.addr, corsHandler)
}