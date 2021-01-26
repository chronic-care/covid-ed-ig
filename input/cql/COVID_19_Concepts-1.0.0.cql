library COVID_19_Concepts version '1.0.0'

// ## Code Systems ##ß

codesystem "LOINC": 'http://loinc.org'
codesystem "SNOMED-CT": 'http://snomed.info/sct'
codesystem "Race": 'urn:oid:2.16.840.1.113883.6.238'

// ## Value sets ##

// [See value set in VSAC](https://vsac.nlm.nih.gov/valueset/2.16.840.1.113883.3.2074.1.1.3/expansion)
valueset "Race Category": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.2074.1.1.3'

// Value sets not available in VSAC, included via expanded FHIR ValueSet resources
valueset "Hypertension Codes": 'http://fhir.org/guides/acep/ValueSet/covid-19-condition-risk-hypertension'
valueset "Malignancy Codes": 'http://fhir.org/guides/acep/ValueSet/covid-19-condition-risk-malignancy'
valueset "Renal Disease Codes": 'http://fhir.org/guides/acep/ValueSet/covid-19-condition-risk-renal'

// ## Individual codes ##

// list individual codes from code systems used directly in the CQL logic. Individual codes are used when there is
// a single code from a particular vocabulary standard used to represent a clinical concept. It is considered
// best-practice not to create value sets containing a single code.

code "Black or African American": '2054-5' from "Race" display 'Black or African American'
code "White": '2106-3' from "Race" display 'White'

code "Blood pressure": '85354-9' from "LOINC" display 'Blood pressure systolic and diastolic'
code "Systolic blood pressure": '8480-6' from "LOINC" display 'Systolic blood pressure'
code "Diastolic blood pressure": '8462-4' from "LOINC" display 'Diastolic blood pressure'

code "Heart rate": '8867-4' from "LOINC" display 'Heart rate'
code "Oxygen saturation": '2708-6' from "LOINC" display 'Oxygen saturation'
code "Respiratory rate": '9279-1' from "LOINC" display 'Respiratory rate'
code "Body temperature": '8310-5' from "LOINC" display 'Body temperature'
code "Body height": '8302-2' from "LOINC" display 'Body height'
code "Body weight": '29463-7' from "LOINC" display 'Body weight'
code "Body mass index": '39156-5' from "LOINC" display 'Body mass index'

code "Inhaled oxygen flow rate": '3151-8' from "LOINC" display 'Inhaled oxygen flow rate'
