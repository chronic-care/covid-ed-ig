// # Introduction

// ACEP Emergency Department COVID-19 Management Tool

library COVID19EmergencyDeptAssessment version '1.0.0'

// # Data model #

using FHIR version '4.0.1'

// # Referenced libraries #

// The COVID-19 Concepts library provides terminology concepts used to identify data elements throughout the artifact.
include COVID19Concepts version '1.0.0' called CC
// The CDS Connect Commons for FHIRv400 library provides functions representing commonly used CDS logic and patterns.
include CDSConnectCommons version '1.0.3' called C3F
// The FHIRHelpers library provides common functions for simplifying interaction w/ the FHIR R4 data model.
include FHIRHelpers version '4.0.1'

// # Parameters #

// 12 months for test data, use '24 hours' as default in production?
// Or, get current, active (?) Patient Encounter(s) and find Observations associated with those Encounters
parameter VitalSignsLookbackPeriod default 12 months

// 12 months for test data, use '2 days' as default in production?
parameter LabResultsLookbackPeriod default 12 months

// This parameter instructs logic to always override corresponding FHIR data from EHR, including when parameter value is null.
// TODO rename to AlwaysOverrideSourceData?
// TODO replace with proposed Tuple structure for parameters {value Any, unknown Boolean}
parameter IgnoreFallbackResourceValues Boolean default false

/*
 * Proposed parameter structure for unknown values, not currently used in the logic.
 */
parameter ClinicalAssessmentsProposed Tuple {
  O2Saturation Tuple { value Any, unknown Boolean },
  HeartRate Tuple { value Any, unknown Boolean }
}
  default {
    O2Saturation: {value: 88, unknown: false},
    HeartRate: {value: null, unknown: true}
  }

// Observations by a clinical user, overrides Observation queries, if any.
parameter ClinicalAssessments Tuple {
  RespiratoryRate Decimal,
  O2Saturation Decimal,
  HeartRate Decimal,
  SystolicBloodPressure Decimal,
  TemperatureF Decimal,
  Alertness String,               // Code from value set "Alertness Scale Codes"
  SupplementalOxygen Boolean,
  PerformanceStatus String,       // Code from value set "WHO Performance Status Codes"
  AnyMildCOVIDSymptoms Boolean,
  Dyspnea Boolean,
  ShortnessOfBreath Boolean,
  RespiratoryDiseaseSymptoms Boolean,
  RespiratoryDiseaseImagingEvidence Boolean,
  ChestXRayConcerning Boolean,
  UltrasoundConcerning Boolean,
  CTConcerning Boolean,
  LungInfiltratesOver50 Boolean,
  PaO2FiO2RatioLessThan300 Boolean,
  RespiratoryFailure Boolean,
  SepticShock Boolean,
  MultiorganDysfunction Boolean,
  ConcerningLabCount Decimal
}
/*
  // Use for testing parameter inputs
  default {
    RespiratoryRate: 15.0,
    O2Saturation: 96.0,
    HeartRate: 70.0,
    SystolicBloodPressure: 130.0,
    TemperatureF: 99.0,
    Alertness: '',
    SupplementalOxygen: false,
    PerformanceStatus: '',
    AnyMildCOVIDSymptoms: true,
    Dyspnea: false,
    ShortnessOfBreath: false,
    RespiratoryDiseaseSymptoms: true,
    RespiratoryDiseaseImagingEvidence: false,
    ChestXRayConcerning: false,
    UltrasoundConcerning: false,
    CTConcerning: false,
    LungInfiltratesOver50: false,
    PaO2FiO2RatioLessThan300: false,
    RespiratoryFailure: false,
    SepticShock: false,
    MultiorganDysfunction: false,
    ConcerningLabCount: 1.0
  }
*/

