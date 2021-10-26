//
// Created by Ashwi on 10/25/2021.
//

#include "sizeParser.h"

int main(int argc, char const* argv[]) {
    // 3 arguments, Domain & Article of Clothing & JSON file name with directory /// for future dev: 4th argument will be user dimensions so we can return best fit size
    std::vector<size> sizeVect;
    parseJsonSizes(sizeVect, argv[2], argv[3], argv[4]);

    /// Parsing through size map
    std::cout << std::endl << "Number of sizes found on " << argv[2] << " for " << argv[3] << ": " << sizeVect.size() << std::endl;
    for(int i = 0; i < sizeVect.size(); i++){
        std::cout << sizeVect[i].get_clothingArticle() << std::endl;
        for (auto const& x : sizeVect[i].get_sizePair())
        {
            std::cout << x.first  // string (key)
                      << ':'
                      << x.second // string's value
                      << std::endl;
        }
    }
    ///


    return 0;
}
