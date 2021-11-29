//
// Created by Josiah Castillo on 11/27/2021.
//

#ifndef CS4345_PROJ_SIZEGENERATOR_H
#define CS4345_PROJ_SIZEGENERATOR_H

#include "sizeParser.h"
#include <iostream>
int findParameters(std::vector<size>& sizeVect);

std::string generateFit();

std::string generateSize(std::vector<size>& sizeVect, double* dimensions);

#endif //CS4345_PROJ_SIZEGENERATOR_H
