#!/usr/bin/env bash

function printDonationHeader {
echo ''
echo -e '     \x1B[1m***\x1B[0m  Thank you for using webpack! \x1B[1m***\x1B[0m'
echo ''
echo 'Please consider donating to our open collective'
echo '     to help us maintain this package.'
echo ''
echo '  https://opencollective.com/webpack/donate'
echo ''
echo -e '                    \x1B[1m***\x1B[0m'
echo ''
exit 0
}

LANG=C DAY=$(date +"%a")

if [ "$DAY" == "Mon" ];
then
    printDonationHeader
fi