#!/bin/bash
tar -zxf ./output/package.tgz -C ./output
node updatePackage.js
cd ./output/package
echo "registry=https://npm.pkg.github.com/chronic-care" >> .npmrc
npm publish