// # Introduction

// The Preventive Care logic library supports decision-making on preventive care screening for Prostate Cancer.

library COVID_19_ED_Severity_FHIRv400 version '1.0.0'

// # Data model #

using FHIR version '4.0.1'

// # Referenced libraries #

// The FHIRHelpers library provides common functions for simplifying interaction w/ the FHIR R4 data model.
include FHIRHelpers version '4.0.1' called FHIRHelpers
// The CDS Connect Commons for FHIRv400 library provides functions representing commonly used CDS logic and patterns.
include CDS_Connect_Commons_for_FHIRv400 version '1.0.2' called C3F
// The CDS_Reporting library provides common functions for summarizing and reporting clinical data
include CDS_Reporting_FHIRv400 version '1.0.0' called RPT
// The COVID-19 Concepts library provides terminology concepts used to identify data elements throughout the artifact.
include COVID_19_Concepts version '1.0.0' called CC

// # Parameters #

/*
 * TODO For test data with 2 hour intervals of data, could create a test scenario driver that
 *      runs CQL with progressively greater "current" date, 2 hour increments.
 */

// 12 months for test data, use '24 hours' as default in production?
// Or, get current, active (?) Patient Encounter(s) and find Observations associated with those Encounters
parameter VitalSignsLookbackPeriod default 12 months

// 12 months for test data, use '2 days' as default in production?
parameter LabResultsLookbackPeriod default 12 months

// # CDS logic #

context Patient

/*
 * Demographics
 */

 define "Patient Age":
   AgeInYears()

define "Age 60 or older":
  AgeInYears() >= 60

define "Patient is Male":
  Patient.gender = 'male'

define "Patient is Black":
  "Patient Race" contains CC."Black or African American"

define "Patient Race":
  (flatten (
    Patient.extension Extension
      where Extension.url = 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-race'
        return Extension.extension
  )) E
    where E.url = 'ombCategory'
      or E.url = 'detailed'
    return E.value as Coding

define "Patient Race Text":
  First((flatten (
    Patient.extension Extension
      where Extension.url = 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-race'
        return Extension.extension
  )) E
    where E.url = 'text'
    return E.value)

/*
 * Assess Vital Signs
 */

define "Last Heart Rate":
  C3F.MostRecent("Heart Rate Observations")

define "Last Heart Rate value":
  C3F.QuantityValue("Last Heart Rate")

define "Heart Rate Observations":
  C3F.ObservationLookBack(
    C3F.Verified([Observation: CC."Heart rate"]),
    VitalSignsLookbackPeriod)

define "Last SBP":
  C3F.MostRecent("Systolic Blood Pressure Readings")

define "Last SBP value":
  C3F.QuantityValue("Last SBP")

define "Systolic Blood Pressure Readings":
  C3F.ObservationLookBack(
    C3F.Verified([Observation: CC."Systolic blood pressure"]),
    VitalSignsLookbackPeriod)

// Use the following if Systolic and Diastolic are combined as components within one Observation.
/*
define "Systolic Blood Pressure Readings":
	[Observation: CC."Blood pressure"] BloodPressure
	  where BloodPressure.status in {'final', 'amended'}
     and BloodPressure.effective during "Vital Signs Measurement Period"
	    // and not (GetEncounter(BloodPressure.encounter).class.code in { 'EMER', 'IMP', 'ACUTE', 'NONAC', 'PRENC', 'SS'})
     and exists (
       BloodPressure.component SystolicBP
	        where SystolicBP.code ~ ToConcept(CC."Systolic blood pressure")
     )
*/

define "Last O2 Saturation":
  C3F.MostRecent("O2 Saturation Observations")

define "Last O2 Saturation percent":
  Round(C3F.QuantityValue("Last O2 Saturation").value * 100)

// TODO lowest in what period?  24 hours before last value?  In current Encounter(s)?
define "Lowest O2 Saturation percent":
  Round(C3F.LowestObservation("O2 Saturation Observations").value * 100)

define "O2 Saturation Observations":
  C3F.ObservationLookBack(
    C3F.Verified([Observation: CC."Oxygen saturation"]),
    VitalSignsLookbackPeriod)

define "Last Respiratory Rate":
  C3F.MostRecent("Respiratory Rate Observations")

define "Last Respiratory Rate value":
  C3F.QuantityValue("Last Respiratory Rate").value

define "Respiratory Rate Observations":
  C3F.ObservationLookBack(
    C3F.Verified([Observation: CC."Respiratory rate"]),
    VitalSignsLookbackPeriod)

