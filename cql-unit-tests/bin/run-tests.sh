#!/bin/bash

echo "Generating compiled CQL..."
./_genonce.sh && \
echo "Updating healthcodes ..." && \
./_updateValueSet.sh && \
  echo "Localizing library paths..." && \
  node ./localizeLibraryPaths.js ./output/*-2.json && \
  cd cql-unit-tests && \
  echo "Running test suite..."
  npm test