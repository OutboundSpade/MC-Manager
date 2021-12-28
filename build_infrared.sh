#!/bin/bash

docker build --no-cache -t haveachin/infrared:latest https://github.com/haveachin/infrared.git
docker image prune -f --filter label=stage=intermediate