// Risk Factors as specified by a clinical user, overrides Condition queries, if any.
parameter RiskFactors Tuple {
  Bronchiectasis Boolean,
  BronchopulmonaryDysplasia Boolean,
  PulmonaryHypertension Boolean,
  PulmonaryEmbolism Boolean,
  Cancer Boolean,
  CerebrovascularDisease Boolean,
  ChronicKidneyDisease Boolean,
  ChronicLiverDisease Boolean,
  COPD Boolean,
  DiabetesMellitus Boolean,
  HeartConditions Boolean,
  InterstitialLungDisease Boolean,
  CurrentAndFormerSmoking Boolean,
  Tuberculosis Boolean,
  Obesity Boolean,
  PregnancyAndRecentPregnancy Boolean,
  MentalHealthDisorders Boolean,
  ChildrenWithCertainUnderlyingConditions Boolean,
  DownSyndrome Boolean,
  HIV Boolean,
  NeurologicConditions Boolean,
  Overweight Boolean,
  SickleCellDisease Boolean,
  SolidOrganOrBloodStemTransplantation Boolean,
  SubstanceUseDisorders Boolean,
  Corticosteroids Boolean,
  ImmunosuppressiveMedications Boolean,
  CysticFibrosis Boolean,
  Thalassemia Boolean,
  Asthma Boolean,
  Hypertension Boolean,
  ImmuneDeficiencies Boolean
}

parameter PatientData Tuple {
  Gender String,
  Age Integer
}


// # CDS logic #

context Patient

/*
 * Demographics
 */

define "Patient Age":
 AgeInYears()

define "Patient Birth Sex":
  First(Patient.extension e
      where e.url = 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex'
  ).value

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

define function DecimalValue(value Decimal, param Tuple{value Any, unknown Boolean}):
  if param.unknown is true then null
  else Coalesce(param.value as Decimal, value)

define LastHeartRateValueProposed:
  DecimalValue("Last Heart Rate value", ClinicalAssessmentsProposed.HeartRate)


define "Last Heart Rate":
  C3F.MostRecent("Heart Rate Observations")

define "Last Heart Rate value":
  if IgnoreFallbackResourceValues then ClinicalAssessments.HeartRate
  else Coalesce(ClinicalAssessments.HeartRate,
    C3F.QuantityValue("Last Heart Rate").value)

define "Heart Rate Observations":
  C3F.ObservationLookBack(
    C3F.Verified([Observation: CC."Heart rate"]),
    VitalSignsLookbackPeriod)

define "Last Blood Pressure":
  (C3F.MostRecent(C3F.ObservationLookBack(C3F.Verified(
        [Observation: CC."Blood pressure codes"]), VitalSignsLookbackPeriod))) bp
    let SystolicValue: Round(ComponentValue(bp, CC."Systolic blood pressure").value),
        DiastolicValue: Round(ComponentValue(bp, CC."Diastolic blood pressure").value)
   return {
     "Date": ToString(C3F.FindDate(bp)),
     "Systolic": SystolicValue,
     "Diastolic": DiastolicValue,
     "Display": Coalesce(ToString(SystolicValue), '-') + '/' + Coalesce(ToString(DiastolicValue), '-')
   }

define "Last SBP value":
  if IgnoreFallbackResourceValues then ClinicalAssessments.SystolicBloodPressure
  else Coalesce(ClinicalAssessments.SystolicBloodPressure,
    "Last Blood Pressure".Systolic)

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
      //"Date": ObservationDate(bp),
      "Date": ToString(C3F.FindDate(bp)),
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
  (C3F.ObservationLookBack(C3F.Verified(
        [Observation: CC."Blood pressure codes"]
      ), VitalSignsLookbackPeriod)) bp
    let SystolicValue: Round(ComponentValue(bp, CC."Systolic blood pressure").value),
        DiastolicValue: Round(ComponentValue(bp, CC."Diastolic blood pressure").value)
   return {
     "Date": ToString(C3F.FindDate(bp)),
     "Systolic": SystolicValue,
     "Diastolic": DiastolicValue,
     "Display": Coalesce(ToString(SystolicValue), '-') + '/' + Coalesce(ToString(DiastolicValue), '-')
   }
   sort by Date asc

define "Last O2 Saturation value":
  if IgnoreFallbackResourceValues then ClinicalAssessments.O2Saturation
  else Coalesce(ClinicalAssessments.O2Saturation,
    C3F.QuantityValue(C3F.MostRecent("O2 Saturation Observations")).value)

