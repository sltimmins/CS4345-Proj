//
// Created by Ashwi on 10/25/2021.
//

#ifndef CS4345_PROJ_SIZEPARSER_H
#define CS4345_PROJ_SIZEPARSER_H

#include <iostream>
#include <fstream>
#include <vector>
#include <map>
#include <sstream>
#include "json.hpp"
#include "size.h"

using json = nlohmann::json;

void parseJsonSizes(std::vector<size>& sizeVect, std::string domain, std::string article, std::string file);

void parseJsonSizesNike(std::vector<size>& sizeVect, std::string article, std::string file);
void parseJsonSizesAmazon(std::vector<size>& sizeVect, std::string article, std::string file);

double getNumberFromString(std::string s);


#endif //CS4345_PROJ_SIZEPARSER_H
