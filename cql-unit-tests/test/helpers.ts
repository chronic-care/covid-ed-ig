import {
    ClinicalAssessmentsParameters,
    CQLExpressionParameters,
    RiskAssessmentScoreParameters
} from "../types/parameter";
import { buildDefaultClinicalAssessmentParameters } from "../helpers/builders";


export const obtainDiagnosticsRiskAssessmentOverrides: Partial<RiskAssessmentScoreParameters> = {
    SteroidUsage: true,
    CardiovascularDisease: true,
}

export const considerAdmissionRiskAssessmentOverrides: Partial<RiskAssessmentScoreParameters> = {
    Obesity: true,
    RenalDisease: true,
}
export const buildCQLExpressionParameters = (clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>): CQLExpressionParameters => {
    return {
        IgnoreFallbackResourceValues: true,
        PatientData: null,
        RiskFactors: null,
        ClinicalAssessments: buildDefaultClinicalAssessmentParameters(clinicalAssessmentOverrides),
    };
};