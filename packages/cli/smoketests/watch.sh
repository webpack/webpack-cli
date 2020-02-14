#!/usr/bin/env bash

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
module.exports = 'more jank';
EOL

cat << EOL >> ./watch/prod.js
module.exports = 'jank';
EOL

}

function del_files() {
    rm -rf ./$i/bin* ./$i/*_copy* ./$i/dist
    rm -rf ./watch/index.js ./watch/dev.js ./watch/prod.js
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
        ls ./watch/*.smoketest.js | xargs -I{} echo "Running:" {} | tee /dev/tty | cut -d':' -f 2 | xargs -I{} node {}
        if [ "$?" != "0" ]; then
            teardown
        fi
    done
    echo "============================ DONE RUNNING $i $iterations times ============================"
done

teardown
