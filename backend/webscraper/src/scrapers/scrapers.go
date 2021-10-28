package scrapers

import (
	"encoding/json"
	"fmt"
	"github.com/gocolly/colly"
	url2 "net/url"
	"os"
	"strings"
)

func ArrContainsStr(arr []string, value string) bool{
	for _, val := range arr {
		if val == value {
			return true
		}
	}
	return false
}

// Parses the tables from Amazon
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

	// get all  of the clothing types
	c.OnHTML("tr td h5", func(e *colly.HTMLElement) {
		itemTypes = append(itemTypes, e.Text)
	})
	// to put an array of all the body parts in a table in the 2d array bodyParts
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
		if len(itemTypes) == 0 {
			itemTypes = append(itemTypes, "Tops and Dresses")
		}
		// iterate through rows
		elem.ForEach("tr", func(x int, e *colly.HTMLElement) {
			findUSSize := ""
			// iterate through cells
			e.ForEach("td", func(i int, f *colly.HTMLElement) {
				// if is first cell in row then the value is the current size classification
				if i == 0 {
					lastSize = strings.TrimSpace(f.Text)
				} else {
					if strings.TrimSpace(f.Text) == "" {
						return
					}
					if i == 3 {
						findUSSize = f.Text
					}
					if strings.Index(f.Text, " inches") == -1 {
						return
					}
					// the size parsed from the each cell with actual size values
					parsedSize := strings.TrimSpace(f.Text[0:strings.Index(f.Text, " inches")])
					//fmt.Println(itemTypes[num], lastSize, bodyParts[num][i], sizes[itemTypes[num]][lastSize][bodyParts[num][i]])
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
					// if table is one of the ones who's body part has "US Size"
					if ArrContainsStr(bodyParts[num], "US Size"){
						fmt.Println(bodyParts[num][3])
						// check if clothing element has been initialized in size map
						if sizes[itemTypes[num]] == nil {
							sizes[itemTypes[num]] = map[string]map[string][]string{}
						}
						// check if size classification has been initialized for clothing element map
						if sizes[itemTypes[num]][findUSSize] == nil {
							sizes[itemTypes[num]][findUSSize] = map[string][]string{}
						}
						// check if bodyPart has been initialized for size classification map
						if sizes[itemTypes[num]][findUSSize][bodyParts[num][i]] == nil {
							sizes[itemTypes[num]][findUSSize][bodyParts[num][i]] = []string{}
						}
						if lastSize != "" && sizes[itemTypes[num]][findUSSize][bodyParts[num][i]] != nil {
							// once everything required to be initialized in the sizes map, is now able to be added to
							sizes[itemTypes[num]][findUSSize][bodyParts[num][i]] = append(sizes[itemTypes[num]][findUSSize][bodyParts[num][i]], parsedSize)
						}
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

	//Parse Javascript, as it is javascript rendered
	c.OnResponse(func(r *colly.Response) {
		bodyText := string(r.Body)
		//get the response from body and retrieve the data we need for sizes
		jsonText := bodyText[strings.Index(bodyText, "JSON.parse(unescape('") + 21: strings.Index(bodyText, "'));</script>\n          \n\n <!-- START dotcom-nav configuration: footer -->\n")]
		// special encoded character not decoded by function
		jsonParts := strings.Split(jsonText, "%u2019")
		// new builder for strings for efficiency
		builder := strings.Builder{}
		// use builder to bring string back together and replace encoded value with decoded value
		for _, str := range jsonParts {
			builder.Grow(builder.Len() + len(str))
			builder.WriteString(str+"'")
		}
		jsonText = builder.String() // convert back into string
		// special encoded character not decoded by function
		jsonParts = strings.Split(jsonText, "%u2013")
		builder.Reset()
		// use builder to bring string back together and replace encoded value with decoded value
		for _, str := range jsonParts {
			builder.Grow(builder.Len() + len(str))
			builder.WriteString(str+"-")
		}
		jsonText = builder.String() // convert back into string
		// special encoded character not decoded by function
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
		// remove suffix
		jsonText = jsonText[0: len(jsonText)-4]
		var jsonElem map[string]interface{}
		if err = json.Unmarshal([]byte(jsonText), &jsonElem); err != nil {
			fmt.Println(err)
		}
		// Massive algo for parsing through confusing json
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

// Parses the tables from HM
func ParseHMSizes(url string) interface{}{
	//Create a new collector which will be in charge of collect the data from HTML
	c := colly.NewCollector(
		colly.UserAgent("Mozilla/5.0"),
	)

	mens := strings.Contains(url, "/men")

	//Slices to store the data
	//var lastSize string
	sizes :=  map[string]map[string]map[string][]string{}
	sizeArr := make([]string, 0, 15)
	clothingElem := make([]string, 0, 20)
	//body := []string{"Chest", "Sleeve Length"}
	//onHTML function allows the collector to use a callback function when the specific HTML tag is reached
	//in this case whenever our collector finds an
	//anchor tag with href it will call the anonymous function
	// specified below which will get the info from the href and append it to our slice

	// keeps track of the current clothing element,  such as Tops, Dresses, and Pants
	c.OnHTML(".toggle-list-headline", func(elem *colly.HTMLElement) {
		elem.ForEach("button", func(ind int, inner *colly.HTMLElement) {
			clothingElem = append(clothingElem, inner.Text)
		})
	})

	//keeps track of table
	extra := 0

	c.OnHTML(".table-scrollable", func(elem *colly.HTMLElement) {
		// iterate through tables
		elem.ForEach(".size-guide tbody", func(i int, inner *colly.HTMLElement) {
			i = extra
			//Filters out the clothes that we don't want to track sizes of
			if i < len(clothingElem) {
				if !(strings.Contains(clothingElem[i], "TOPS") ||
					strings.Contains(clothingElem[i], "BOTTOMS") ||
					strings.Contains(clothingElem[i], "DRESSES") ||
					strings.Contains(clothingElem[i], "TROUSERS")) {
					return
				}
			} else {
				return
			}
			hasPassedSizes := false //keeps track if row has passed the size elements row
			inner.ForEach("tr", func(j int, inner2 *colly.HTMLElement) {
				// inner2 and j represents the tr elements under .size-guide tbody query
				bodyPart := "" // Like Waist, and Chest
				// checks if this row is the row we are looking for
				if !hasPassedSizes {
					isSizeRow := false //checks if current row is the size row for S, M, L, XL, etc
					inner2.ForEach("th b", func(x int, inner3 *colly.HTMLElement) {
						if isSizeRow {
							if x > 0 {
								//if not size row, first actual text should be XS
								if x == 1 && (inner3.Text != "XS" && inner3.Text != "XXS") {
									return
								}
								sizeArr = append(sizeArr, inner3.Text)
								// Mens chart has two sizes for each size classification
								if !mens && x > 2 {
									sizeArr = append(sizeArr, inner3.Text)
								} else if mens && x > 0 {
									sizeArr = append(sizeArr, inner3.Text)
								}
							}
							hasPassedSizes = true
						}
						if x == 0 {
							isSizeRow = strings.TrimSpace(inner3.Text) != "US" && strings.TrimSpace(inner3.Text) != "EU" || strings.TrimSpace(inner3.Text) == "EUR"
						}
					})
				} else {
					inner2.ForEach("th,td", func(x int, inner3 *colly.HTMLElement) {
						//skips row that specifies US and EU/EUR sizes
						if strings.TrimSpace(inner3.Text) == "US" || strings.TrimSpace(inner3.Text) == "EU" || strings.TrimSpace(inner3.Text) == "EUR" {
							return
						}
						//gets body size
						if x == 0 {
							bodyPart = inner3.Text
						} else {
							//validate bodyPart string
							if len(bodyPart) == 0 {
								return
							}
							// check if clothing element has been initialized in size map
							if sizes[clothingElem[i]] == nil {
								sizes[clothingElem[i]] = map[string]map[string][]string{}
							}
							// check if size classification has been initialized for clothing element map
							if sizes[clothingElem[i]][sizeArr[x-1]] == nil {
								sizes[clothingElem[i]][sizeArr[x-1]] = map[string][]string{}
							}
							// check if bodyPart has been initialized for size classification map
							if sizes[clothingElem[i]][sizeArr[x-1]][bodyPart] == nil {
								sizes[clothingElem[i]][sizeArr[x-1]][bodyPart] = []string{}
							}
							// once everything required to be initialized in the sizes map, is now able to be added to
							sizes[clothingElem[i]][sizeArr[x-1]][bodyPart] = append(sizes[clothingElem[i]][sizeArr[x-1]][bodyPart], inner3.Text)
						}
					})
				}
			})
			extra = i + 1
		})
	})

	//Command to visit the website
	c.Visit(url)


	return &sizes
}

// Parses the tables from Zara
func ParseZaraSizes(url string) interface{}{
	//Create a new collector which will be in charge of collect the data from HTML
	c := colly.NewCollector(
		colly.UserAgent("Mozilla/5.0"),
	)

	//Slices to store the data
	//var lastSize string
	sizes :=  map[string]map[string]map[string][]string{}
	//sizeArr := make([]string, 0, 15)
	//body := []string{"Chest", "Sleeve Length"}
	//onHTML function allows the collector to use a callback function when the specific HTML tag is reached
	//in this case whenever our collector finds an
	//anchor tag with href it will call the anonymous function
	// specified below which will get the info from the href and append it to our slice

	c.OnHTML("body", func(elem *colly.HTMLElement) {
		elem.ForEach(".chart", func(i int, inner *colly.HTMLElement) {
			types := []string{}
			elem.ForEach("table thead th", func(j int, inner2 *colly.HTMLElement) {
				types = append(types, inner2.Text)
				fmt.Println(inner2.Text)
				elem.ForEach("table tbody tr", func(r int, rows *colly.HTMLElement) {
					size := "" // class classification, S, M, L, XL
					title := "" // title clothing name, Shirt, Pants
					rows.ForEach("td", func(x int, inner3 *colly.HTMLElement) {
						if x == 0 {
							size = inner3.Text
							// gets the title of the clothing at the first iteration
							inner.ForEach("h2", func(y int, inner4 *colly.HTMLElement) {
								title = strings.TrimSpace(inner4.Text)
							})
						} else {
							if x == j {
								// check if clothing element has been initialized in size map
								if sizes[title] == nil {
									sizes[title] = map[string]map[string][]string{}
								}
								// check if size classification has been initialized for clothing element map
								if sizes[title][size] == nil {
									sizes[title][size] = map[string][]string{}
								}
								// check if bodyPart has been initialized for size classification map
								if sizes[title][size][inner2.Text] == nil {
									sizes[title][size][inner2.Text] = []string{}
								}
								// once everything required to be initialized in the sizes map, is now able to be added to
								sizes[title][size][inner2.Text] = append(sizes[title][size][inner2.Text], inner3.Text)
							}
						}
					})
				})
			})

			if len(types) == 4 {
				fmt.Println(types)
			}
		})
		//jsonData := elem.Text[strings.Index(elem.Text, "{") : len(elem.Text)-1]
		//fmt.Println(elem.Text, jsonData)
		//num++
		//fmt.Println(elem.Text)
	})


	//Command to visit the website
	c.Visit(url)

	fmt.Println(sizes)

	return &sizes
}


func CacheAllScrapers() {
	WriteToFile("http://z-ecx.images-amazon.com/images/G/02/apparel/size-charts/mens._V367500858_.html","./amazonMensSizes.json", ParseAmazonSizes)
	WriteToFile("http://z-ecx.images-amazon.com/images/G/02/apparel/size-charts/womens._V367500858_.html","./amazonWomensSizes.json", ParseAmazonSizes)
	WriteToFile("https://www.nike.com/size-fit/mens-tops-alpha","./nikeMensSizes.json", ParseNikeSizes)
	WriteToFile("https://www.nike.com/size-fit/womens-tops-alpha","./nikeWomensSizes.json", ParseNikeSizes)
	WriteToFile("https://www2.hm.com/en_us/customer-service/sizeguide/ladies.html","./hmWomensSizes.json", ParseHMSizes)
	WriteToFile("https://www2.hm.com/en_us/customer-service/sizeguide/men.html","./hmMensSizes.json", ParseHMSizes)
	WriteToFile("http://www.sizecharter.com/brands/zar/womens", "./zaraWomensSizes.json", ParseZaraSizes)
	WriteToFile("http://www.sizecharter.com/brands/zar/mens", "./zaraMensSizes.json", ParseZaraSizes)
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