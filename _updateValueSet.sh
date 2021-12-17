#!/bin/bash

echo Update CQF Tooling ...
./_updateCQFTooling.sh

java -jar input-cache/tooling-1.3.1-SNAPSHOT-jar-with-dependencies.jar -ToJsonValueSetDb -path="input/vocabulary/valueset"
echo Generated valueset at input/vocabulary/valueset

cp src/main/resources/org/opencds/cqf/tooling/terminology/output/valueset-db.json ./input/cql/valueset-db.json
echo Copied valueset-db.json to ./input/cql folder.

node ./parseHealthCodes.js