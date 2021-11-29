# Algo Notes
Currently the program parses a json and takes note of all of the sizing options available.
### Current Arguments
- num of args
- Domain name (e.g. "Nike")
- clothing article type (e.g. "Shirts")
- scraped json path for domain

Sample arguments for execution:
````
3 "Amazon" "Jackets" "C:\Users\Ashwi\OneDrive\Documents\GitHub\CS4345-Proj\backend\webscraper\src\amazonSizes.json"
````
````
3 "Nike" "Shirts" "C:\Users\Ashwi\OneDrive\Documents\GitHub\CS4345-Proj\backend\webscraper\src\nikeSizes.json"
````

#### In the works
4th argument will be the dimensions of a user for a given article of clothing.
We will then have the program return the size that most closely correlates to provided dimensions.
Further arguments may be necessary to determine customer sizing preference (to adjust algo weighting) and other influences.