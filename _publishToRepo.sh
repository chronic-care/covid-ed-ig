#!/bin/bash

packageVersion=false

while [ "$#" -gt 0 ]; do
    case $1 in
    --release-version) packageVersion="$2" ;;
    esac
    shift
done

echo Package Version: $packageVersion

#tar -zxf ./output/package.tgz -C ./output
#node updatePackage.js
#cp ./output/*-2.json ./output/package/ # Copy over original json+eml
#node localizeLibraryPaths.js ./output/package/*-2.json
#echo "registry=https://npm.pkg.github.com/chronic-care" >> ./output/package/.npmrc
#cd ./output/package
#npm publish