define "Last O2 Saturation percent":
  // O2 Saturation should be reported as a percent, e.g. 92.
  if "Last O2 Saturation value" >= 1 then "Last O2 Saturation value"
  // If reported as decimal .92, then multiply by 100.
  else if "Last O2 Saturation value" is not null then Round(100.0 * "Last O2 Saturation value")
  else null

define "O2 Saturation Observations":
  C3F.ObservationLookBack(
    C3F.Verified([Observation: CC."Oxygen saturation"]), VitalSignsLookbackPeriod)
  union
  C3F.ObservationLookBack(
    C3F.Verified([Observation: CC."Pulse oximetry"]), VitalSignsLookbackPeriod)

define "Has Supplemental Oxygen":
  if IgnoreFallbackResourceValues then ClinicalAssessments.SupplementalOxygen
  else Coalesce(ClinicalAssessments.SupplementalOxygen,
    C3F.QuantityValue("Last Inhaled Oxygen Flow Rate").value > 0.0)

define "Last Inhaled Oxygen Flow Rate":
  C3F.MostRecent("Inhaled Oxygen Flow Rate Observations")

define "Inhaled Oxygen Flow Rate Observations":
  C3F.ObservationLookBack(
    C3F.Verified([Observation: CC."Inhaled oxygen flow rate"]),
    VitalSignsLookbackPeriod)

define "Last Respiratory Rate":
  C3F.MostRecent("Respiratory Rate Observations")

define "Last Respiratory Rate value":
  Message(
  if IgnoreFallbackResourceValues then ClinicalAssessments.RespiratoryRate
  else Coalesce(ClinicalAssessments.RespiratoryRate,
    C3F.QuantityValue("Last Respiratory Rate").value)
  , true, 'Undefined', 'Trace', 'Calculating "Last Respiratory Rate value"')

define "Respiratory Rate Observations":
  C3F.ObservationLookBack(
    C3F.Verified([Observation: CC."Respiratory rate"]),
    VitalSignsLookbackPeriod)

define "Last Body Temperature":
  C3F.MostRecent("Body Temperature Observations")

define "Last Body Temperature value in C":
  if IgnoreFallbackResourceValues then
    if ClinicalAssessments.TemperatureF is null then null
    else TemperatureInC( System.Quantity {value: ClinicalAssessments.TemperatureF, unit: '[degF]'} ).value
  else if ClinicalAssessments.TemperatureF is null then
    TemperatureInC("Last Body Temperature".value).value
  else
    TemperatureInC( System.Quantity {value: ClinicalAssessments.TemperatureF, unit: '[degF]'} ).value

define "Last Body Temperature value in F":
  if IgnoreFallbackResourceValues then ClinicalAssessments.TemperatureF
  else Coalesce(ClinicalAssessments.TemperatureF,
    TemperatureInF("Last Body Temperature".value).value)

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
 * Clinical Assessments
 */

// TODO: Enchancement - [Observation: "Glasgow Coma Scale"] score total > 15 = Confused
define "Last Glasgow Coma Scale score":
  null

// Code from value set "Alertness Scale Codes"
define "Alertness Assessment Code":
  ClinicalAssessments.Alertness

// Code from "WHO Performance Status Codes"
define "Performance Status Code":
  ClinicalAssessments.PerformanceStatus

/*
* Determine Severity Classification
*/

define "Severity Classification":
  Message(
  if "Is Critical Severity" then 'CRITICAL'
  else if "Is Severe Severity" then 'SEVERE'
  else if "Is Moderate Severity" then 'MODERATE'
  else if "Is Mild Severity" then 'MILD'
  else null
  , true, 'Undefined', 'Trace', 'Calculating Severity Classification')

define "Is Critical Severity":
  Message(if ClinicalAssessments.RespiratoryFailure
    or ClinicalAssessments.SepticShock
    or ClinicalAssessments.MultiorganDysfunction
    then true
  else false, true, 'Undefined', 'Trace', 'Calculating Is Critical Severity')

define "Is Severe Severity":
  Message(if not "Is Critical Severity"
    and (("Last O2 Saturation percent" is not null and "Last O2 Saturation percent" < 94)
      or ("Last Respiratory Rate value" is not null and "Last Respiratory Rate value" > 30)
      or ("Last PaO2FiO2 Ratio Lab Result Less Than 300" is not null and "Last PaO2FiO2 Ratio Lab Result Less Than 300" is true)
      or ClinicalAssessments.LungInfiltratesOver50)
    then true
  else false, true, 'Undefined', 'Trace', 'Calculating Is Severe Severity')

