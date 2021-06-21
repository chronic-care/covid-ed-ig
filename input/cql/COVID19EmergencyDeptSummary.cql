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
  DiagnosticInterpretation: DiagnosticInterpretation,
  ConcerningLabCount: ConcerningLabCount,
  ConcerningImagingCount: ConcerningImagingCount
}

define SmartPhrases: {
  Severity: 'Based on the criteria present at the time of evaluation, the patient was determined to have ' + RiskSummary.SeverityClassification + ' Severity.',
  RiskPrognostication: 'Based on a PRIEST Score of ' + ToString(RiskSummary.RiskScore) + ' the patient is estimated to have a ' + ToString(RiskSummary.RiskPercent) + '% risk.',
  RiskAssessment: case RiskSummary.RiskFactorCount
    when null then null
    when 0 then 'Patient did not have any additional risk factors based on those included within this tool.'
    when 1 then 'Patient was noted to have an additional risk factor.'
    else 'Patient was noted to have 2 (or more) additional risk factors.'
    end
}

define DispositionSummary: {
  ObtainDiagnostics: "Recommend Obtain Diagnostics",
  DischargeHome: "Recommend Discharge Home",
  DischargeHomeElevatedRisk: "Recommend Discharge Home Elevated Risk",
  ConsiderAdmission: "Recommend Consider Admission",
  ConsiderDischargingHome: "Recommend Consider Discharging Home",
  SevereAdmission: "Recommend Severe Admission",
  CriticalAdmission: "Recommend Critical Admission"
}

// Value: use, do-not-use, insufficient-evidence, null
define TreatmentSummary: {
  NonPharmacologic: "Recommend Non-Pharmacologic Treatment",
  Antibodies: "Recommend Antibodies Treatment",
  Anticoagulation: "Recommend Anticoagulation Treatment",
  Remdesivir: "Recommend Remdesivir Treatment",
  Steroids: "Recommend Steroids Treatment",
  SteroidsAndOrRemdesivir: "Recommend SteroidsAndOrRemdesivir Treatment"
}

