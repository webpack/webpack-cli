#!/usr/bin/env bash

shopt -s extglob

cd smoketests

sh ./watch.sh $@


cd ../