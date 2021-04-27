import {
    ClinicalAssessmentsParameters,
    CQLExpressionParameters,
    RiskAssessmentScoreParameters
} from "../types/parameter";
import { buildDefaultClinicalAssessmentParameters, buildDefaultRiskAssessmentScoreParameters } from "../helpers/builders";

export const obtainDiagnosticsRiskAssessmentOverrides: Partial<RiskAssessmentScoreParameters> = {
    SteroidUsage: true,
    CardiovascularDisease: true,
}
export const considerAdmissionRiskAssessmentOverrides: Partial<RiskAssessmentScoreParameters> = {
    Obesity: true,
    RenalDisease: true,
}
export const riskFactorsCountOfTwo: Partial<RiskAssessmentScoreParameters> = {
    CardiovascularDisease: true,
    DownsSyndrome: true,
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