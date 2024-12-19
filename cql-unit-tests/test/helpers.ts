import {
    ClinicalAssessmentsParameters,
    CQLExpressionParameters,
    RiskAssessmentScoreParameters
} from "../types/parameter";
import { buildDefaultClinicalAssessmentParameters, buildDefaultRiskAssessmentScoreParameters } from "../helpers/builders";

export const obtainDiagnosticsRiskAssessmentOverrides: Partial<RiskAssessmentScoreParameters> = {
    Corticosteroids: true,
    HeartConditions: true,
}
export const considerAdmissionRiskAssessmentOverrides: Partial<RiskAssessmentScoreParameters> = {
    Obesity: true,
    ChronicKidneyDisease: true,
}

export const riskFactorsCountOfOne: Partial<RiskAssessmentScoreParameters> = {
    HeartConditions: true,
}

export const riskFactorsCountOfTwo: Partial<RiskAssessmentScoreParameters> = {
    HeartConditions: true,
    DownSyndrome: true,
}
export const buildCQLExpressionParameters =
    (clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>, riskAssessmentOverrides?: Partial<RiskAssessmentScoreParameters> | {}):
        CQLExpressionParameters => {
    return {
        IgnoreFallbackResourceValues: true,
        PatientData: null,
        RiskFactors: buildDefaultRiskAssessmentScoreParameters(riskAssessmentOverrides),
        ClinicalAssessments: buildDefaultClinicalAssessmentParameters(clinicalAssessmentOverrides),
    };
};
