package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"connectrpc.com/connect"
	"github.com/rs/cors"
	"github.com/tunajam/founder-index/backend/gen/founderindex/v1/founderindexv1connect"
	"github.com/tunajam/founder-index/backend/internal/handler"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8091"
	}

	svc := handler.New()
	path, h := founderindexv1connect.NewFounderIndexServiceHandler(svc,
		connect.WithInterceptors(),
	)

	mux := http.NewServeMux()
	mux.Handle(path, h)

	// Health check
	mux.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		fmt.Fprintln(w, "ok")
	})

	corsHandler := cors.New(cors.Options{
		AllowedOrigins: []string{
			"http://localhost:3000",
			"http://localhost:3456",
			"https://*.vercel.app",
			"https://founderindex.com",
		},
		AllowedMethods: []string{
			http.MethodGet,
			http.MethodPost,
		},
		AllowedHeaders: []string{
			"Content-Type",
			"Connect-Protocol-Version",
			"Connect-Timeout-Ms",
			"Grpc-Timeout",
			"X-Grpc-Web",
			"X-User-Agent",
			"Authorization",
		},
		ExposedHeaders: []string{
			"Grpc-Status",
			"Grpc-Message",
			"Grpc-Status-Details-Bin",
		},
		AllowCredentials: true,
	}).Handler(mux)

	server := &http.Server{
		Addr:    ":" + port,
		Handler: h2c.NewHandler(corsHandler, &http2.Server{}),
	}

	log.Printf("Founder Index API listening on :%s", port)
	if err := server.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}
