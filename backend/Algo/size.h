//
// Created by Ashwi on 10/25/2021.
//

#ifndef CS4345_PROJ_SIZE_H
#define CS4345_PROJ_SIZE_H

#include <iostream>
#include <map>

class size {
    std::string clothing_article;
    std::map<std::string,double> sizePair;

public:
    size() = default;
    size(std::string clothing_article, std::map<std::string,double> sizePair);

    std::string get_clothingArticle();
    std::map<std::string,double> get_sizePair();


};


#endif //CS4345_PROJ_SIZE_H
