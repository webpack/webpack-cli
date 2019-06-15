#!/usr/bin/env bash

git checkout master
cd $PWD
mkdir tmp
cd tmp
node ../../bin/cli.js init --auto