#!/bin/bash
tar -zxf ./output/package.tgz -C ./output
node updatePackage.js
cp ./output/*-2.json ./output/package/ # Copy over original json+eml
node localizeLibraryPaths.js ./output/package/*-2.json
echo "registry=https://npm.pkg.github.com/chronic-care" >> ./output/package/.npmrc
cd ./output/package
npm publish