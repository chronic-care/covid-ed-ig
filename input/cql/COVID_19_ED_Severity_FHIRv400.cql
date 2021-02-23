// # Introduction

// ACEP COVID-19 ED Severity Classification and Disposition Logic

library COVID_19_ED_Severity_FHIRv400 version '1.0.0'

// # Data model #

using FHIR version '4.0.1'

// # Referenced libraries #

// The FHIRHelpers library provides common functions for simplifying interaction w/ the FHIR R4 data model.
include FHIRHelpers version '4.0.1'
// The CDS Connect Commons for FHIRv400 library provides functions representing commonly used CDS logic and patterns.
include CDS_Connect_Commons_for_FHIRv400 version '1.0.2' called C3F
// The COVID-19 Concepts library provides terminology concepts used to identify data elements throughout the artifact.
include COVID_19_Concepts version '1.0.0' called CC

// # Parameters #

// 12 months for test data, use '24 hours' as default in production?
// Or, get current, active (?) Patient Encounter(s) and find Observations associated with those Encounters
parameter VitalSignsLookbackPeriod default 12 months

// 12 months for test data, use '2 days' as default in production?
parameter LabResultsLookbackPeriod default 12 months

// Risk Factors as specified by clinical user, overrides Condition queries.
parameter RiskFactors Tuple {
  Cancer Boolean,
  CardiovascularDisease Boolean,
  ChronicRespiratoryDisease Boolean,
  DiabetesType2 Boolean,
  DownsSyndrome Boolean,
  Hypertension Boolean,
  Immunosuppression Boolean,
  NeurologicDisease Boolean,
  Obesity Boolean,
  ObstructiveSleepApnea Boolean,
  Pregnancy Boolean,
  RenalDisease Boolean,
  SteroidUsage Boolean
}

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

define "Last Heart Rate":
  C3F.MostRecent("Heart Rate Observations")

define "Last Heart Rate value":
  C3F.QuantityValue("Last Heart Rate").value

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

// Use when Systolic BP is reported as an independent Observation (not recommended)
define "Systolic Blood Pressure Observations":
  (C3F.ObservationLookBack(
    C3F.Verified([Observation: CC."Systolic blood pressure"]),
    VitalSignsLookbackPeriod)) bp
      let SystolicValue: Round((bp.value as FHIR.Quantity).value),
          DiastolicValue: Round((MatchingDiastolic(bp).value as FHIR.Quantity).value)
    return {
      "Date": ObservationDate(bp),
      "Systolic": SystolicValue,
      "Diastolic": DiastolicValue,
      "Display": Coalesce(ToString(SystolicValue), '-') + '/' + Coalesce(ToString(DiastolicValue), '-')
    }
    sort by Date asc

define function MatchingDiastolic(SystolicBP FHIR.Observation):
  First(
  (C3F.ObservationLookBack(
    C3F.Verified([Observation: CC."Diastolic blood pressure"]),
    VitalSignsLookbackPeriod)) bp
      where (bp.effective as FHIR.dateTime) = (SystolicBP.effective as FHIR.dateTime)
  )

// TODO move into Commons library
define function ComponentValue(Obs FHIR.Observation, code System.Code):
  First(Obs.component c
    where c.code ~ ToConcept(code)).value as FHIR.Quantity

// Use the following if Systolic and Diastolic are combined as components within one Observation.
define "Blood Pressure Observation Components":
  (C3F.ObservationLookBack(C3F.Verified([Observation: CC."Blood pressure"]), VitalSignsLookbackPeriod)) bp
    let SystolicValue: Round(ComponentValue(bp, CC."Systolic blood pressure").value),
        DiastolicValue: Round(ComponentValue(bp, CC."Diastolic blood pressure").value)
   return {
     "Date": ObservationDate(bp),
     "Systolic": SystolicValue,
     "Diastolic": DiastolicValue,
     "Display": Coalesce(ToString(SystolicValue), '-') + '/' + Coalesce(ToString(DiastolicValue), '-')
   }
   sort by Date asc

define "Last O2 Saturation value":
  C3F.QuantityValue(C3F.MostRecent("O2 Saturation Observations")).value

define "Lowest O2 Saturation value":
  C3F.LowestObservation("O2 Saturation Observations").value

// TODO lowest in what period?  24 hours before last value?  In current Encounter(s)?
define "Lowest O2 Saturation percent":
  // O2 Saturation should be reported as a percent, e.g. 92.
  if "Lowest O2 Saturation value" >= 1 then "Lowest O2 Saturation value"
  // If reported as decimal .92, then multiply by 100.
  else if "Lowest O2 Saturation value" is not null then Round(100.0 * "Lowest O2 Saturation value")
  else null

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

define "Last Body Temperature":
  C3F.MostRecent("Body Temperature Observations")

define "Last Body Temperature value":
  ToMetric(C3F.QuantityValue("Last Body Temperature")).value

