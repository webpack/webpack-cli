#!/usr/bin/env bash

git checkout master
cd $PWD/scripts
mkdir tmp
cd tmp
node ../../bin/cli.js init --auto