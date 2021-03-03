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

// Symptoms as observed by a clinical user, overrides Observation queries, if any.
parameter Symptoms Tuple {
  Fever Boolean,
  Cough Boolean,
  SoreThroat Boolean,
  Malaise Boolean,
  Headache Boolean,
  MusclePain Boolean,
  Nausea Boolean,
  LossOfTasteAndSmell Boolean,
  ShortnessOfBreath Boolean
}

parameter ClinicalAssessments Tuple {
  Alertness String,               // Alert or Confused, as ValueSet
  InspiredOxygen Boolean,
  PerformanceStatus String,       // ValueSet with 5 codes
  Dyspnea Boolean,
  AbnormalChestImaging Boolean,
  PaO2FiO2Ratio Decimal,          // e.g. 300
  LungInfiltrates Decimal,        // Percent
  RespiratoryFailure Boolean,
  SepticShock Boolean,
  MultiorganDysfunction Boolean
}

// Risk Factors as specified by a clinical user, overrides Condition queries, if any.
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

define "Last O2 Saturation percent":
  // O2 Saturation should be reported as a percent, e.g. 92.
  if "Last O2 Saturation value" >= 1 then "Last O2 Saturation value"
  // If reported as decimal .92, then multiply by 100.
  else if "Last O2 Saturation value" is not null then Round(100.0 * "Last O2 Saturation value")
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

define "Last Body Temperature":
  C3F.MostRecent("Body Temperature Observations")

define "Last Body Temperature value in C":
  TemperatureInC("Last Body Temperature".value).value

define "Last Body Temperature value in F":
  TemperatureInF("Last Body Temperature".value).value

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
  case
    when "Last Body Weight value" is null then null
    when "Last Body Height value" is null then null
    else System.Quantity { value: Round("Last Body Weight value" / ("Last Body Height value" / 100) ^ 2), unit: 'kg/m2' }
  end

define function ToQuantity(quantity FHIR.Quantity):
	System.Quantity {
    	value: quantity.value.value,
      	unit: quantity.code.value  // use UCUM 'code' instead of Quantity 'unit'
    }

define function TemperatureInC(qty System.Quantity):
  case
    when qty.unit = 'Cel' then qty
  	when qty.unit = '[degF]' then
  		System.Quantity { value: Round((qty.value - 32) * (5 / 9), 1), unit: 'Cel' }
  	else null
  end

define function TemperatureInF(qty System.Quantity):
  case
    when qty.unit = '[degF]' then qty
    when qty.unit = 'Cel' then
      System.Quantity { value: Round((qty.value * (9/5)) + 32, 1), unit: '[degF]' }
    else null
  end

define function ToMetric(qty System.Quantity):
  case
  when qty is null then null
  when qty.value is null then null
  when qty.unit = '[lb_av]' then
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
* Determine Severity Classification
*/

define "Severity Classification":
  if "Is Critical Severity" then 'CRITICAL'
  else if "Is Severe Severity" then 'SEVERE'
  else if "Is Moderate Severity" then 'MODERATE'
  else if "Is Mild Severity" then 'MILD'
  else null

define "Is Critical Severity":
  if ClinicalAssessments.RespiratoryFailure
    or ClinicalAssessments.SepticShock
    or ClinicalAssessments.MultiorganDysfunction
    then true
  else false

// TODO PaO2/FiO2 < 300
// TODO Lung infiltrates > 50%
define "Is Severe Severity":
  if not "Is Critical Severity"
    and ("Last O2 Saturation percent" < 94
      or "Last Respiratory Rate value" > 30
      or ClinicalAssessments.PaO2FiO2Ratio < 300
      or ClinicalAssessments.LungInfiltrates > 50)
    then true
  else false

// TODO evidence of lower respiratory disease
// TODO on room air (not Supplemental Oxygen)
define "Is Moderate Severity":
  if not "Is Severe Severity" and not "Is Critical Severity"
    and ("Last O2 Saturation percent" >= 94
        or Symptoms.ShortnessOfBreath
        or ClinicalAssessments.Dyspnea
        or ClinicalAssessments.AbnormalChestImaging
    )
    then true
  else false

