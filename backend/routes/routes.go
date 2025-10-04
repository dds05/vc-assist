package routes

import (
	"vc-assist-backend/controllers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		api.GET("/hello", controllers.HelloHandler)
	}
}
