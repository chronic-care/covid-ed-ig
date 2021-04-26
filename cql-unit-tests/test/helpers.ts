import {
    ClinicalAssessmentsParameters,
    CQLExpressionParameters,
    RiskAssessmentScoreParameters
} from "../types/parameter";
import {buildDefaultClinicalAssessmentParameters} from "../helpers/builders";

export const mildPatientOverrides: Partial<ClinicalAssessmentsParameters> = {
    AnyMildCOVIDSymptoms: true,
    RespiratoryDiseaseSymptoms: false,
};
export const moderatePatientOverrides: Partial<ClinicalAssessmentsParameters> = {
    O2Saturation: 94,
    RespiratoryDiseaseSymptoms: true,
    ConcerningLabCount: 1,
};
export const severePatientOverrides: Partial<ClinicalAssessmentsParameters> = {
    O2Saturation: 90,
};
export const criticalPatientOverrides: Partial<ClinicalAssessmentsParameters> = {
    RespiratoryFailure: true,
};
export const obtainDiagnosticsClinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters> = mildPatientOverrides;
export const obtainDiagnosticsRiskAssessmentOverrides: Partial<RiskAssessmentScoreParameters> = {
    SteroidUsage: true,
    CardiovascularDisease: true,
}
export const dischargeHomeClinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters> = mildPatientOverrides;
export const considerDischargeHomeOverrides: Partial<ClinicalAssessmentsParameters> = {
    ...moderatePatientOverrides,
    ConcerningLabCount: 0,
    ChestXRayConcerning: false,
};
export const considerAdmissionClinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters> = {
    ...mildPatientOverrides,
    ConcerningLabCount: 1,
};
export const considerAdmissionRiskAssessmentOverrides: Partial<RiskAssessmentScoreParameters> = {
    Obesity: true,
    RenalDisease: true,
}
export const severeAdmissionClinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters> = severePatientOverrides;
export const criticalAdmissionClinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters> = criticalPatientOverrides;

export const buildCQLExpressionParameters = (clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>): CQLExpressionParameters => {
    return {
        IgnoreFallbackResourceValues: true,
        PatientData: null,
        RiskFactors: null,
        ClinicalAssessments: buildDefaultClinicalAssessmentParameters(clinicalAssessmentOverrides),
    };
};