define "Body Temperature Observations":
  C3F.ObservationLookBack(
    C3F.Verified([Observation: CC."Body temperature"]),
    VitalSignsLookbackPeriod)

define "Last Body Weight value":
  ToMetric(C3F.QuantityValue(C3F.MostRecent(
    C3F.ObservationLookBack(
      C3F.Verified([Observation: CC."Body weight"]),
      VitalSignsLookbackPeriod)
  ))).value

define "Last Body Height value":
  ToMetric(C3F.QuantityValue(C3F.MostRecent(
    C3F.ObservationLookBack(
      C3F.Verified([Observation: CC."Body height"]),
      VitalSignsLookbackPeriod)
  ))).value

define "Last BMI":
	System.Quantity { value: Round("Last Body Weight value" / ("Last Body Height value" / 100) ^ 2), unit: 'kg/m2' }

define function ToQuantity(quantity FHIR.Quantity):
	System.Quantity {
    	value: quantity.value.value,
      	unit: quantity.code.value  // use UCUM 'code' instead of Quantity 'unit'
    }

define function ToMetric(qty System.Quantity):
	case when qty.unit = '[lb_av]' then
		System.Quantity { value: qty.value * 0.454, unit: 'kg' }
	when qty.unit = 'g' then
		System.Quantity { value: qty.value / 1000, unit: 'kg' }
	when qty.unit = '[in_i]' then
		System.Quantity { value: qty.value * 2.54, unit: 'cm' }
	when qty.unit = '[degF]' then
		System.Quantity { value: (qty.value - 32) * (5 / 9), unit: 'Cel' }
	else
		qty
	end

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
    + (if "Has Cancer Risk Factor" then 1 else 0)
    + (if "Has Cardiovascular Disease Risk Factor" then 1 else 0)
    + (if "Has Chronic Respiratory Disease Risk Factor" then 1 else 0)
    + (if "Has Diabetes Type 2 Risk Factor" then 1 else 0)
    + (if "Has Downs Syndrome Risk Factor" then 1 else 0)
    + (if "Has Hypertension Risk Factor" then 1 else 0)
    + (if "Has Immunosuppression Risk Factor" then 1 else 0)
    + (if "Has Obstructive Sleep Apnea Risk Factor" then 1 else 0)
    + (if "Has Obesity Risk Factor" then 1 else 0)
    + (if "Has Renal Disease Risk Factor" then 1 else 0)
    + (if "Has Steroid Usage Risk Factor" then 1 else 0)

define "All Active Conditions":
  C3F.Confirmed(C3F.ActiveOrRecurring([Condition]))

define "Has Cancer Risk Factor":
  Coalesce(
    RiskFactors.Cancer,
    exists("All Active Conditions" C
      where C.code in CC."Malignancy Codes")
  )

define "Has Cardiovascular Disease Risk Factor":
  Coalesce(
    RiskFactors.CardiovascularDisease,
    exists("All Active Conditions" C
      where C.code in CC."Cardiovascular Disease Codes")
  )

define "Has Chronic Respiratory Disease Risk Factor":
  Coalesce(
    RiskFactors.ChronicRespiratoryDisease,
    exists("All Active Conditions" C
      where C.code in CC."Chronic Respiratory Disease Codes")
  )

define "Has Diabetes Type 2 Risk Factor":
  Coalesce(
    RiskFactors.DiabetesType2,
    exists("All Active Conditions" C
      where C.code in CC."Diabetes Type 2 Codes")
  )

define "Has Downs Syndrome Risk Factor":
  Coalesce(
    RiskFactors.DownsSyndrome,
    exists("All Active Conditions" C
      where C.code in CC."Downs Syndrome Codes")
  )

define "Has Hypertension Risk Factor":
  Coalesce(
    RiskFactors.Hypertension,
    exists("All Active Conditions" C
      where C.code in CC."Hypertension Codes")
  )

define "Has Immunosuppression Risk Factor":
  RiskFactors.Immunosuppression

define "Has Obstructive Sleep Apnea Risk Factor":
  Coalesce(
    RiskFactors.ObstructiveSleepApnea,
    exists("All Active Conditions" C
      where C.code in CC."Obstructive Sleep Apnea Codes")
  )

define "Has Obesity Risk Factor":
  Coalesce(
    RiskFactors.Obesity,
    (exists("All Active Conditions" C
      where (C.code in CC."Obesity SNOMED Codes"
        or C.code in CC."Obesity ICD10CM Codes"))
     or "Last BMI".value > 30),
    false
  )

define "Has Renal Disease Risk Factor":
  Coalesce(
    RiskFactors.RenalDisease,
    exists("All Active Conditions" C
      where C.code in CC."Renal Disease Codes")
  )

define "Has Steroid Usage Risk Factor":
  RiskFactors.SteroidUsage

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
      Name:   ConceptText(o.code),                                // display nanme
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