// TODO O2 Sat on room air (not Supplemental Oxygen)
define "Is Moderate Severity":
  Message(if not "Is Severe Severity" and not "Is Critical Severity"
    and ("Last O2 Saturation percent" is not null and "Last O2 Saturation percent" >= 94)
    and (ClinicalAssessments.RespiratoryDiseaseSymptoms
        or ClinicalAssessments.RespiratoryDiseaseImagingEvidence)
    then true
  else false, true, 'Undefined', 'Trace', 'Calculating Is Moderate Severity')

// TODO moved 3 parameters to Moderat as "evidence of lower respiratory disease"
define "Is Mild Severity":
  Message(if not "Is Severe Severity" and not "Is Critical Severity" and not "Is Moderate Severity"
    and ClinicalAssessments.AnyMildCOVIDSymptoms is true
    and ClinicalAssessments.RespiratoryDiseaseSymptoms is false
    then true
  else false, true, 'Undefined', 'Trace', 'Calculating Mild Severity')

/*
* Risk Prognostication
*/

define "Risk Score Components": List {
  Message("Respiratory Rate Risk Score", true, 'Undefined', 'Trace', 'Calculating "Respiratory Rate Risk Score"'),
  Message("O2 Saturation Risk Score", true, 'Undefined', 'Trace', 'Calculating "O2 Saturation Risk Score"'),
  Message("Heart Rate Risk Score", true, 'Undefined', 'Trace', 'Calculating "Heart Rate Risk Score"'),
  Message("Systolic BP Risk Score", true, 'Undefined', 'Trace', 'Calculating "Systolic BP Risk Score"'),
  Message("Temperature Risk Score", true, 'Undefined', 'Trace', 'Calculating "Temperature Risk Score"'),
  Message("Alertness Score", true, 'Undefined', 'Trace', 'Calculating "Alertness Score"'),
  Message("Inspired Oxygen Score", true, 'Undefined', 'Trace', 'Calculating "Inspired Oxygen Score"'),
  Message("Sex Risk Score", true, 'Undefined', 'Trace', 'Calculating "Sex Risk Score"'),
  Message("Age Risk Score", true, 'Undefined', 'Trace', 'Calculating "Age Risk Score"'),
  Message("Performance Status Score", true, 'Undefined', 'Trace', 'Calculating "Performance Status Score"')
}

define "Total Risk Score":
  Message(
  Sum("Risk Score Components")
  , true, 'Undefined', 'Trace', 'Calculating "Total Risk Score"')

define "Risk Percent":
  "Total Risk Score" totalRiskScore
    let riskScore: totalRiskScore as Integer
  return case
    when riskScore is null then null
    when riskScore = 0 then 1
    when riskScore = 1 then 1
    when riskScore = 2 then 2
    when riskScore = 3 then 2
    when riskScore = 4 then 3
    when riskScore = 5 then 9
    when riskScore = 6 then 15
    when riskScore = 7 then 18
    when riskScore = 8 then 22
    when riskScore = 9 then 26
    when riskScore = 10 then 29
    when riskScore = 11 then 34
    when riskScore = 12 then 38
    when riskScore = 13 then 47
    when riskScore = 14 then 48
    when riskScore = 15 then 50
    when riskScore = 16 then 55
    else 66
  end

define "Respiratory Rate Risk Score":
    Message(
  "Last Respiratory Rate value" respRate
    let value: Floor(Round(respRate))    // valid values should be Integer
  return case
    when value between 12 and 20 then 0
    when value between 9 and 11 then 1
    when value between 21 and 24 then 2
    when value < 9 then 3
    when value > 24 then 3
    else null
  end
    , true, 'Undefined', 'Trace', 'Calculating define "Respiratory Rate Risk Score"')

define "O2 Saturation Risk Score":
    Message(
  "Last O2 Saturation percent" o2Sat
    let value: Floor(Round(o2Sat))    // valid values should be Integer
  return case
    when value > 95 then 0
    when value between 94 and 95 then 1
    when value between 92 and 93 then 2
    when value < 92 then 3
    else null
  end
    , true, 'Undefined', 'Trace', 'Calculating define "O2 Saturation Risk Score"')

