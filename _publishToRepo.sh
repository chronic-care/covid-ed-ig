#!/bin/bash

releaseTag=false

while [ "$#" -gt 0 ]; do
    case $1 in
    --release-version) releaseTag="$2" ;;
    esac
    shift
done

tar -zxf ./output/package.tgz -C ./output
node updatePackage.js --release-tag $releaseTag
cp ./output/*.cql ./output/package/ # Copy over original CQL
cp ./output/*-2.json ./output/package/ # Copy over original json+eml
cp ./input/cql/valueset-db.json ./output/package/
cp ./input/cql/healthCodes.js ./output/package/
node localizeLibraryPaths.js ./output/package/*-2.json
echo "registry=https://npm.pkg.github.com/chronic-care" >> ./output/package/.npmrc
cd ./output/package
npm publish