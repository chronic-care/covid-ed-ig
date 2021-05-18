#!/bin/bash

./_genonce.sh && \
  node ./localizeLibraryPaths.js ./output/*-2.json && \
  cd cql-unit-tests && \
  npm install && \
  npm test