define "Heart Rate Risk Score":
    Message(
  "Last Heart Rate value" heartRate
    let value: Floor(Round(heartRate))    // valid values should be Integer
  return case
    when value between 51 and 90 then 0
    when value between 41 and 50 then 1
    when value between 91 and 110 then 1
    when value between 111 and 130 then 2
    when value < 41 then 3
    when value > 130 then 3
    else null
  end
    , true, 'Undefined', 'Trace', 'Calculating define "Heart Rate Risk Score"')

define "Systolic BP Risk Score":
    Message(
  "Last SBP value" bp
    let value: Floor(Round(bp))    // valid values should be Integer
  return case
    when value between 111 and 219 then 0
    when value between 101 and 110 then 1
    when value between 91 and 100 then 2
    when value < 91 then 3
    when value > 219 then 3
    else null
  end
    , true, 'Undefined', 'Trace', 'Calculating define "Systolic BP Risk Score"')

define "Temperature Risk Score":
    Message(
  case
    when "Last Body Temperature value in C" between 36.1 and 38.0 then 0
    when "Last Body Temperature value in C" between 35.1 and 36.0 then 1
    when "Last Body Temperature value in C" between 38.1 and 39.0 then 1
    when "Last Body Temperature value in C" > 39.0 then 2
    when "Last Body Temperature value in C" < 35.1 then 3
    else null
  end
    , true, 'Undefined', 'Trace', 'Calculating define "Temperature Risk Score"')

define "Sex Risk Score":
  if IgnoreFallbackResourceValues then
    case
      when PatientData.Gender = 'male' then 1
      when PatientData.Gender = 'female' then 0
      when PatientData.Gender = 'non-male' then 0
      else null
    end
  else
    case
      when "Patient Birth Sex" = 'M' then 1
      when "Patient Birth Sex" = 'F' then 0
      else null
    end

define "Age Risk Score":
  if IgnoreFallbackResourceValues then
    case
    when PatientData.Age between 16 and 49 then 0
    when PatientData.Age between 50 and 65 then 2
    when PatientData.Age between 66 and 80 then 3
    when PatientData.Age > 80 then 4
      else null
    end
  else
    case
      when AgeInYears() between 16 and 49 then 0
      when AgeInYears() between 50 and 65 then 2
      when AgeInYears() between 66 and 80 then 3
      when AgeInYears() > 80 then 4
      else null
    end

define "Alertness Score":
  case "Alertness Assessment Code"
    when CC."Confused".code then 3
    when CC."Alert".code then 0
    else null
  end

define "Performance Status Score":
  case "Performance Status Code"
    when CC."Performance Status 0".code then 0
    when CC."Performance Status 1".code then 1
    when CC."Performance Status 2".code then 2
    when CC."Performance Status 3".code then 3
    when CC."Performance Status 4".code then 4
    else null
  end

define "Inspired Oxygen Score":
  if "Has Supplemental Oxygen" then 2
  else if "Has Supplemental Oxygen" is false then 0
  else null

/*
 * Assess Risk Factors
 */

define "Risk Factor Components": List {
  "Has Bronchiectasis Risk Factor",
  "Has Bronchopulmonary Dysplasia Risk Factor",
  "Has Pulmonary Hypertension Risk Factor",
  "Has Pulmonary Embolism Risk Factor"
  "Has Cancer Risk Factor",
  "Has Cerebrovascular Disease Risk Factor",
  "Has Chronic Kidney Disease Risk Factor",
  "Has Chronic Liver Disease Risk Factor",
  "Has COPD Risk Factor",
  "Has Diabetes Mellitus Risk Factor",
  "Has Heart Conditions Risk Factor",
  "Has Interstitial Lung Disease Risk Factor",
  "Has Current And Former Smoking Risk Factor",
  "Has Tuberculosis Risk Factor",
  "Has Obesity Risk Factor",
  "Has Pregnancy And Recent Pregnancy Risk Factor",
  "Has Mental Health Disorders Risk Factor",
  "Has Children With Certain Underlying Conditions Risk Factor",
  "Has Down Syndrome Risk Factor",
  "Has HIV Risk Factor",
  "Has Neurologic Conditions Risk Factor",
  "Has Overweight Risk Factor",
  "Has Sickle Cell Disease Risk Factor",
  "Has Solid Organ Or Blood Stem Transplantation Risk Factor",
  "Has Substance Use Disorders Risk Factor",
  "Has Corticosteroids Usage Risk Factor",
  "Has Immunosuppressive Medications Risk Factor",
  "Has Cystic Fibrosis Risk Factor",
  "Has Thalassemia Risk Factor",
  "Has Asthma Risk Factor",
  "Has Hypertension Risk Factor",
  "Has Immune deficiencies Risk Factor"
}

