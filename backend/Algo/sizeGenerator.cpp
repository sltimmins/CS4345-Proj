//
// Created by Josiah Castillo on 11/27/2021.
//

#include "sizeGenerator.h"

int findParameters(std::vector<size>& sizeVect){
    int params = 0;

    for (auto const& x : sizeVect[0].get_sizePair())
    {
        params++;
    }

    return params - 1;
}

std::string generateFit(std::vector<double>& differences, int minIndex){
    if(differences.at(minIndex) >= 1.5){
        return "Slim";
    } else if(differences.at(minIndex) <= -1.5){
        return "Tall";
    }
    return "Standard";

}

std::string generateSize(std::vector<size>& sizeVect, double* dimensions){
    std::vector<double> differences;
    int dimensionParam = findParameters(sizeVect);
    double diff;
    double closest;
    int j;

    for (int i = 0; i < sizeVect.size(); i++){
        j = 0;
        diff = 0;
        for (auto const& x : sizeVect[i].get_sizePair())
        {
            //std::cout << x.second << " - " << *(dimensions + j) << " = " << fabs(x.second - *(dimensions + j)) << std::endl;
            //std::cout << diff << " + " << fabs(x.second - *(dimensions + j)) << " = ";
            diff += x.second - *(dimensions + j); // string's value

            //std::cout << diff << std::endl;

            if(j == dimensionParam){
                //std::cout << j << " == " << dimensionParam << std::endl;
                j = 0;
            } else {
                j++;
            }
        }

        //std::cout << "Total Deviance: " << diff << std::endl;
        differences.push_back(diff);
    }

    int minIndex = 0;
    double preVal = 100;
    std::string articleToReturn;

    for(int i = 0; i < differences.size(); i++){
        //std::cout << sizeVect.at(i).get_clothingArticle() << ": " << differences.at(i) << std::endl;
        if (fabs(differences[i]) < preVal){
            minIndex = i;
            preVal = fabs(differences[i]);
        }
    }
    articleToReturn = sizeVect.at(minIndex).get_clothingArticle();

    return articleToReturn + "\n Recommended Fit: " + generateFit(differences, minIndex);
}

