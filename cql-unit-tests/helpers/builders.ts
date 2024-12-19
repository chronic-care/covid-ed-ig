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
      Bronchiectasis: false,
      BronchopulmonaryDysplasia: false,
      PulmonaryHypertension: false,
      PulmonaryEmbolism: false,
      Cancer: false,
      CerebrovascularDisease: false,
      ChronicKidneyDisease: false,
      ChronicLiverDisease: false,
      COPD: false,
      DiabetesMellitus: false,
      HeartConditions: false,
      InterstitialLungDisease: false,
      CurrentAndFormerSmoking: false,
      Tuberculosis: false,
      Obesity: false,
      PregnancyAndRecentPregnancy: false,
      MentalHealthDisorders: false,
      ChildrenWithCertainUnderlyingConditions: false,
      DownSyndrome: false,
      HIV: false,
      NeurologicConditions: false,
      Overweight: false,
      SickleCellDisease: false,
      SolidOrganOrBloodStemTransplantation: false,
      SubstanceUseDisorders: false,
      Corticosteroids: false,
      ImmunosuppressiveMedications: false,
      CysticFibrosis: false,
      Thalassemia: false,
      Asthma: false,
      Hypertension: false,
      ImmuneDeficiencies: false
    };

    return buildWithOverrides(riskAssessmentScoreParameters, overrides);
};

export const buildAllNullRiskAssessmentScoreParameters = (): RiskAssessmentScoreParameters => {
    const riskAssessmentScoreParameters: RiskAssessmentScoreParameters = {
      Bronchiectasis: null,
      BronchopulmonaryDysplasia: null,
      PulmonaryHypertension: null,
      PulmonaryEmbolism: null,
      Cancer: null,
      CerebrovascularDisease: null,
      ChronicKidneyDisease: null,
      ChronicLiverDisease: null,
      COPD: null,
      DiabetesMellitus: null,
      HeartConditions: null,
      InterstitialLungDisease: null,
      CurrentAndFormerSmoking: null,
      Tuberculosis: null,
      Obesity: null,
      PregnancyAndRecentPregnancy: null,
      MentalHealthDisorders: null,
      ChildrenWithCertainUnderlyingConditions: null,
      DownSyndrome: null,
      HIV: null,
      NeurologicConditions: null,
      Overweight: null,
      SickleCellDisease: null,
      SolidOrganOrBloodStemTransplantation: null,
      SubstanceUseDisorders: null,
      Corticosteroids: null,
      ImmunosuppressiveMedications: null,
      CysticFibrosis: null,
      Thalassemia: null,
      Asthma: null,
      Hypertension: null,
      ImmuneDeficiencies: null
    };

    return buildWithOverrides(riskAssessmentScoreParameters, {});
};