/* The risk factors count is null if all components are null,
    otherwise returns the count of non-null risk factors.
*/
define "Risk Factors count":
  if "All Risk Factors Are Null" then null else
  allRiskFactors("All Active Conditions") 

define "All Risk Factors Are Null":
  if "Risk Factor Components" contains false
  or "Risk Factor Components" contains true then false
  else true

// Risk Factors

define function hasCancerRiskFactors(conditions List<Condition>):
  HasConditionWithOverride(
    (conditions C
          where (C.code in CC."Cancer SNOMED Codes"
          or C.code in CC."Cancer ICD10CM Codes")),
    RiskFactors.Cancer
  )

define function hasChronicKidneyDiseaseRiskFactors(conditions List<Condition>):
    HasConditionWithOverride(
        (conditions C
          where (C.code in CC."Kidney Disease SNOMED Codes"
            or C.code in CC."Kidney Disease ICD10CM Codes")),
        RiskFactors.ChronicKidneyDisease
    )

define function hasDiabetesMellitusRiskFactor(conditions List<Condition>):
  HasConditionWithOverride(
    (conditions C
      where (C.code in CC."Diabetes ICD10CM Codes"
        or C.code in CC."Diabetes SNOMED Codes")),
    RiskFactors.DiabetesMellitus
  )

define function hasDownSyndromeRiskFactor(conditions List<Condition>):
  HasConditionWithOverride(
      (conditions C
        where (C.code in CC."Downs Syndrome ICD10CM Codes"
          or C.code in CC."Downs Syndrome SNOMED Codes")),
      RiskFactors.DownSyndrome
  )

define function hasCorticosteroidsUsageRiskFactor(conditions List<Condition>):
  HasConditionWithOverride(
      (conditions C
        where (C.code in CC."Corticosteroids Usage ICD10CM Codes"
          or C.code in CC."Corticosteroids Usage SNOMED Codes")),
      RiskFactors.Corticosteroids
  )

define function hasImmunedeficienciesRiskFactor(conditions List<Condition>):
  HasConditionWithOverride(
      (conditions C
        where (C.code in CC."Immune Deficiencies ICD10CM Codes"
          or C.code in CC."Immune Deficiencies SNOMED Codes")),
      RiskFactors.ImmuneDeficiencies
  )

//----

