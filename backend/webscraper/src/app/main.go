package main

import (
	"github.com/gin-gonic/gin"
	"github.com/sltimmins/CS4345-Proj/backend/webscraper/src/scrapers"
	"log"
	"os"
)

func main(){
	r := gin.Default()
	scrapers.CacheAllScrapers()
	r.GET("/api/Amazon", func(c *gin.Context) {
		fileContents := scrapers.CheckFile("./amazonSizes.json")
		c.JSON(200, gin.H{
			"main": fileContents,
		})
	})
	r.GET("/api/Nike", func(c *gin.Context) {
		fileContents := scrapers.CheckFile("./nikeSizes.json")
		c.JSON(200, gin.H{
			"main": fileContents,
		})
	})
	// Determine port for HTTP service.
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
		log.Printf("defaulting to port %s", port)
	}
	r.Run(":"+port)
}