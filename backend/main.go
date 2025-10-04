package main

import (
	"vc-assist-backend/routes" // import your local routes

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Set up routes
	routes.SetupRoutes(r)

	// Run server
	r.Run(":8080") // localhost:8080
}