// Ruturns the sum of all the risk factors
define function allRiskFactors(conditions List<Condition>):
(if "Has Bronchiectasis Risk Factor" then 1 else 0)
+(if "Has Bronchopulmonary Dysplasia Risk Factor" then 1 else 0)
+(if "Has Pulmonary Hypertension Risk Factor" then 1 else 0)
+(if "Has Pulmonary Embolism Risk Factor" then 1 else 0)
+(if hasCancerRiskFactors(conditions) then 1 else 0)
+(if "Has Cerebrovascular Disease Risk Factor" then 1 else 0)
+(if hasChronicKidneyDiseaseRiskFactors(conditions) then 1 else 0)
+(if "Has Chronic Liver Disease Risk Factor" then 1 else 0)
+(if "Has COPD Risk Factor" then 1 else 0)
+(if hasDiabetesMellitusRiskFactor(conditions) then 1 else 0)
+(if "Has Heart Conditions Risk Factor" then 1 else 0)
+(if "Has Interstitial Lung Disease Risk Factor" then 1 else 0)
+(if "Has Current And Former Smoking Risk Factor" then 1 else 0)
+(if "Has Tuberculosis Risk Factor" then 1 else 0)
+(if "Has Obesity Risk Factor" then 1 else 0)
+(if "Has Pregnancy And Recent Pregnancy Risk Factor" then 1 else 0)
+(if "Has Mental Health Disorders Risk Factor" then 1 else 0)
+(if "Has Children With Certain Underlying Conditions Risk Factor" then 1 else 0)
+(if hasDownSyndromeRiskFactor(conditions) then 1 else 0)
+(if "Has HIV Risk Factor" then 1 else 0)
+(if "Has Neurologic Conditions Risk Factor" then 1 else 0)
+(if "Has Overweight Risk Factor" then 1 else 0)
+(if "Has Sickle Cell Disease Risk Factor" then 1 else 0)
+(if "Has Solid Organ Or Blood Stem Transplantation Risk Factor" then 1 else 0)
+(if "Has Substance Use Disorders Risk Factor" then 1 else 0)
+(if hasCorticosteroidsUsageRiskFactor(conditions) then 1 else 0)
+(if "Has Immunosuppressive Medications Risk Factor" then 1 else 0)
+(if "Has Cystic Fibrosis Risk Factor" then 1 else 0)
+(if "Has Thalassemia Risk Factor" then 1 else 0)
+(if "Has Asthma Risk Factor" then 1 else 0)
+(if "Has Hypertension Risk Factor" then 1 else 0)
+(if hasImmunedeficienciesRiskFactor(conditions) then 1 else 0)

define "All Active Conditions":
  Message(C3F.ActiveOrRecurring([Condition]), true, 'Undefined', 'Trace', 'Calculating "All Active Conditions"')

define function DoesExistElseNull(CondList List<Condition>):
  if exists(CondList) then
    true
  else
    null

define function HasConditionWithOverride(
  CondList List<Condition>,
  OverridingValue Boolean
):
  if IgnoreFallbackResourceValues then OverridingValue
  else DoesExistElseNull(CondList)

// Define all the risk factors named expression
define "Has Bronchiectasis Risk Factor":
  RiskFactors.Bronchiectasis

define "Has Bronchopulmonary Dysplasia Risk Factor":
  RiskFactors.BronchopulmonaryDysplasia

define "Has Pulmonary Hypertension Risk Factor":
  RiskFactors.PulmonaryHypertension

define "Has Pulmonary Embolism Risk Factor":
  RiskFactors.PulmonaryEmbolism

define "Has Cancer Risk Factor":
  HasConditionWithOverride(
    ("All Active Conditions" C
          where (C.code in CC."Cancer SNOMED Codes"
            or C.code in CC."Cancer ICD10CM Codes")),
    RiskFactors.Cancer
  )

define "Has Cerebrovascular Disease Risk Factor":
  RiskFactors.CerebrovascularDisease

define "Has Chronic Kidney Disease Risk Factor":
  HasConditionWithOverride(
    ("All Active Conditions" C
      where (C.code in CC."Kidney Disease SNOMED Codes"
        or C.code in CC."Kidney Disease ICD10CM Codes")),
    RiskFactors.ChronicKidneyDisease
  )

define "Has Chronic Liver Disease Risk Factor":
  RiskFactors.ChronicLiverDisease

define "Has COPD Risk Factor":
  RiskFactors.COPD

define "Has Diabetes Mellitus Risk Factor":
HasConditionWithOverride(
  ("All Active Conditions" C
     where (C.code in CC."Diabetes ICD10CM Codes"
      or C.code in CC."Diabetes SNOMED Codes")),
  RiskFactors.DiabetesMellitus
)

define "Has Heart Conditions Risk Factor":
  RiskFactors.HeartConditions

define "Has Interstitial Lung Disease Risk Factor":
  RiskFactors.InterstitialLungDisease

define "Has Current And Former Smoking Risk Factor":
  RiskFactors.CurrentAndFormerSmoking


define "Has Tuberculosis Risk Factor":
  RiskFactors.Tuberculosis

define "Has Obesity Risk Factor":
  RiskFactors.Obesity

define "Has Pregnancy And Recent Pregnancy Risk Factor":
  RiskFactors.PregnancyAndRecentPregnancy


