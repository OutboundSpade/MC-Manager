#!/bin/bash

#this is to accomodate the fact that the official container image has been out of date for 6 months & not keeping up w/the git repo 
docker build --no-cache -t haveachin/infrared:latest https://github.com/haveachin/infrared.git
docker image prune -f --filter label=stage=intermediate