## CQL Unit Tests

The CQL Unit Tests are included in this repo as a separate module.


### Pre-requisite 
Preferably install both a java version manager and a ruby version manager.
Install the following versions: 
- java 1.8
- ruby version 3.0.0 
- Jekyll (https://jekyllrb.com/docs/)

1. In the covid-ed-ig directory run `./_genonce.sh` script, if you get an 'ig publisher not found' message, run `bash _updatePublisher.sh --force --yes --skip-ping` script. Then run `./_genonce.sh` script to generate the ELM (json) of the CQL. This will add these files to the /output directory
2. Run `node localizeLibraryPaths.js [PATH TO CQL LIBRARY JSON]` (for example: Library-COVID19EmergencyDeptAssessment-2.json) for each library being used in tests
3. cd cql-unit-tests
4. npm install to install this module's specific node_modules
5. npm test to run all unit tests