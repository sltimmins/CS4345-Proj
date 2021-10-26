//
// Created by Ashwi on 10/25/2021.
//

#include "size.h"

size::size(std::string clothing_article, std::map<std::string, double> sizePair) {
    this->clothing_article = clothing_article;
    this->sizePair = sizePair;
}

std::string size::get_clothingArticle() {
    return this->clothing_article;
}

std::map<std::string, double> size::get_sizePair() {
    return this->sizePair;
}
