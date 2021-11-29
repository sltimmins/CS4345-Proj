
#include "sizeParser.h"

void parseJsonSizes(std::vector<size>& sizeVect, std::string domain, std::string article, std::string file){
    if(domain == "Nike"){
        parseJsonSizesNike(sizeVect, article, file);
    }
    else if(domain == "Amazon"){
        parseJsonSizesAmazon(sizeVect, article, file);
    }
    else{
        std::cout << std::endl << "Domain not recognized." << std::endl;
    }
}

void parseJsonSizesNike(std::vector<size>& sizeVect, std::string article, std::string file){
    std::ifstream jsonFile(file);
    json jf = json::parse(jsonFile);

    std::string chestString;
    std::string heightString;
    std::string hipString;
    std::string waistString;


    for (auto it = jf.at(article).begin(); it != jf.at(article).end(); ++it)
    {
//        std::cout << it.key() << "\n";
        std::map<std::string, double> initialMap;

//        std::cout << "Chest: " << (*it).at("Chest (cm)") << "\n";
        chestString = (*it)["Chest (cm)"].dump(1);
        initialMap.insert(std::pair<std::string,double>("Chest",getNumberFromString(chestString)));

//        std::cout << "Height: " << (*it).at("Height (cm) ") << "\n";
        heightString = (*it)["Height (cm) "].dump(1);
        initialMap.insert(std::pair<std::string,double>("Height",getNumberFromString(heightString)));

//        std::cout << "Hip: " << (*it).at("Hip (cm)") << "\n";
        hipString = (*it)["Hip (cm)"].dump(1);
        initialMap.insert(std::pair<std::string,double>("Hip",getNumberFromString(hipString)));

//        std::cout << "Waist: " << (*it).at("Waist (cm)") << "\n";
        waistString = (*it)["Waist (cm)"].dump(1);
        initialMap.insert(std::pair<std::string,double>("Waist",getNumberFromString(waistString)));

//        std::cout << getNumberFromString(chestString) << ", " << getNumberFromString(heightString) << ", " << getNumberFromString(hipString) << ", " << getNumberFromString(waistString) << std::endl;

//        std::cout << std::endl;

        size currSize(it.key(), initialMap);
        sizeVect.push_back(currSize);

    }

    jsonFile.close();
}

void parseJsonSizesAmazon(std::vector<size>& sizeVect, std::string article, std::string file){
    if(article == "Shirts") {
        std::ifstream jsonFile(file);
        json jf = json::parse(jsonFile);

        std::string chestString;
        std::string sleeveLengthString;
        std::string neckString;


        for (auto it = jf.at(article).begin(); it != jf.at(article).end(); ++it) {
            std::map<std::string, double> initialMap;

            chestString = (*it)["Chest"].dump(1);
            initialMap.insert(std::pair<std::string, double>("Chest", getNumberFromString(chestString)));

            sleeveLengthString = (*it)["Sleeve Length"].dump(1);
            initialMap.insert(std::pair<std::string, double>("Sleeve Length", getNumberFromString(sleeveLengthString)));

            neckString = (*it)["Neck"].dump(1);
            initialMap.insert(std::pair<std::string, double>("Neck", getNumberFromString(neckString)));

            size currSize(it.key(), initialMap);
            sizeVect.push_back(currSize);

        }

        jsonFile.close();
    }
    else if(article == "Jackets"){
        std::ifstream jsonFile(file);
        json jf = json::parse(jsonFile);

        std::string chestString;
        std::string sleeveLengthString;

        for (auto it = jf.at(article).begin(); it != jf.at(article).end(); ++it) {
            std::map<std::string, double> initialMap;

            chestString = (*it)["Chest"].dump(1);
            initialMap.insert(std::pair<std::string, double>("Chest", getNumberFromString(chestString)));

            sleeveLengthString = (*it)["Sleeve Length"].dump(1);
            initialMap.insert(std::pair<std::string, double>("Sleeve Length", getNumberFromString(sleeveLengthString)));

            size currSize(it.key(), initialMap);
            sizeVect.push_back(currSize);
        }
        jsonFile.close();
    }
    else if(article == "Trousers \\u0026 Jeans - Inseam"){
        std::ifstream jsonFile(file);
        json jf = json::parse(jsonFile);

        std::string inseamLengthString;

        for (auto it = jf.at(article).begin(); it != jf.at(article).end(); ++it) {
            std::map<std::string, double> initialMap;

            inseamLengthString = (*it)["Inseam Length"].dump(1);
            initialMap.insert(std::pair<std::string, double>("Inseam Length", getNumberFromString(inseamLengthString)));

            size currSize(it.key(), initialMap);
            sizeVect.push_back(currSize);
        }
        jsonFile.close();
    }
    else if(article == "Trousers \\u0026 Jeans - Waist"){
        std::ifstream jsonFile(file);
        json jf = json::parse(jsonFile);

        std::string waistString;

        for (auto it = jf.at(article).begin(); it != jf.at(article).end(); ++it) {
            std::map<std::string, double> initialMap;

            waistString = (*it)["Waist"].dump(1);
            initialMap.insert(std::pair<std::string, double>("Waist", getNumberFromString(waistString)));

            size currSize(it.key(), initialMap);
            sizeVect.push_back(currSize);
        }
        jsonFile.close();
    }
    else{
        std::cout << "Clothing article for given domain not yet supported." << std::endl;
        std::cout << article << std::endl;
    }
}

double getNumberFromString(std::string s) {
    std::vector<double> numbers;
    double num = 0;

    for (int i = 0; i < (int)s.length(); i++) {
        if (isdigit(s[i])) {
            // '1' - '0' = 1, '2' - '0' = 2
            num = (num * 10) + (s[i] - '0');
        }
        else {
            //save the number found if non-digit character is found if it is not 0
            if (num > 0) {
                numbers.push_back(num);
                num = 0;
            }
        }
    }

    if (num > 0) {
        numbers.push_back(num);
    }
    double sum;
    for (int i = 0 ; i < (int)numbers.size(); i++) {
//        std::cout << "numbers[" << i << "] = " << numbers[i] << std::endl;
        sum += numbers[i];
    }
    double avg = sum / numbers.size();
    return avg;
}

std::string getBestFit(std::vector<size> sizeVect){
    for(int i = 0; i < sizeVect.size(); i++){
        std::cout << sizeVect[i].get_clothingArticle() << std::endl;
        for (auto const& x : sizeVect[i].get_sizePair())
        {
            std::cout << x.first  // string (key)
                      << ':'
                      << x.second // string's value
                      << "  ";
        }
        std::cout << std::endl << std::endl;
    }
}