// TODO moved 3 parameters to Moderat as "evidence of lower respiratory disease"
define "Is Mild Severity":
  if not "Is Severe Severity" and not "Is Critical Severity" and not "Is Moderate Severity"
    and (Symptoms.Fever or Symptoms.Cough or Symptoms.SoreThroat or Symptoms.Malaise
          or Symptoms.Headache or Symptoms.MusclePain or Symptoms.Nausea or Symptoms.LossOfTasteAndSmell)
    then true
  else false

/*
* Risk Prognostication
*/

// TODO Alertness, InspiredOxygen, PerformanceStatus

define "Total Risk Score":
  "Respiratory Rate Risk Score" + "O2 Saturation Risk Score" + "Heart Rate Risk Score" + "Systolic BP Risk Score"
    + "Temperature Risk Score" + "Sex Risk Score" + "Age Risk Score"

define "Risk Percent":
  case "Total Risk Score"
    when null then null
    when 0 then 1
    when 1 then 1
    when 2 then 2
    when 3 then 2
    when 4 then 3
    when 5 then 9
    when 6 then 15
    when 7 then 18
    when 8 then 22
    when 9 then 26
    when 10 then 29
    when 11 then 34
    when 12 then 38
    when 13 then 46
    when 14 then 48
    when 15 then 50
    when 16 then 55
    else 66
  end

define "Respiratory Rate Risk Score":
  case
    when "Last Respiratory Rate value" between 12 and 20 then 0
    when "Last Respiratory Rate value" between 9 and 11 then 1
    when "Last Respiratory Rate value" between 21 and 24 then 2
    when "Last Respiratory Rate value" < 9 then 3
    when "Last Respiratory Rate value" > 24 then 3
    else 0
  end

define "O2 Saturation Risk Score":
  case
    when "Last O2 Saturation percent" > 95 then 0
    when "Last O2 Saturation percent" between 94 and 95 then 1
    when "Last O2 Saturation percent" between 92 and 93 then 2
    when "Last O2 Saturation percent" < 92 then 3
    else 0
  end

define "Heart Rate Risk Score":
  case
    when "Last Heart Rate value" between 51 and 90 then 0
    when "Last Heart Rate value" between 41 and 50 then 1
    when "Last Heart Rate value" between 91 and 110 then 1
    when "Last Heart Rate value" between 111 and 130 then 2
    when "Last Heart Rate value" < 41 then 3
    when "Last Heart Rate value" > 130 then 3
    else 0
  end

define "Systolic BP Risk Score":
  case
    when "Last SBP value" between 111 and 219 then 0
    when "Last SBP value" between 101 and 110 then 1
    when "Last SBP value" between 91 and 100 then 2
    when "Last SBP value" < 91 then 3
    when "Last SBP value" > 219 then 3
    else 0
  end

define "Temperature Risk Score":
  case
    when "Last Body Temperature value in C" between 36.1 and 38.0 then 0
    when "Last Body Temperature value in C" between 35.1 and 36.0 then 1
    when "Last Body Temperature value in C" between 38.1 and 39.0 then 1
    when "Last Body Temperature value in C" > 39.0 then 2
    when "Last Body Temperature value in C" < 35.1 then 3
    else 0
  end

define "Sex Risk Score":
  case
    when Patient.gender = 'female' then 0
    when Patient.gender = 'male' then 1
    else 0
  end

define "Age Risk Score":
  case
    when AgeInYears() between 16 and 49 then 0
    when AgeInYears() between 50 and 65 then 2
    when AgeInYears() between 66 and 80 then 3
    when AgeInYears() > 80 then 4
    else 0
  end

/*
 * Assess Risk Factors
 */

define "Risk Factors count":
  (if "Has Cancer Risk Factor" then 1 else 0)
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

define "Has Neurologic Disease Risk Factor":
  RiskFactors.NeurologicDisease

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

define "Has Pregnancy Risk Factor":
  RiskFactors.Pregnancy

