## CQL Unit Tests

The CQL Unit Tests are included in this repo as a companion JavaScript (TypeScript) module to the Covid-Ed-Ig CQL repository.
These tests internally use the CQL-Exec-Fhir and CQL-Execution packages to run the CQL via the JavaScript engine.


### Pre-requisites 
Preferably install both a java version manager and a ruby version manager.
Install the following:
- Java 1.8
- Ruby 3.0.0 
- Jekyll (https://jekyllrb.com/docs/)

### Running Unit Tests

To run the unit tests with the latest CQL code, you need to have the above dependencies installed on your machine.

From the covid-ed-ig root directory, run the command `npm run test:with-setup`. This will run the following commands:

1. In the covid-ed-ig directory run `./_genonce.sh` script.
   - If you get an 'ig publisher not found' message, run `bash _updatePublisher.sh --force --yes --skip-ping` script.
     Then run `./_genonce.sh` script to generate the ELM (json) of the CQL. The output will be located in the `/output` directory
2. Run `node localizeLibraryPaths.js ./output/*-2.json`
   - This will update (localize) the path values for the libraries that are included in CQL files
3. Run `cd cql-unit-tests` to go into the unit test module
4. Run `npm install` to install this module's specific packages
5. Run `npm test` to run the unit tests