define AssessmentSummary: {
  RespiratoryRate: C19."Last Respiratory Rate value",
  O2Saturation: C19."Last O2 Saturation percent",
  HeartRate: C19."Last Heart Rate value",
  BloodPressure: Last(C19."Blood Pressure Observations").Display,
  SystolicBloodPressure: C19."Last SBP value",
  TemperatureC: C19."Last Body Temperature value in C",
  TemperatureF: C19."Last Body Temperature value in F",
  SupplementalOxygen: C19.ClinicalAssessments.SupplementalOxygen,
  Alertness: C19."Alertness Assessment Code",
  PerformanceStatus: C19."Performance Status Code"
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

define ImagingResultList: {
  C19.ClinicalAssessments.ChestXRayConcerning,
  C19.ClinicalAssessments.UltrasoundConcerning,
  C19.ClinicalAssessments.CTConcerning
}

define LabResultCount:
  if (C19.ClinicalAssessments.ConcerningLabCount is not null and C19.ClinicalAssessments.ConcerningLabCount = 0) then 1
  else if (C19.ClinicalAssessments.ConcerningLabCount is not null) then C19.ClinicalAssessments.ConcerningLabCount
  /* else if not exists LabResultList then null */
  else Count(LabResultList result where result is not null)

define ImagingResultCount:
  /* if not exists ImagingResultList then null
  else  */
  Count(ImagingResultList result where result is not null)

// TODO Always returns count of 0 or 1 in Javascript engine... Bug?
/*
define ConcerningImagingCount:
  Count(ImagingResultList result where result is true)
*/

define ConcerningImagingCount:
  /* if not exists ImagingResultList then null
  else */
  (if C19.ClinicalAssessments.ChestXRayConcerning is true then 1 else 0)
    + (if C19.ClinicalAssessments.UltrasoundConcerning is true then 1 else 0)
    + (if C19.ClinicalAssessments.CTConcerning is true then 1 else 0)

define ConcerningLabCount:
  /* if (not exists LabResultList and C19.ClinicalAssessments.ConcerningLabCount is null) then null
  else */
  Coalesce(
    C19.ClinicalAssessments.ConcerningLabCount,
    Count(LabResultList result where result.Flag is true)
  )

define ConcerningLabsOrImaging:
  ConcerningLabCount >= 1 or ConcerningImagingCount >= 1

define DiagnosticInterpretation:
    ConcerningLabCount + ConcerningImagingCount

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
 * Disposition Recommendations
 */

define "Recommend Obtain Diagnostics":
  if (LabResultCount < 1 and ImagingResultCount < 1)
    and ((C19."Is Mild Severity" and (C19."Total Risk Score" >= 5 or C19."Risk Factors count" > 1))
        or (C19."Is Moderate Severity" or C19."Is Severe Severity" or C19."Is Critical Severity"))
  then true
  else false

define "Recommend Discharge Home":
  if C19."Is Mild Severity"
    and C19."Total Risk Score" <= 4
    and C19."Risk Factors count" <= 1
    and ConcerningLabsOrImaging is false
  then true
  else false

define "Recommend Discharge Home Elevated Risk":
  if C19."Is Mild Severity"
    and (C19."Total Risk Score" > 4
        or C19."Risk Factors count" > 1)
    and ConcerningLabsOrImaging is false
  then true
  else false

define "Recommend Consider Discharging Home":
  if C19."Is Moderate Severity"
    and C19."Total Risk Score" <= 4
    and C19."Risk Factors count" <= 1
    and ConcerningLabsOrImaging is false
    and (LabResultCount >= 1 or ImagingResultCount >= 1)
  then true
  else false

define "Recommend Consider Admission":
  if (C19."Is Mild Severity"
      and ConcerningLabsOrImaging is true
      and (LabResultCount >= 1 or ImagingResultCount >= 1)
    )
    or (C19."Is Moderate Severity"
        and (ConcerningLabsOrImaging is true
            or C19."Total Risk Score" > 4
            or C19."Risk Factors count" > 1)
        and (LabResultCount >= 1 or ImagingResultCount >= 1)
      )
  then true
  else false

define "Recommend Severe Admission":
  C19."Is Severe Severity"

define "Recommend Critical Admission":
  C19."Is Critical Severity"

/*
 * Treatment Recommendations
 */
// TODO is there a better CQL syntax for enum literals, e.g. for each code in a ValueSet?
// Value: use, do-not-use, insufficient-evidence, null

// DispositionSummary includes a recommendation, other than ObtainDiagnostics.
define HasAdmissionOrDischargeRecommendation:
  DispositionSummary.ConsiderAdmission or DispositionSummary.SevereAdmission or DispositionSummary.CriticalAdmission
  or DispositionSummary.DischargeHome or DispositionSummary.ConsiderDischargingHome or DispositionSummary.DischargeHomeElevatedRisk

define "Recommend Non-Pharmacologic Treatment":
  if HasAdmissionOrDischargeRecommendation is false then null
  else 'use'

define "Recommend Antibodies Treatment":
  if HasAdmissionOrDischargeRecommendation is false then null
  else if (C19."Is Mild Severity" or C19."Is Moderate Severity") then 'use'
  else null

define "Recommend Anticoagulation Treatment":
  if HasAdmissionOrDischargeRecommendation is false then null
  else if (C19."Is Moderate Severity" or C19."Is Severe Severity" or C19."Is Critical Severity") then 'use'
  else null

define "Recommend Steroids Treatment":
  if HasAdmissionOrDischargeRecommendation is false then null
  else if (C19."Is Mild Severity" or C19."Is Moderate Severity") then 'do-not-use'
  else null

define "Recommend Remdesivir Treatment":
  if HasAdmissionOrDischargeRecommendation is false then null
  else if C19."Is Mild Severity" or C19."Is Moderate Severity" then 'insufficient-evidence'
  else null

define "Recommend SteroidsAndOrRemdesivir Treatment":
  if HasAdmissionOrDischargeRecommendation is false then null
  else if (C19."Is Severe Severity" or C19."Is Critical Severity") then 'use'
  else null

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
  if (o is null or o.value is null or o.value.value is null) then null
  else
    {
      Date:   ToString(C3F.FindDate(o)),
      Name:   ConceptText(o.code),                                // display nanme
      ResultText: QuantityText(o.value as FHIR.Quantity),         // result value with units
      ResultValue: System.Quantity { value: (o.value as FHIR.Quantity).value}.value,
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
