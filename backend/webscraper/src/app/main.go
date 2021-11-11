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
	r.GET("/api/Amazon/womens", func(c *gin.Context) {
		fileContents := scrapers.CheckFile("./amazonWomensSizes.json")
		c.JSON(200, gin.H{
			"main": fileContents,
		})
	})
	r.GET("/api/Amazon/mens", func(c *gin.Context) {
		fileContents := scrapers.CheckFile("./amazonMensSizes.json")
		c.JSON(200, gin.H{
			"main": fileContents,
		})
	})
	r.GET("/api/Nike/womens", func(c *gin.Context) {
		fileContents := scrapers.CheckFile("./nikeWomensSizes.json")
		c.JSON(200, gin.H{
			"main": fileContents,
		})
	})
	r.GET("/api/Nike/mens", func(c *gin.Context) {
		fileContents := scrapers.CheckFile("./nikeMensSizes.json")
		c.JSON(200, gin.H{
			"main": fileContents,
		})
	})
	r.GET("/api/HM/womens", func(c *gin.Context) {
		fileContents := scrapers.CheckFile("./hmWomensSizes.json")
		c.JSON(200, gin.H{
			"main": fileContents,
		})
	})
	r.GET("/api/HM/mens", func(c *gin.Context) {
		fileContents := scrapers.CheckFile("./hmMensSizes.json")
		c.JSON(200, gin.H{
			"main": fileContents,
		})
	})
	r.GET("/api/Zara/mens", func(c *gin.Context) {
		fileContents := scrapers.CheckFile("./zaraMensSizes.json")
		c.JSON(200, gin.H{
			"main": fileContents,
		})
	})
	r.GET("/api/Zara/womens", func(c *gin.Context) {
		fileContents := scrapers.CheckFile("./zaraWomensSizes.json")
		c.JSON(200, gin.H{
			"main": fileContents,
		})
	})
	r.GET("/api/Asos/mens", func(c *gin.Context) {
		fileContents := scrapers.CheckFile("./asosMensSizes.json")
		c.JSON(200, gin.H{
			"main": fileContents,
		})
	})
	r.GET("/api/Asos/womens", func(c *gin.Context) {
		fileContents := scrapers.CheckFile("./asosWomensSizes.json")
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