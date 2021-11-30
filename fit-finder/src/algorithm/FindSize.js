//Tables are formatted as follows:
//  "SIZE": [ Chest, Neck, Arm Length ] (all are ranges)
var AmazonIn = {
    "XS":[],
    "S": [[34,37],[14, 14.5],[31.5, 32]],
    "M": [[38,41],[15, 15.5],[32.5, 33]],
    "L": [[42,45],[16, 16.5],[33.5, 34]],
    "XL": [[46,49],[17, 17.5],[34.5, 35]],
    "XXL": [[50,52],[18, 18.5],[35.5, 36]],
};

//Nike table format:
//"SIZE": [ Chest, Hip ]
var NikeIn = {
    "XS": [[32.5, 35], [32.5, 35]],
    "S": [[35, 37.5], [35, 37.5]],
    "M": [[37.5, 41], [37.5, 41]],
    "L": [[41, 44], [41, 44]],
    "XL": [[44, 48.5], [44, 47]],
    "2XL": [[48.5, 53.5],[47, 50.5]],
};

var prefSize = {
    "XS": 0,
    "S": 0,
    "M": 0,
    "L": 0,
    "XL": 0,
    "XXL": 0,
}

var typeDimensions = JSON.parse(window.localStorage.getItem('measurementDimensions')) || "";

var chestSize= JSON.parse(window.localStorage.getItem('chestSize')) || "";
var sleeveLength= JSON.parse(window.localStorage.getItem('sleeveLength')) || "";
var neckSize= JSON.parse(window.localStorage.getItem('neckSize')) || "";

export function findMySize(brand){
    if(brand.value == "Amazon" && typeDimensions == "in"){
        for (let size in AmazonIn){
            if(AmazonIn[size] == undefined){
                continue;
            }                
            for(let sizeAspect in AmazonIn[size]){
                if(chestSize >= AmazonIn[size][sizeAspect][0] && chestSize <= AmazonIn[size][sizeAspect][1]){
                    prefSize[size]++;
                }
                if(sleeveLength >= AmazonIn[size][sizeAspect][0] && sleeveLength <= AmazonIn[size][sizeAspect][1]){
                    prefSize[size]++;
                }
                if(neckSize >= AmazonIn[size][sizeAspect][0] && neckSize <= AmazonIn[size][sizeAspect][1]){
                    prefSize[size]++;
                }
            }
        }
    }
    
    var defSize = -1;
    var userSize = "";
    for (let size in prefSize){
        if (prefSize[size] > defSize){
            defSize = prefSize[size];
            userSize = size;
        }
    }

    return userSize;
}
