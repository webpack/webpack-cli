#!/bin/bash

# usage sh ./smoketests/watch.sh <n_runs>


test_folders=(
    watch
)
iterations=100

if [ "$1" != "" ]; then
    iterations=$1
fi

function setup() {
cat << EOL >> ./watch/index.js
    console.log('index');
EOL

cat << EOL >> ./watch/dev.js
    module.exports = "console.log('xD')"
EOL

cat << EOL >> ./watch/prod.js
module.exports = 'jank';
EOL

}

function teardown() {
    rm -rf ./$i/bin* ./$i/*_copy* ./$i/dist
    rm -rf ./watch/index.js ./watch/dev.js ./watch/prod.js
    cd ../
    exit
}


setup

for i in "${test_folders[@]}"; do 
    echo "============================ RUNNING FOLDER: $i ============================"
    for j in `seq 1 $iterations`; do
        echo "\n============================ ITERATION: $j/$iterations  ====================================="
        jest --testPathPattern=/$i/.*\\.js$
        if [ "$?" != "0" ]; then
            teardown
        fi
    done
    echo "============================ DONE RUNNING $i $iterations times ============================"
done

teardown