define "Has Renal Disease Risk Factor":
  Coalesce(
    RiskFactors.RenalDisease,
    exists("All Active Conditions" C
      where C.code in CC."Renal Disease Codes")
  )

define "Has Steroid Usage Risk Factor":
  RiskFactors.SteroidUsage

/*
 * Diagnostic Testing
 */

define "Last ALT Lab Result":
  C3F.MostRecent(
    C3F.ObservationLookBack(
      C3F.Verified([Observation: CC."ALT Lab Results"]),
      LabResultsLookbackPeriod)
  )

define "Last AST Lab Result":
  C3F.MostRecent(
    C3F.ObservationLookBack(
      C3F.Verified([Observation: CC."AST Lab Results"]),
      LabResultsLookbackPeriod)
  )

define "Last CRP Lab Result":
  C3F.MostRecent(
    C3F.ObservationLookBack(
      C3F.Verified([Observation: CC."CRP Lab Results"]),
      LabResultsLookbackPeriod)
  )

define "Last Creatinine Lab Result":
  C3F.MostRecent(
    C3F.ObservationLookBack(
      C3F.Verified([Observation: CC."Creatinine Lab Results"]),
      LabResultsLookbackPeriod)
  )

define "Last D-dimer Lab Result":
  C3F.MostRecent(
    C3F.ObservationLookBack(
      C3F.Verified([Observation: CC."D-dimer Lab Results"]),
      LabResultsLookbackPeriod)
  )

define "Last Neutrophils Lab Result":
  C3F.MostRecent(
    C3F.ObservationLookBack(
      C3F.Verified([Observation: CC."Neutrophils Lab Results"]),
      LabResultsLookbackPeriod)
  )

define "Last Leukocyte Lab Result":
  C3F.MostRecent(
    C3F.ObservationLookBack(
      C3F.Verified([Observation: CC."Leukocyte Lab Results"]),
      LabResultsLookbackPeriod)
  )

define "Last Ferritin Lab Result":
  C3F.MostRecent(
    C3F.ObservationLookBack(
      C3F.Verified([Observation: CC."Ferritin Lab Results"]),
      LabResultsLookbackPeriod)
  )

define "Last Lymphocytes Lab Result":
  C3F.MostRecent(
    C3F.ObservationLookBack(
      C3F.Verified([Observation: CC."Lymphocytes Lab Results"]),
      LabResultsLookbackPeriod)
  )

define "Last Platelets Lab Result":
  C3F.MostRecent(
    C3F.ObservationLookBack(
      C3F.Verified([Observation: CC."Platelets Lab Results"]),
      LabResultsLookbackPeriod)
  )

define "Last LDH Lab Result":
  C3F.MostRecent(
    C3F.ObservationLookBack(
      C3F.Verified([Observation: CC."LDH Lab Results"]),
      LabResultsLookbackPeriod)
  )

define "Last Troponin Lab Result":
  C3F.MostRecent(
    C3F.ObservationLookBack(
      C3F.Verified([Observation: CC."Troponin Lab Results"]),
      LabResultsLookbackPeriod)
  )

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

define function ReportLabObservation(o FHIR.Observation):
  if (o is null) then null
  else
    {
      Date:   ObservationDate(o),
      Name:   ConceptText(o.code),                                // display nanme
      ResultText: QuantityText(o.value as FHIR.Quantity),         // result value with units
      ResultValue: ToString((o.value as FHIR.Quantity).value),
      ResultUnits: (o.value as FHIR.Quantity).unit.value,
      ReferenceRange: LabReferenceRange(o),
      Interpretation: LabInterpretation(o),
      Flag: LabReferenceRangeFlag(o)   // true if value out of range, else false
    }

define function LabReferenceRange(o FHIR.Observation):
  if (o is null or o.referenceRange is null) then null
  else
    Coalesce(First(o.referenceRange.text),
      ToString(LabReferenceRangeLow(o)) + '-' + ToString(LabReferenceRangeHigh(o))
    )

define function LabReferenceRangeLow(o FHIR.Observation):
  First(o.referenceRange).low.value

define function LabReferenceRangeHigh(o FHIR.Observation):
  First(o.referenceRange).high.value

