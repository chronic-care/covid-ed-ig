import { ClinicalAssessmentsParameters, PatientDataParameters, RiskAssessmentScoreParameters } from "../types/parameter";

export const buildWithOverrides = <T>(defaultObject: T, overrides: Partial<T>): T => Object.assign(defaultObject, overrides);

export const buildDefaultClinicalAssessmentParameters = (overrides: Partial<ClinicalAssessmentsParameters> = {}): ClinicalAssessmentsParameters => {
    const clinicalAssessmentsParameters: ClinicalAssessmentsParameters = {
        AnyMildCOVIDSymptoms: null,
        Alertness: null,
        CTConcerning: null,
        ChestXRayConcerning: null,
        HeartRate: null,
        SupplementalOxygen: null,
        LungInfiltratesOver50: null,
        MultiorganDysfunction: null,
        O2Saturation: null,
        PaO2FiO2Ratio: null,
        PerformanceStatus: null,
        RespiratoryDiseaseImagingEvidence: null,
        RespiratoryDiseaseSymptoms: null,
        RespiratoryFailure: null,
        RespiratoryRate: null,
        SepticShock: null,
        SystolicBloodPressure: null,
        TemperatureF: null,
        UltrasoundConcerning: null,
        ConcerningLabCount: null,
    };
    return buildWithOverrides(clinicalAssessmentsParameters, overrides);
};

export const buildDefaultPatientDataParameters = (overrides: Partial<PatientDataParameters> = {}): PatientDataParameters => {
    const patientDataParameters: PatientDataParameters = {
        Gender: null,
        Age: null,
    };

    return buildWithOverrides(patientDataParameters, overrides);
};

export const buildDefaultRiskAssessmentScoreParameters = (overrides: Partial<RiskAssessmentScoreParameters> = {}): RiskAssessmentScoreParameters => {
    const riskAssessmentScoreParameters: RiskAssessmentScoreParameters = {
        Cancer: false,
        CardiovascularDisease: false,
        ChronicRespiratoryDisease: false,
        DiabetesType2: false,
        DownsSyndrome: false,
        Hypertension: false,
        Immunosuppression: false,
        NeurologicDisease: false,
        Obesity: false,
        ObstructiveSleepApnea: false,
        Pregnancy: false,
        RenalDisease: false,
        SteroidUsage: false,
    };

    return buildWithOverrides(riskAssessmentScoreParameters, overrides);
};

export const buildAllNullRiskAssessmentScoreParameters = (): RiskAssessmentScoreParameters => {
    const riskAssessmentScoreParameters: RiskAssessmentScoreParameters = {
        Cancer: null,
        CardiovascularDisease: null,
        ChronicRespiratoryDisease: null,
        DiabetesType2: null,
        DownsSyndrome: null,
        Hypertension: null,
        Immunosuppression: null,
        NeurologicDisease: null,
        Obesity: null,
        ObstructiveSleepApnea: null,
        Pregnancy: null,
        RenalDisease: null,
        SteroidUsage: null,
    };

    return buildWithOverrides(riskAssessmentScoreParameters, {});
};