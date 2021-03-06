// # Introduction

// ACEP Emergency Department COVID-19 Management Tool

library COVID19EmergencyDeptSummary version '1.0.0'

// # Data model #

using FHIR version '4.0.1'

// # Referenced libraries #

// Logic for the ACEP Emergency Department COVID-19 Management Tool
include COVID19EmergencyDeptAssessment version '1.0.0' called C19
// The CDS Connect Commons library provides functions representing commonly used CDS logic and patterns.
include CDSConnectCommons version '1.0.3' called C3F
// The FHIRHelpers library provides common functions for simplifying interaction w/ the FHIR R4 data model.
include FHIRHelpers version '4.0.1'

context Patient

// The Summary objects represent the COVID-19 assessments and risk scores to be displayed to the clinician.  All values are
// returned as user-friendly text representations.

define PatientSummary: {
  Name: PatientName,
  Gender: Patient.gender.value,
  BirthSex: C19."Patient Birth Sex",
  Age: AgeInYears(),
  Race: C19."Patient Race Text"
}

define RiskSummary: {
  SeverityClassification: C19."Severity Classification",
  RiskScore: C19."Total Risk Score",
  RiskPercent: C19."Risk Percent",
  RiskFactorCount: C19."Risk Factors count",
  ConcerningLabCount: ConcerningLabCount
}

define SmartPhrases: {
  // TODO
}

define RecommendationSummary: {

}

define AssessmentSummary: {
  RespiratoryRate: C19."Last Respiratory Rate value",
  O2Saturation: C19."Last O2 Saturation percent",
  HeartRate: C19."Last Heart Rate value",
  BloodPressure: Last(C19."Blood Pressure Observations").Display,
  SystolicBloodPressure: C19."Last SBP value",
  TemperatureC: C19."Last Body Temperature value in C",
  TemperatureF: C19."Last Body Temperature value in F",
  Alertness: null,
  InspiredOxygen: null,
  PerformanceStatus: null
}

define RiskFactorSummary: {
  Cancer: C19."Has Cancer Risk Factor",
  CardiovascularDisease: C19."Has Cardiovascular Disease Risk Factor",
  ChronicRespiratoryDisease: C19."Has Chronic Respiratory Disease Risk Factor",
  DiabetesType2: C19."Has Diabetes Type 2 Risk Factor",
  DownsSyndrome: C19."Has Downs Syndrome Risk Factor",
  Hypertension: C19."Has Hypertension Risk Factor",
  Immunosuppression: C19."Has Immunosuppression Risk Factor",
  NeurologicDisease: C19."Has Neurologic Disease Risk Factor",
  Obesity: C19."Has Obesity Risk Factor",
  ObstructiveSleepApnea: C19."Has Obstructive Sleep Apnea Risk Factor",
  Pregnancy: C19."Has Pregnancy Risk Factor",
  RenalDisease: C19."Has Renal Disease Risk Factor",
  SteroidUsage: C19."Has Steroid Usage Risk Factor"
}

define DiagnosticSummary: {
  ALT: ReportLabObservation(C19."Last ALT Lab Result"),
  AST: ReportLabObservation(C19."Last AST Lab Result"),
  Creatinine: ReportLabObservation(C19."Last Creatinine Lab Result"),
  CRP: ReportLabObservation(C19."Last CRP Lab Result"),
  DDimer: ReportLabObservation(C19."Last D-dimer Lab Result"),
  Ferritin: ReportLabObservation(C19."Last Ferritin Lab Result"),
  LDH: ReportLabObservation(C19."Last LDH Lab Result"),
  Lymphopenia: ReportLabObservation(C19."Last Lymphocytes Lab Result"),
  Neutrophils: ReportLabObservation(C19."Last Neutrophils Lab Result"),
  Thrombocytopenia: ReportLabObservation(C19."Last Platelets Lab Result"),
  Troponin: ReportLabObservation(C19."Last Troponin Lab Result"),
  WBC: ReportLabObservation(C19."Last Leukocyte Lab Result"),

  // Not included in count of concerning labs; used for severity classification.
  PaO2FiO2: ReportLabObservation(C19."Last PaO2FiO2 Ratio Lab Result")
}

define LabResultList: {
  DiagnosticSummary.ALT,
  DiagnosticSummary.AST,
  DiagnosticSummary.Creatinine,
  DiagnosticSummary.CRP,
  DiagnosticSummary.DDimer,
  DiagnosticSummary.Ferritin,
  DiagnosticSummary.LDH,
  DiagnosticSummary.Lymphopenia,
  DiagnosticSummary.Neutrophils,
  DiagnosticSummary.Thrombocytopenia,
  DiagnosticSummary.Troponin,
  DiagnosticSummary.WBC
}

define ConcerningLabCount:
  Count(LabResultList result where result.Flag is true)

/*
define TrendData: {
  RespiratoryRate: ReportObservations(C19."Respiratory Rate Observations"),
  O2Saturation: ReportObservations(C19."O2 Saturation Observations"),
  HeartRate: ReportObservations(C19."Heart Rate Observations"),
  BloodPressure: C19."Blood Pressure Observations",
  Temperature: C19."Body Temperature Observations"    // TODO convert all to degF
}
*/

/*
 * Helper functions for summary reporting.
*/

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

define PatientName:
  Coalesce(Patient.name[0].text.value,
    (Combine(Patient.name.given G return G.value, ' ') + ' ' + Combine(Patient.name.family F return F.value, ' '))
  )

// Returns a list of observation view Tuples.
define function ReportObservations(ObsList List<Observation>):
  ObsList o
    return {   // result decimal value
      Date:   ToString(C3F.FindDate(o)),
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
      Date:   ToString(C3F.FindDate(o)),
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
      ToString(LabReferenceRangeLow(o)) + ' - ' + ToString(LabReferenceRangeHigh(o))
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