define "Last O2 Flow Rate":
  C3F.MostRecent("O2 Flow Rate Observations")

define "Last O2 Flow Rate value":
  C3F.QuantityValue("Last O2 Flow Rate").value

define "O2 Flow Rate Observations":
  C3F.ObservationLookBack(
    C3F.Verified([Observation: CC."Inhaled oxygen flow rate"]),
    VitalSignsLookbackPeriod)

/*
* Calculate qCSI
*/

define "qCSI Score":
  "O2 Saturation Score" + "Respiratory Rate Score" + "O2 Flow Rate Score"

define "O2 Saturation Score":
  if "Lowest O2 Saturation percent" between 89 and 92 then 2
  else if "Lowest O2 Saturation percent" <= 88 then 5
  else 0

define "Respiratory Rate Score":
  if "Last Respiratory Rate value" between 23 and 28 then 1
  else if "Last Respiratory Rate value" >= 29 then 2
  else 0

// TODO is flow rate always an integer value?
define "O2 Flow Rate Score":
  if "Last O2 Flow Rate value" between 3 and 4 then 4
  else if "Last O2 Flow Rate value" > 4 then 5
  else 0

/*
* Determine Severity Classification
*/

define "Severity Classification":
  if "Is Critical Risk" then 'Critical'
  else if "Is Severe Risk" then 'Severe'
  else if "Is Moderate Risk" then 'Moderate'
  else if "Is Mild At Risk" then 'Mild At Risk'
  else if "Is Mild Low Risk" then 'Mild Low Risk'
  else null

define "Is Critical Risk":
  if "Last SBP value" < 90
    or "qCSI Score" >= 9
    then true
  else false

define "Is Severe Risk":
  if not "Is Critical Risk"
    and ("Lowest O2 Saturation percent" <= 88
      or "Last O2 Flow Rate value" >= 5
      or "qCSI Score" between 6 and 8)
    then true
  else false

define "Is Moderate Risk":
  if not "Is Severe Risk" and not "Is Critical Risk"
    and ("Last Heart Rate value" >= 121
      or "Lowest O2 Saturation percent" between 89 and 92
      or "Last Respiratory Rate value" >= 29
      or "Last O2 Flow Rate value" between 3 and 4
      or "qCSI Score" between 3 and 5)
    then true
  else false

define "Is Mild At Risk":
  if not "Is Severe Risk" and not "Is Critical Risk" and not "Is Moderate Risk"
    and ("Last Heart Rate value" between 100 and 120
      or "Last Respiratory Rate value" between 23 and 28
      or "Last O2 Flow Rate value" between 1 and 2
      or "qCSI Score" between 1 and 2
      or "Risk Factors count" >= 2)
    then true
  else false

define "Is Mild Low Risk":
  if not "Is Severe Risk" and not "Is Critical Risk" and not "Is Moderate Risk" and not "Is Mild At Risk"
    and "Last Heart Rate value" <= 99
    and "Lowest O2 Saturation percent" >= 93
    and "Last Respiratory Rate value" <= 22
    and "O2 Flow Rate Observations" is null
    and "qCSI Score" = 0
    and "Risk Factors count" between 0 and 1
    then true
  else false

/*
 * Assess Risk Factors
 */

define "Risk Factors count":
  (if "Patient is Male" then 1 else 0)
    + (if "Patient is Black" then 1 else 0)
    + (if "Age 60 or older" then 1 else 0)
    + (if "Has Hypertension Risk Factor" then 1 else 0)
    + (if "Has Malignancy Risk Factor" then 1 else 0)
    + (if "Has Renal Disease Risk Factor" then 1 else 0)
    // TODO remaining condition risks

define "All Active Conditions":
  C3F.Confirmed(C3F.ActiveOrRecurring([Condition]))

// TODO Include remaining risk conditions based on value sets.
// TODO LT Care Resident

define "Has Hypertension Risk Factor":
  Count("All Active Conditions" C
    where C.code in CC."Hypertension Codes") > 0

define "Has Malignancy Risk Factor":
  Count("All Active Conditions" C
    where C.code in CC."Malignancy Codes") > 0

define "Has Renal Disease Risk Factor":
  Count("All Active Conditions" C
    where C.code in CC."Renal Disease Codes") > 0

/*
 * Assess Symptoms
 */

// TODO Persistent dyspnea, Hemoptysis, Altered LOC

/*
 * Diagnostic Testing
 */

// TODO Retrieve and evaluate lab results
