#!/usr/bin/env bash

# usage sh ./smoketests/dev-server.sh <n_runs>


test_folders=(
    dev-server
)
iterations=100

if [ "$1" != "" ]; then
    iterations=$1
fi

function setup() {
cat << EOL >> ./dev-server/index.js
console.log('index');
EOL

cat << EOL >> ./dev-server/webpack.config.js
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index_bundle.js'
  },
  plugins: [new HtmlWebpackPlugin()]
};
EOL

}

function del_files() {
    rm -rf ./dev-server/index.js
    rm -rf ./dev-server/webpack.config.js
}
function teardown() {
    del_files
    cd ../
    exit
}


setup

for i in "${test_folders[@]}"; do 
    echo "============================ RUNNING FOLDER: $i ============================"
    for j in `seq 1 $iterations`; do
        echo "============================ ITERATION: $j/$iterations  ====================================="
        ls ./dev-server/*.smoketest.js | xargs -I{} echo "Running:" {} | tee /dev/tty | cut -d':' -f 2 | xargs -I{} node {}
        if [ "$?" != "0" ]; then
            teardown
        fi
    done
    echo "============================ DONE RUNNING $i $iterations times ============================"
done

teardown
