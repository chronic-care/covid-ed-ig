#!/bin/bash
tar -zxf ./output/package.tgz -C ./output
node updatePackage.js
cd ./output/
cp *-2.json package/ # Copy over original json+eml
cd ./package
echo "registry=https://npm.pkg.github.com/chronic-care" >> .npmrc
npm publish