library COVID19Concepts version '1.0.0'

// ## Code Systems ##ß

codesystem "LOINC": 'http://loinc.org'
codesystem "SNOMED-CT": 'http://snomed.info/sct'
codesystem "Race": 'urn:oid:2.16.840.1.113883.6.238'

// Several concepts needed by the COVID-19 CDS do not yet have standardized codes associated with them.
// Until standardized codes are available, CDS implementors will need to map to
// local codes (signified by the LOCAL code system below) or replace them with their own codes.
codesystem "LOCAL": 'http://fhir.org/guides/acep'

// ## Value sets ##

// [See value set in VSAC](https://vsac.nlm.nih.gov/valueset/2.16.840.1.113883.3.2074.1.1.3/expansion)
valueset "Race Category": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.2074.1.1.3'



valueset "Alertness Scale Codes": 'http://fhir.org/guides/acep/ValueSet/covid-19-obs-alertness'
valueset "WHO Performance Status Codes": 'http://fhir.org/guides/acep/ValueSet/who-performance-status'

// Lab results
valueset "ALT Lab Results": 'http://fhir.org/guides/acep/ValueSet/covid-19-lab-alt'
valueset "AST Lab Results": 'http://fhir.org/guides/acep/ValueSet/covid-19-lab-ast'
valueset "CRP Lab Results": 'http://fhir.org/guides/acep/ValueSet/covid-19-lab-crp'
valueset "D-dimer Lab Results": 'http://fhir.org/guides/acep/ValueSet/covid-19-lab-ddimer'
valueset "Ferritin Lab Results": 'http://fhir.org/guides/acep/ValueSet/covid-19-lab-ferritin'
valueset "LDH Lab Results": 'http://fhir.org/guides/acep/ValueSet/covid-19-lab-ldh'
valueset "Lymphocytes Lab Results": 'http://fhir.org/guides/acep/ValueSet/covid-19-lab-lymphocytes'
valueset "Neutrophils Lab Results": 'http://fhir.org/guides/acep/ValueSet/covid-19-lab-neutrophils'
valueset "PaO2FiO2 Ratio Lab Results": 'http://fhir.org/guides/acep/ValueSet/covid-19-lab-pao2fio2'
valueset "PCT Lab Results": 'http://fhir.org/guides/acep/ValueSet/covid-19-lab-procalcitonin'
valueset "Interleukin 1 Lab Results": 'http://fhir.org/guides/acep/ValueSet/covid-19-lab-interleukin1'
valueset "Interleukin 6 Lab Results": 'http://fhir.org/guides/acep/ValueSet/covid-19-lab-interleukin6'
valueset "Interleukin 8 Lab Results": 'http://fhir.org/guides/acep/ValueSet/covid-19-lab-interleukin8'
valueset "Tumor Necrosis Factor Alpha Lab Results": 'http://fhir.org/guides/acep/ValueSet/covid-19-lab-tnfalpha'



//Value sets for risk factor 
valueset "Corticosteroids Usage ICD10CM Codes": 'http://fhir.org/guides/acep/ValueSet/covid-19-condition-risk-steroid-usage-icd10'
valueset "Corticosteroids Usage SNOMED Codes": 'http://fhir.org/guides/acep/ValueSet/covid-19-condition-risk-steroid-usage-snomed'
// Value sets not available in VSAC, included via expanded FHIR ValueSet resources
valueset "Diabetes ICD10CM Codes": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.3616.200.110.102.3153'
valueset "Diabetes SNOMED Codes": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.3616.200.110.102.6100'
valueset "Downs Syndrome SNOMED Codes": 'http://fhir.org/guides/acep/ValueSet/covid-19-condition-risk-downs-syndrome-snomed'
valueset "Downs Syndrome ICD10CM Codes": 'http://fhir.org/guides/acep/ValueSet/covid-19-condition-risk-downs-syndrome-icd10'
valueset "Immune Deficiencies ICD10CM Codes": 'http://fhir.org/guides/acep/ValueSet/covid-19-condition-risk-immunosuppression-icd10'
valueset "Immune Deficiencies SNOMED Codes": 'http://fhir.org/guides/acep/ValueSet/covid-19-condition-risk-immunosuppression-snomed'
valueset "Cancer ICD10CM Codes": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.3616.200.110.102.3028'
valueset "Cancer SNOMED Codes": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.3616.200.110.102.6048'
valueset "Kidney Disease ICD10CM Codes": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.3616.200.110.102.3102'
valueset "Kidney Disease SNOMED Codes": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.3616.200.110.102.6064'


// ## Individual codes ##

// list individual codes from code systems used directly in the CQL logic. Individual codes are used when there is
// a single code from a particular vocabulary standard used to represent a clinical concept. It is considered
// best-practice not to create value sets containing a single code.

code "Black or African American": '2054-5' from "Race" display 'Black or African American'
code "White": '2106-3' from "Race" display 'White'

// Code from Alertness Scale
code "Confused": '130987000' from "SNOMED-CT" display 'Acute confusion (finding)'
code "Alert": '365933000' from "SNOMED-CT" display 'Mental alertness (finding)'

// Codes from WHO Performance Status scale
code "Performance Status 0": '373803006' from "SNOMED-CT" display 'World Health Organization performance status grade 0 (finding)'
code "Performance Status 1": '373804000' from "SNOMED-CT" display 'World Health Organization performance status grade 1 (finding)'
code "Performance Status 2": '373805004' from "SNOMED-CT" display 'World Health Organization performance status grade 2 (finding)'
code "Performance Status 3": '373806003' from "SNOMED-CT" display 'World Health Organization performance status grade 3 (finding)'
code "Performance Status 4": '373807007' from "SNOMED-CT" display 'World Health Organization performance status grade 4 (finding)'

code "Blood pressure": '85354-9' from "LOINC" display 'Blood pressure systolic and diastolic'
code "Blood pressure, deprecated": '55284-4' from "LOINC" display 'Blood pressure systolic and diastolic'
code "Systolic blood pressure": '8480-6' from "LOINC" display 'Systolic blood pressure'
code "Diastolic blood pressure": '8462-4' from "LOINC" display 'Diastolic blood pressure'

valueset "Blood pressure codes": 'http://fhir.org/guides/acep/ValueSet/covid-19-condition-vital-blood-pressure'

code "Heart rate": '8867-4' from "LOINC" display 'Heart rate'
code "Oxygen saturation": '2708-6' from "LOINC" display 'Oxygen saturation'
code "Pulse oximetry": '59408-5' from LOINC display 'Oxygen saturation in Arterial blood by Pulse oximetry'
code "Respiratory rate": '9279-1' from "LOINC" display 'Respiratory rate'
code "Body temperature": '8310-5' from "LOINC" display 'Body temperature'
code "Body height": '8302-2' from "LOINC" display 'Body height'
code "Body weight": '29463-7' from "LOINC" display 'Body weight'
code "Body mass index": '39156-5' from "LOINC" display 'Body mass index'
code "Inhaled oxygen flow rate": '3151-8' from "LOINC" display 'Inhaled oxygen flow rate'