define function LabReferenceRangeFlag(o FHIR.Observation):
  if (o.value.value < LabReferenceRangeLow(o)
      or o.value.value > LabReferenceRangeHigh(o)) then true
  else false

define function LabInterpretation(o FHIR.Observation):
  if (o.interpretation is not null) then
    Coalesce(First(o.interpretation.text), First(First(o.interpretation).coding.display))
  else if o.referenceRange is not null then
    // Derive interpretation from the reference range, return null if within normal range.
    if o.value.value < LabReferenceRangeLow(o) then 'L'
    else if o.value.value > LabReferenceRangeHigh(o) then 'H'
    else null
  else
    null

// The Summary object represents the full COVID-19 Risk Assessment to be displayed to the clinician.  All values are
// returned as user-friendly text representations.

define Summary: {
  Patient: {
    Name: ReportPatientName,
    Gender: Patient.gender.value,
    Age: AgeInYears(),
    Race: "Patient Race Text"
  },
  Risk: {
    SeverityClassification: "Severity Classification",
    RiskScore: "Total Risk Score",
    RiskPercent: "Risk Percent",
    RiskFactors: "Risk Factors count"
  },
  Disposition: {

  },
  SmartPhrases: {
    // TODO
  },
  ClinicalAssessment: {
    RespiratoryRate: "Last Respiratory Rate value",
    O2Saturation: "Last O2 Saturation percent",
    HeartRate: "Last Heart Rate value",
    BloodPressure: Last("Blood Pressure Observations").Display,
    SystolicBloodPressure: "Last SBP value",
    TemperatureC: "Last Body Temperature value in C",
    TemperatureF: "Last Body Temperature value in F",
    Alertness: null,
    InspiredOxygen: null,
    PerformanceStatus: null
  },
  RiskFactors: {
    Cancer: "Has Cancer Risk Factor",
    CardiovascularDisease: "Has Cardiovascular Disease Risk Factor",
    ChronicRespiratoryDisease: "Has Chronic Respiratory Disease Risk Factor",
    DiabetesType2: "Has Diabetes Type 2 Risk Factor",
    DownsSyndrome: "Has Downs Syndrome Risk Factor",
    Hypertension: "Has Hypertension Risk Factor",
    Immunosuppression: "Has Immunosuppression Risk Factor",
    NeurologicDisease: "Has Neurologic Disease Risk Factor",
    Obesity: "Has Obesity Risk Factor",
    ObstructiveSleepApnea: "Has Obstructive Sleep Apnea Risk Factor",
    Pregnancy: "Has Pregnancy Risk Factor",
    RenalDisease: "Has Renal Disease Risk Factor",
    SteroidUsage: "Has Steroid Usage Risk Factor"
  },
  DiagnosticAssessment: {
    ALT: ReportLabObservation("Last ALT Lab Result"),
    AST: ReportLabObservation("Last AST Lab Result"),
    Creatinine: ReportLabObservation("Last Creatinine Lab Result"),
    CRP: ReportLabObservation("Last CRP Lab Result"),
    DDimer: ReportLabObservation("Last D-dimer Lab Result"),
    Ferritin: ReportLabObservation("Last Ferritin Lab Result"),
    LDH: ReportLabObservation("Last LDH Lab Result"),
    Lymphopenia: ReportLabObservation("Last Lymphocytes Lab Result"),
    Neutrophils: ReportLabObservation("Last Neutrophils Lab Result"),
    Thrombocytopenia: ReportLabObservation("Last Platelets Lab Result"),
    Troponin: ReportLabObservation("Last Troponin Lab Result"),
    WBC: ReportLabObservation("Last Leukocyte Lab Result")
  }
}

define TrendData: {
  RespiratoryRate: ReportObservations("Respiratory Rate Observations"),
  O2Saturation: ReportObservations("O2 Saturation Observations"),
  HeartRate: ReportObservations("Heart Rate Observations"),
  BloodPressure: "Blood Pressure Observations",
  Temperature: "Body Temperature Observations"    // TODO convert all to degF
}
