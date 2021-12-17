const valueSetDB = require ('./input/cql/valueset-db.json');
const fs = require('fs');

const healthCodes = ['2054-5',  '2106-3',  '130987000',  '365933000',  '373803006',  '373804000',  '373805004',  '373806003',  '373807007',  '85354-9',  '55284-4',  '8480-6',  '8462-4',  '8867-4',  '2708-6',  '59408-5',  '9279-1',  '8310-5',  '8302-2',  '29463-7',  '39156-5',  '3151-8',];
Object.values(valueSetDB).forEach((v) => {
  Object.values(v)[0].forEach((codeItem) => {
    healthCodes.push(codeItem.code);
   });
});

fs.writeFile('./input/cql/healthCodes.js', 'export const healthCodes = '+JSON.stringify(healthCodes), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log(`Saved ${healthCodes.length} healthCodes to ./input/cql/healthCodes.js`);
});
