cmake_minimum_required(VERSION 3.15)
project(CS4345-Proj)

set(CMAKE_CXX_STANDARD 14)

add_executable(CS4345-Proj main.cpp sizeParser.cpp sizeParser.h json.hpp size.cpp size.h)