define "Has Mental Health Disorders Risk Factor":
  RiskFactors.MentalHealthDisorders

define "Has Children With Certain Underlying Conditions Risk Factor":
  RiskFactors.ChildrenWithCertainUnderlyingConditions

define "Has Down Syndrome Risk Factor":
HasConditionWithOverride(
  ("All Active Conditions" C
     where (C.code in CC."Downs Syndrome ICD10CM Codes"
      or C.code in CC."Downs Syndrome SNOMED Codes")),
  RiskFactors.DownSyndrome
)

define "Has HIV Risk Factor":
  RiskFactors.HIV

define "Has Neurologic Conditions Risk Factor":
  RiskFactors.NeurologicConditions

define "Has Overweight Risk Factor":
  RiskFactors.Overweight

define "Has Sickle Cell Disease Risk Factor":
  RiskFactors.SickleCellDisease

define "Has Solid Organ Or Blood Stem Transplantation Risk Factor":
  RiskFactors.SolidOrganOrBloodStemTransplantation

define "Has Substance Use Disorders Risk Factor":
  RiskFactors.SubstanceUseDisorders

define "Has Corticosteroids Usage Risk Factor":
HasConditionWithOverride(
  ("All Active Conditions" C
     where (C.code in CC."Corticosteroids Usage ICD10CM Codes"
      or C.code in CC."Corticosteroids Usage SNOMED Codes")),
  RiskFactors.Corticosteroids
)

define "Has Immunosuppressive Medications Risk Factor":
  RiskFactors.ImmunosuppressiveMedications

define "Has Cystic Fibrosis Risk Factor":
  RiskFactors.CysticFibrosis

define "Has Thalassemia Risk Factor":
  RiskFactors.Thalassemia

define "Has Asthma Risk Factor":
  RiskFactors.Asthma

define "Has Hypertension Risk Factor":
  RiskFactors.Hypertension


define "Has Immune deficiencies Risk Factor":
HasConditionWithOverride(
  ("All Active Conditions" C
     where (C.code in CC."Immune Deficiencies ICD10CM Codes"
      or C.code in CC."Immune Deficiencies SNOMED Codes")),
  RiskFactors.ImmuneDeficiencies
)

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

  define "Last PCT Lab Result":
  C3F.MostRecent(
    C3F.ObservationLookBack(
      C3F.Verified([Observation: CC."PCT Lab Results"]),
      LabResultsLookbackPeriod)
  )

define "Last Interleukin 1 Lab Result":
  C3F.MostRecent(
    C3F.ObservationLookBack(
      C3F.Verified([Observation: CC."Interleukin 1 Lab Results"]),
      LabResultsLookbackPeriod)
  )

define "Last Interleukin 6 Lab Result":
  C3F.MostRecent(
    C3F.ObservationLookBack(
      C3F.Verified([Observation: CC."Interleukin 6 Lab Results"]),
      LabResultsLookbackPeriod)
  )

define "Last Interleukin 8 Lab Result":
  C3F.MostRecent(
    C3F.ObservationLookBack(
      C3F.Verified([Observation: CC."Interleukin 8 Lab Results"]),
      LabResultsLookbackPeriod)
  )

define "Last Tumor Necrosis Factor Alpha Lab Result":
  C3F.MostRecent(
    C3F.ObservationLookBack(
      C3F.Verified([Observation: CC."Tumor Necrosis Factor Alpha Lab Results"]),
      LabResultsLookbackPeriod)
  )    
  
define "Last PaO2FiO2 Ratio Lab Result":
  C3F.MostRecent(
    C3F.ObservationLookBack(
      C3F.Verified([Observation: CC."PaO2FiO2 Ratio Lab Results"]),
      LabResultsLookbackPeriod)
  )

define "Last PaO2FiO2 Ratio Lab Result Less Than 300":
  Coalesce(ClinicalAssessments.PaO2FiO2RatioLessThan300,
    ("Last PaO2FiO2 Ratio Lab Result".value as FHIR.Quantity).value < 300
  )


define "Last LDH Lab Result":
  C3F.MostRecent(
    C3F.ObservationLookBack(
      C3F.Verified([Observation: CC."LDH Lab Results"]),
      LabResultsLookbackPeriod)
  )


