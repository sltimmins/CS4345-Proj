package scrapers

import (
	"encoding/json"
	"fmt"
	"github.com/gocolly/colly"
	"os"
	"strings"
)

func ParseAmazonSizes(url string) *map[string]map[string]map[string][]string{
	//Create a new collector which will be in charge of collect the data from HTML
	c := colly.NewCollector()

	//Slices to store the data
	var lastSize string
	sizes :=  map[string]map[string]map[string][]string{}
	//body := []string{"Chest", "Sleeve Length"}
	itemTypes := []string{}
	var bodyParts [][]string
	//onHTML function allows the collector to use a callback function when the specific HTML tag is reached
	//in this case whenever our collector finds an
	//anchor tag with href it will call the anonymous function
	// specified below which will get the info from the href and append it to our slice
	c.OnHTML("tr td h5", func(e *colly.HTMLElement) {
		itemTypes = append(itemTypes, e.Text)
		fmt.Println(e.Text)
	})
	c.OnHTML(".tabular tr", func(elem *colly.HTMLElement) {
		bodyPartsInner := []string{}
		count := 0
		elem.ForEach("th", func(i int, f *colly.HTMLElement) {
			bodyPartsInner = append(bodyPartsInner, strings.TrimSpace(f.Text))
			count++
		})
		if count > 0 {
			bodyParts = append(bodyParts, bodyPartsInner)
		}
	})
	num := 0
	c.OnHTML(".tabular", func(elem *colly.HTMLElement) {
		elem.ForEach("tr", func(x int, e *colly.HTMLElement) {
			e.ForEach("td", func(i int, f *colly.HTMLElement) {
				if i == 0 {
					lastSize = strings.TrimSpace(f.Text)
				} else {
					if f.Text == "" {
						return
					}
					parsedSize := strings.TrimSpace(f.Text[0:strings.Index(f.Text, " inches")])
					fmt.Println(itemTypes[num], lastSize, bodyParts[num][i], sizes[itemTypes[num]][lastSize][bodyParts[num][i]])
					if sizes[itemTypes[num]] == nil {
						sizes[itemTypes[num]] = map[string]map[string][]string{}
					}
					if sizes[itemTypes[num]][lastSize] == nil {
						sizes[itemTypes[num]][lastSize] = map[string][]string{}
					}
					if sizes[itemTypes[num]][lastSize][bodyParts[num][i]] == nil {
						sizes[itemTypes[num]][lastSize][bodyParts[num][i]] = []string{}
					}
					if lastSize != "" && sizes[itemTypes[num]][lastSize][bodyParts[num][i]] != nil {
						sizes[itemTypes[num]][lastSize][bodyParts[num][i]] = append(sizes[itemTypes[num]][lastSize][bodyParts[num][i]], parsedSize)
					}
				}
			})

		})
		num++
	})

	//Command to visit the website
	c.Visit(url)

	return &sizes
}

func CacheAllScrapers() {
	jsonString, err := json.Marshal(ParseAmazonSizes("http://z-ecx.images-amazon.com/images/G/02/apparel/size-charts/mens._V367500858_.html"))
	fmt.Println(err)
	jsonFile, err := os.Create("./amazonSizes.json")

	defer jsonFile.Close()

	if err != nil {
		panic(err)
	}

	jsonFile.Write(jsonString)
}

func check(e error) {
	if e != nil {
		panic(e)
	}
}

func CheckFile(fileUrl string) interface{}{
	dat, err := os.ReadFile(fileUrl)
	check(err)
	fmt.Print(string(dat))
	var resp interface{}
	err = json.Unmarshal(dat, &resp)
	if err != nil {
		return nil
	}
	return resp
}