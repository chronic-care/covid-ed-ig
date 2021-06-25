export interface RiskAssessmentScoreParameters {
    Cancer: boolean,
    CardiovascularDisease: boolean,
    ChronicRespiratoryDisease: boolean,
    DiabetesType2: boolean,
    DownsSyndrome: boolean,
    Hypertension: boolean,
    Immunosuppression: boolean,
    NeurologicDisease: boolean,
    Obesity: boolean,
    ObstructiveSleepApnea: boolean,
    Pregnancy: boolean,
    RenalDisease: boolean,
    SteroidUsage: boolean,
}

export interface ClinicalAssessmentsParameters {
    AnyMildCOVIDSymptoms: boolean | null,
    RespiratoryRate: number | null,
    O2Saturation: number | null,
    HeartRate: number | null,
    SystolicBloodPressure: number | null,
    TemperatureF: number | null,
    Alertness: string | null,
    SupplementalOxygen: boolean | null,
    PerformanceStatus: string | null,
    RespiratoryDiseaseSymptoms: boolean | null,
    ChestXRayConcerning: boolean | null,
    UltrasoundConcerning: boolean | null,
    CTConcerning: boolean | null,
    LungInfiltratesOver50: boolean | null,
    RespiratoryDiseaseImagingEvidence: boolean | null,
    PaO2FiO2RatioLessThan300: boolean | null,
    RespiratoryFailure: boolean | null,
    SepticShock: boolean | null,
    MultiorganDysfunction: boolean | null,
    ConcerningLabCount: number | null,
}

export interface PatientDataParameters {
    Gender: string | null,
    Age: number | null,
}

export interface PatientRecommendationCalculationParameters {
    clinicalAssessmentParameters: ClinicalAssessmentsParameters,
    patientDataParameters: PatientDataParameters,
    riskAssessmentScoreParameters: RiskAssessmentScoreParameters,
}

export interface CQLExpressionParameters {
    ClinicalAssessments: ClinicalAssessmentsParameters | null,
    PatientData: PatientDataParameters | null,
    RiskFactors: RiskAssessmentScoreParameters | null,
    IgnoreFallbackResourceValues: boolean | null,
}