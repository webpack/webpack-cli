#!/usr/bin/env bash

shopt -s extglob

cd smoketests

# ./watch.sh $@
./dev-server.sh $@


cd ../