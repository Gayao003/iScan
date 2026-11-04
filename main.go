package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"
)

type Item struct {
	ID          string            `json:"id"`
	Code        string            `json:"code"`
	Name        string            `json:"name"`
	ImageURL    string            `json:"imageUrl"`
	Description string            `json:"description,omitempty"`
	Attributes  map[string]string `json:"attributes,omitempty"`
	IsActive    bool              `json:"isActive"`
}

type InventoryCount struct {
	ID              string    `json:"id"`
	ItemID          string    `json:"itemId"`
	Code            string    `json:"code"`
	ItemName        string    `json:"itemName"`
	LocationID      string    `json:"locationId"`
	CountedQuantity float64   `json:"countedQuantity"`
	Status          string    `json:"status"`
	CapturedAt      time.Time `json:"capturedAt"`
}

var mockItems = map[string]Item{
	"ISCAN-DEMO-001": {
		ID:          "item-001",
		Code:        "ISCAN-DEMO-001",
		Name:        "Premium Cotton T-Shirt",
		ImageURL:    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
		Description: "100% breathable organic combed cotton casual tee.",
		Attributes:  map[string]string{"category": "Apparel"},
		IsActive:    true,
	},
	"0123456789012": {
		ID:          "item-002",
		Code:        "0123456789012",
		Name:        "Classic Denim Jeans",
		ImageURL:    "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80",
		Description: "Standard fit straight-leg durable denim jeans.",
		Attributes:  map[string]string{"category": "Apparel"},
		IsActive:    true,
	},
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	http.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"status":"ok","service":"iScan Go Companion Service"}`)
	})

	http.HandleFunc("/api/items/by-code/", func(w http.ResponseWriter, r *http.Request) {
		code := strings.TrimPrefix(r.URL.Path, "/api/items/by-code/")
		code = strings.TrimSpace(code)

		w.Header().Set("Content-Type", "application/json")
		if item, found := mockItems[code]; found {
			json.NewEncoder(w).Encode(map[string]Item{"item": item})
		} else {
			w.WriteHeader(http.StatusNotFound)
			fmt.Fprintf(w, `{"error":"NOT_FOUND","message":"Item not found"}`)
		}
	})

	fmt.Printf("iScan Go Companion server listening on :%s\n", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		fmt.Fprintf(os.Stderr, "Server failed: %v\n", err)
	}
}
