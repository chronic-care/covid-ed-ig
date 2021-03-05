library COVID19Concepts version '1.0.0'

// ## Code Systems ##ß

codesystem "LOINC": 'http://loinc.org'
codesystem "SNOMED-CT": 'http://snomed.info/sct'
codesystem "Race": 'urn:oid:2.16.840.1.113883.6.238'

// ## Value sets ##

// [See value set in VSAC](https://vsac.nlm.nih.gov/valueset/2.16.840.1.113883.3.2074.1.1.3/expansion)
valueset "Race Category": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.2074.1.1.3'

// Value sets not available in VSAC, included via expanded FHIR ValueSet resources
valueset "Cardiovascular Disease Codes": 'http://fhir.org/guides/acep/ValueSet/covid-19-condition-risk-cardiovascular'
valueset "Chronic Respiratory Disease Codes": 'http://fhir.org/guides/acep/ValueSet/covid-19-condition-risk-respiratory'
valueset "Diabetes Type 2 Codes": 'http://fhir.org/guides/acep/ValueSet/covid-19-condition-risk-diabetes'
valueset "Downs Syndrome Codes": 'http://fhir.org/guides/acep/ValueSet/covid-19-condition-risk-downs-syndrome'
valueset "Hypertension Codes": 'http://fhir.org/guides/acep/ValueSet/covid-19-condition-risk-hypertension'
valueset "Malignancy Codes": 'http://fhir.org/guides/acep/ValueSet/covid-19-condition-risk-malignancy'
valueset "Obstructive Sleep Apnea Codes": 'http://fhir.org/guides/acep/ValueSet/covid-19-condition-risk-obstructive-sleep-apnea'
valueset "Renal Disease Codes": 'http://fhir.org/guides/acep/ValueSet/covid-19-condition-risk-renal'

// Lab results
valueset "ALT Lab Results": 'http://fhir.org/guides/acep/ValueSet/covid-19-lab-alt'
valueset "AST Lab Results": 'http://fhir.org/guides/acep/ValueSet/covid-19-lab-ast'
valueset "CRP Lab Results": 'http://fhir.org/guides/acep/ValueSet/covid-19-lab-crp'
valueset "Creatinine Lab Results": 'http://fhir.org/guides/acep/ValueSet/covid-19-lab-creatinine'
valueset "D-dimer Lab Results": 'http://fhir.org/guides/acep/ValueSet/covid-19-lab-ddimer'
valueset "Ferritin Lab Results": 'http://fhir.org/guides/acep/ValueSet/covid-19-lab-ferritin'
valueset "LDH Lab Results": 'http://fhir.org/guides/acep/ValueSet/covid-19-lab-ldh'
valueset "Leukocyte Lab Results": 'http://fhir.org/guides/acep/ValueSet/covid-19-lab-leukocyte'
valueset "Lymphocytes Lab Results": 'http://fhir.org/guides/acep/ValueSet/covid-19-lab-lymphocytes'
valueset "Neutrophils Lab Results": 'http://fhir.org/guides/acep/ValueSet/covid-19-lab-neutrophils'
valueset "Platelets Lab Results": 'http://fhir.org/guides/acep/ValueSet/covid-19-lab-platelets'
valueset "Troponin Lab Results": 'http://fhir.org/guides/acep/ValueSet/covid-19-lab-troponin'

// Value sets from VSAC
valueset "Obesity ICD10CM Codes": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.3616.200.110.102.3091'
valueset "Obesity SNOMED Codes": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.3616.200.110.102.6203'

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
