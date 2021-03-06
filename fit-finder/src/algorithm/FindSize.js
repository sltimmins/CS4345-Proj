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

var AmazonCm = {
    "XS":[],
    "S": [[86.4,94],[35.6, 36.8],[80, 81.3]],
    "M": [[96.5,104],[38.1, 39.4],[82.55, 83.8]],
    "L": [[106.7,114.3],[40.6, 41.9],[85, 86.4]],
    "XL": [[116.8,124.5],[43.2, 44.5],[87.6, 88.9]],
    "XXL": [[127,132.1],[45.7, 47],[90.2, 91.4]],
};

//Nike table format:
//"SIZE": [ Chest, Hip ]
var NikeIn = {
    "XS": [[32.5, 35], [32.5, 35]],
    "S": [[35.1, 37.5], [35.1, 37.5]],
    "M": [[37.6, 41], [37.6, 41]],
    "L": [[41.1, 44], [41.1, 44]],
    "XL": [[44.1, 48.5], [44.1, 47]],
    "XXL": [[48.5, 53.5],[47, 50.5]],

};

var NikeCm = {
    "XS": [[80, 88], [80,88]],
    "S": [[88.1, 96], [88.1, 96]],
    "M": [[96.1, 104], [96.1, 104]],
    "L": [[104.1, 112], [104.1, 112]],
    "XL":[[112.1, 124], [112.1, 120]],
    "XXL": [[124.1, 136], [120.1, 128]],
};

var prefSize = {
    "XS": 0,
    "S": 0,
    "M": 0,
    "L": 0,
    "XL": 0,
    "XXL": 0,
}

var sizeArr = ["XS", "S", "M", "L", "XL", "XXL"];

var typeDimensions = JSON.parse(window.localStorage.getItem('measurementDimensions')) || "";

var chestSize= JSON.parse(window.localStorage.getItem('chestSize')) || "";
var sleeveLength= JSON.parse(window.localStorage.getItem('sleeveLength')) || "";
var neckSize= JSON.parse(window.localStorage.getItem('neckSize')) || "";
var hipSize= JSON.parse(window.localStorage.getItem('hipSize')) || "";

export function findMySize(brand, fitPref){
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
    if(brand.value == "Amazon" && typeDimensions == "cm"){
        for (let size in AmazonCm){
            if(AmazonCm[size] == undefined){
                continue;
            }                
            for(let sizeAspect in AmazonCm[size]){
                if(chestSize >= AmazonCm[size][sizeAspect][0] && chestSize <= AmazonCm[size][sizeAspect][1]){
                    prefSize[size]++;
                }
                if(sleeveLength >= AmazonCm[size][sizeAspect][0] && sleeveLength <= AmazonCm[size][sizeAspect][1]){
                    prefSize[size]++;
                }
                if(neckSize >= AmazonCm[size][sizeAspect][0] && neckSize <= AmazonCm[size][sizeAspect][1]){
                    prefSize[size]++;
                }
            }
        }
    }
        
    if(brand.value == "Nike" && typeDimensions == "in"){
        for (let size in NikeIn){
            if(NikeIn[size] == undefined){
                continue;
            }                
            for(let sizeAspect in NikeIn[size]){
                if(chestSize >= NikeIn[size][sizeAspect][0] && chestSize <= NikeIn[size][sizeAspect][1]){
                    prefSize[size]++;
                }
                
                if(hipSize >= NikeIn[size][sizeAspect][0] && hipSize <= NikeIn[size][sizeAspect][1]){
                    prefSize[size]++;
                }
            }
        }
    }
    
    if(brand.value == "Nike" && typeDimensions == "cm"){
        for (let size in NikeCm){
            if(NikeCm[size] == undefined){
                continue;
            }                
            for(let sizeAspect in NikeCm[size]){
                if(chestSize >= NikeCm[size][sizeAspect][0] && chestSize <= NikeCm[size][sizeAspect][1]){
                    prefSize[size]++;
                }
                
                if(hipSize >= NikeCm[size][sizeAspect][0] && hipSize <= NikeCm[size][sizeAspect][1]){
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

    var fitPrefAdd = 0;
    if(fitPref.value == "Tigher"){
        fitPrefAdd = -1;
    }
    if(fitPref.value == "Looser"){
        fitPrefAdd = 1;
    }
    userSize = sizeArr[sizeArr.indexOf(userSize) + fitPrefAdd];

    if(userSize == undefined){
        return "Sorry. There is not a size that would fit you.";
    }

    return userSize;
}
