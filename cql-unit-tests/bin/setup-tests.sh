#!/bin/bash

echo "Generating compiled CQL..."
./_genonce.sh && \
  echo "Localizing library paths..." && \
  node ./localizeLibraryPaths.js ./output/*-2.json && \
  cd cql-unit-tests && \
  echo "Install node packages for test suite..." && \
  npm install && \
  echo "Running test suite..."
  npm test