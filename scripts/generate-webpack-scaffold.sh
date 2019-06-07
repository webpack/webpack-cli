#!/usr/bin/env bash

git checkout feat/no-prompt
cd $PWD/scripts
mkdir tmp
cd tmp
node ../../bin/cli.js init --auto