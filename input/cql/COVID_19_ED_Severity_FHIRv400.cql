// # Introduction

// ACEP COVID-19 ED Severity Classification and Disposition Logic

library COVID_19_ED_Severity_FHIRv400 version '1.0.0'

// # Data model #

using FHIR version '4.0.1'

codesystem "LOINC": 'http://loinc.org'
code "Heart rate": '8867-4' from "LOINC" display 'Heart rate'

// # Referenced libraries #

// The FHIRHelpers library provides common functions for simplifying interaction w/ the FHIR R4 data model.
include FHIRHelpers version '4.0.1'
// The CDS Connect Commons for FHIRv400 library provides functions representing commonly used CDS logic and patterns.
include CDS_Connect_Commons_for_FHIRv400 version '1.0.2' called C3F
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
    return E.value as FHIR.string)

/*
 * Assess Vital Signs
 */

define function Verified(ObsList List<Observation>):
  ObsList O where O.status.value in {'final', 'corrected', 'amended'}

define "Heart Rates Test":
    [Observation: "Heart rate"]

define "Verified Heart Rate":
    Verified([Observation: "Heart rate"])

define "Last Heart Rate":
  C3F.MostRecent("Heart Rate Observations")

define "Last Heart Rate value":
  C3F.QuantityValue("Last Heart Rate")

define "Heart Rate Observations":
  C3F.ObservationLookBack(
    C3F.Verified([Observation: CC."Heart rate"]),
    VitalSignsLookbackPeriod)

define "Last SBP":
  Last("Blood Pressure Observations" o where o.Systolic is not null)

define "Last SBP value":
  "Last SBP".Systolic

define "Blood Pressure Observations":
 ("Blood Pressure Observation Components"
    union "Systolic Blood Pressure Observations")
    //union "Diastolic Blood Pressure Observations")

// Use when Systolic BP is reported as an independent Observation (not recommended)
define "Systolic Blood Pressure Observations":
  (C3F.ObservationLookBack(
    C3F.Verified([Observation: CC."Systolic blood pressure"]),
    VitalSignsLookbackPeriod)) bp
    return {
      "Date": ObservationDate(bp),
      "Systolic": ToString((bp.value as FHIR.Quantity).value),
      "Diasystolic": null
    }
    sort by Date asc

// Use when Diastolic BP is reported as an independent Observation (not recommended)
define "Diastolic Blood Pressure Observations":
  (C3F.ObservationLookBack(
    C3F.Verified([Observation: CC."Diastolic blood pressure"]),
    VitalSignsLookbackPeriod)) bp
    return {
      "Date": ObservationDate(bp),
      "Systolic": null,
      "Diasystolic": ToString((bp.value as FHIR.Quantity).value)
    }
    sort by Date asc

// TODO move into Commons library
define function ComponentValue(Obs FHIR.Observation, code System.Code):
  First(Obs.component c
    where c.code ~ ToConcept(code)).value as FHIR.Quantity

// Use the following if Systolic and Diastolic are combined as components within one Observation.
define "Blood Pressure Observation Components":
 (C3F.ObservationLookBack(C3F.Verified([Observation: CC."Blood pressure"]), VitalSignsLookbackPeriod)) bp
 return {
   "Date": ObservationDate(bp),
   "Systolic": ToString(ComponentValue(bp, CC."Systolic blood pressure").value),
   "Diasystolic": ToString(ComponentValue(bp, CC."Diastolic blood pressure").value)
 }
 sort by Date asc

define "Last O2 Saturation":
  C3F.MostRecent("O2 Saturation Observations")

define "Last O2 Saturation value":
  C3F.QuantityValue("Last O2 Saturation").value

