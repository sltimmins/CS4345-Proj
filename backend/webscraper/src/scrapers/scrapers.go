package scrapers

import (
	"encoding/json"
	"fmt"
	"github.com/gocolly/colly"
	"os"
	"strings"
	url2 "net/url"
)

func ParseAmazonSizes(url string) interface{}{
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

func ParseNikeSizes(url string) interface{}{
	//Create a new collector which will be in charge of collect the data from HTML
	c := colly.NewCollector()

	//Slices to store the data
	sizeChart := make(map[string]*map[string]map[string][]interface{}, 15)
	//onHTML function allows the collector to use a callback function when the specific HTML tag is reached
	//in this case whenever our collector finds an
	//anchor tag with href it will call the anonymous function
	// specified below which will get the info from the href and append it to our slice
	//num := 0
	c.OnHTML("script", func(elem *colly.HTMLElement) {
		//jsonData := elem.Text[strings.Index(elem.Text, "{") : len(elem.Text)-1]
		//fmt.Println(elem.Text, jsonData)
		//num++
		//fmt.Println(num)
	})

	c.OnHTML(".size-chart-table tbody", func(elem *colly.HTMLElement) {
		elem.ForEach("tr", func(x int, e *colly.HTMLElement) {
			fmt.Println("tr")
			//if x != 0 {
			//	currentItemType := ""
			//	e.ForEach("th,td", func(i int, f *colly.HTMLElement) {
			//		if i == 0 {
			//			currentItemType = strings.TrimSpace(f.Text)
			//		} else {
			//			if f.Text == "" {
			//				//return
			//				fmt.Println("empty string")
			//			}
			//			parsedSize := strings.TrimSpace(f.Text)
			//			fmt.Println(currentItemType)
			//			if sizeChart["Shirts"] == nil {
			//				sizeChart["Shirts"] = map[string]map[string][]string{}
			//			}
			//			if sizeChart["Shirts"][sizes[i-1]] == nil {
			//				sizeChart["Shirts"][sizes[i-1]] = map[string][]string{}
			//			}
			//			if sizeChart["Shirts"][sizes[i-1]][currentItemType] == nil {
			//				sizeChart["Shirts"][sizes[i-1]][currentItemType] = []string{}
			//			}
			//			sizeChart["Shirts"][sizes[i-1]][currentItemType] = append(sizeChart["Shirts"][sizes[i-1]][currentItemType], parsedSize)
			//		}
			//	})
			//}
		})
	})
	c.OnResponse(func(r *colly.Response) {
		bodyText := string(r.Body)
		jsonText := bodyText[strings.Index(bodyText, "JSON.parse(unescape('") + 21: strings.Index(bodyText, "'));</script>\n          \n\n <!-- START dotcom-nav configuration: footer -->\n")]
		jsonParts := strings.Split(jsonText, "%u2019")
		//fmt.Println(jsonText)
		builder := strings.Builder{}
		for _, str := range jsonParts {
			builder.Grow(builder.Len() + len(str))
			builder.WriteString(str+"'")
		}
		jsonText = builder.String()
		jsonParts = strings.Split(jsonText, "%u2013")
		builder.Reset()
		for _, str := range jsonParts {
			builder.Grow(builder.Len() + len(str))
			builder.WriteString(str+"-")
		}
		jsonText = builder.String()
		jsonParts = strings.Split(jsonText, "%u201D")
		builder.Reset()
		for _, str := range jsonParts {
			builder.Grow(builder.Len() + len(str))
			builder.WriteString(str+"\\\"")
		}
		jsonText = builder.String()
		jsonText, err := url2.QueryUnescape(jsonText)

		if err != nil {
			fmt.Println(err)
		}
		//fmt.Println("\n\n")
		//fmt.Println(jsonText[0: len(jsonText)-4], "\n\n\n")
		jsonText = jsonText[0: len(jsonText)-4]
		var jsonElem map[string]interface{}
		if err = json.Unmarshal([]byte(jsonText), &jsonElem); err != nil {
			fmt.Println(err)
		}
		//fmt.Println(jsonElem)
		for key := range jsonElem["appData"].(map[string]interface{}) {
			//fmt.Println("key: " + key)
			if key == "cards" {
				for innerKey := range jsonElem["appData"].(map[string]interface{})[key].(map[string]interface{}) {
					innerObj := jsonElem["appData"].(map[string]interface{})[key].(map[string]interface{})[innerKey].(map[string]interface{})
					for innerInnerKey := range innerObj {
						if innerInnerKey == "sizeCharts" {
							//fmt.Println("\n\n\n", innerObj[innerInnerKey], "\n\n\n")
							arrOfInfo := innerObj[innerInnerKey].([]interface{})[0].(map[string]interface{})["data"].([]interface{})
							headerArr :=  innerObj[innerInnerKey].([]interface{})[0].(map[string]interface{})["data"].([]interface{})[0].([]interface{})
							headers := make(map[string]map[string][]interface{}, len(headerArr))
							arrayOfHeaders := make([]string, 0, len(headerArr))
							for i, val := range headerArr {
								valMap := val.(map[string]interface{})
								if i != 0 {
									headers[valMap["value"].(string)] = make(map[string][]interface{}, 10)
									arrayOfHeaders = append(arrayOfHeaders, valMap["value"].(string))
								}
							}
							classification := ""
							for i, val := range arrOfInfo {
								if i == 0 {
									continue
								}
								innerArr := val.([]interface{})
								for j, innerVal := range innerArr {
									valMap := innerVal.(map[string]interface{})
									if j == 0 {
										classification = valMap["value"].(string)
									} else {
										headers[arrayOfHeaders[j-1]][classification] = []interface{}{valMap["value"]}
									}
								}
							}
							sizeChart["Shirts"] = &headers
							//fmt.Println("\n", headers)
						}
					}
				}
			}
			//fmt.Println(jsonElem["appData"].(map[string]interface{})[key])
		}
	})

	//Command to visit the website
	c.Visit(url)

	fmt.Println(sizeChart)

	return &sizeChart
}


func CacheAllScrapers() {
	WriteToFile("http://z-ecx.images-amazon.com/images/G/02/apparel/size-charts/mens._V367500858_.html","./amazonSizes.json", ParseAmazonSizes)
	WriteToFile("https://www.nike.com/size-fit/mens-tops-alpha","./nikeSizes.json", ParseNikeSizes)
}

func WriteToFile(website, fileDest string, parseFunc func(string) interface{}){
	jsonString, err := json.Marshal(parseFunc(website))
	fmt.Println(err)
	jsonFile, err := os.Create(fileDest)

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