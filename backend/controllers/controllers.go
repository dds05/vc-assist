package controllers

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/gin-gonic/gin"
)

func HelloHandler(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Hello from Go backend!",
	})
}

func AIInterferenceHandler(c *gin.Context) {
	body, err := c.GetRawData()
	if err != nil {
		c.JSON(400, gin.H{"error": "Failed to read body"})
		return
	}
	// bodyStr := string(body)
	// fmt.Println("Raw POST body:", bodyStr)

	pythonPayload := map[string]interface{}{
		"question": body,
		"top_k":    1,
	}
	payloadBytes, _ := json.Marshal(pythonPayload)

	// Call Python microservice
	resp, err := http.Post("http://localhost:8000/ask", "application/json", bytes.NewBuffer(payloadBytes))
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to call AI microservice", "details": err.Error()})
		return
	}
	defer resp.Body.Close()

	// Read response from Python
	respBody, err := ioutil.ReadAll(resp.Body)

	// fmt.Println("Response from AI Mircroservice :", respBody, err)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to read AI response", "details": err.Error()})
		return
	}

	// Return response as JSON
	var aiResponse map[string]interface{}
	if err := json.Unmarshal(respBody, &aiResponse); err != nil {
		c.JSON(500, gin.H{"error": "AI response not valid JSON", "raw": string(respBody)})
		return
	}
	c.JSON(200, aiResponse)
}