// TODO lowest in what period?  24 hours before last value?  In current Encounter(s)?
define "Lowest O2 Saturation percent":
  // O2 Saturation should be reported as a percent, e.g. 92.
  if "Last O2 Saturation value" >= 1 then
   "Last O2 Saturation value"
  else
    // If reported as decimal .92, then multiply by 100.
    Round("Last O2 Saturation value")

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
  exists("All Active Conditions" C
    where C.code in CC."Hypertension Codes")

define "Has Malignancy Risk Factor":
  exists("All Active Conditions" C
    where C.code in CC."Malignancy Codes")

define "Has Renal Disease Risk Factor":
  exists("All Active Conditions" C
    where C.code in CC."Renal Disease Codes")

/*
 * Assess Symptoms
 */

// TODO Persistent dyspnea, Hemoptysis, Altered LOC

/*
 * Diagnostic Testing
 */

// TODO Retrieve and evaluate lab results


/***
 * TODO: Move these view object definitions to a separate CQL library.
 */
// SUMMARY

// Returns the first-found display text for a CodeableConcept, looking first at the `text` attribute, then the
// `display` on each `coding` until it finds a non-null value.
// @param c - a FHIR CodeableConcept to get text from
// @returns {System.String} the display text or null if none is found
define function ConceptText(c FHIR.CodeableConcept):
  Coalesce(c.text.value, Coalesce((c.coding) c2 return c2.display.value), Coalesce((c.coding) c3 return c3.code.value))

// Returns a text representation of a Quantity with the Quantity's value and unit.
// If the unit is {score}, then omit it (as it is not useful to display)
// @param q - a FHIR Quantity to get text for
// @returns {System.String} the text representation of the Quantity
define function QuantityText(q FHIR.Quantity):
  if (q is null) then null
  else if (q.unit is not null and q.unit.value != '{score}') then ToString(q.value.value) + ' ' + q.unit.value
  else if (q.code is not null and q.code.value != '{score}') then ToString(q.value.value) + ' ' + q.code.value
  else ToString(q.value.value)

// Returns a text representation of a date associated with an Observation, preferring `effectiveDateTime`, then
// `effectivePeriod.start`, then `issued`.
// @param o - a FHIR Observation to get the text date from
// @returns {System.String} the text representation of a relevant date from the Observation
define function ObservationDate(o FHIR.Observation):
  Coalesce(
    ToString((o.effective as FHIR.dateTime).value),
    ToString((o.effective as FHIR.instant).value),
    ToString(((o.effective as FHIR.Period)."start").value),
    ToString(o.issued.value)
  )

define ReportPatientName:
  Coalesce(Patient.name[0].text.value,
    (Combine(Patient.name.given G return G.value, ' ') + ' ' + Combine(Patient.name.family F return F.value, ' '))
  )

// Returns a list of observation view Tuples.
define function ReportObservations(ObsList List<Observation>):
  ObsList o
    return {   // result decimal value
      Date:   ObservationDate(o),
      // Omit display name because observations are in a typed collection
      //Name:   ConceptText(o.code),                              // display nanme
      Result: QuantityText(o.value as FHIR.Quantity),             // result value with units
      ResultValue: ToString((o.value as FHIR.Quantity).value)
    }
    sort by Date asc

// The Summary object represents the full COVID-19 Risk Assessment to be displayed to the clinician.  All values are
// returned as user-friendly text representations, but a robust user interface (UI) should be implemented to
// display the data to the user in a friendly manner.

define Summary: {
  Patient: {
    Name: ReportPatientName,
    Gender: Patient.gender.value,
    Age: AgeInYears(),
    Race: "Patient Race Text"
  },
  ClinicalAssessment: {
    HeartRate: ReportObservations("Heart Rate Observations"),
    BloodPressure: "Blood Pressure Observations",
    O2Saturation: ReportObservations("O2 Saturation Observations"),
    RespiratoryRate: ReportObservations("Respiratory Rate Observations"),
    O2FlowRate: ReportObservations("O2 Flow Rate Observations")
  },
  DiagnosticAssessment: {
    // add lab results here
  }
}
