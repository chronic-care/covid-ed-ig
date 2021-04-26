import {
    criticalPatientOverrides,
    mildPatientOverrides,
    moderatePatientOverrides, moderatePatientOverridesWithNonObtainDiagnosticsRecommendation,
    severePatientOverrides
} from "./helpers";
import { ClinicalAssessmentsParameters, RiskAssessmentScoreParameters } from "../types/parameter";
import { executeSummaryCQLExpression } from "../helpers/cqlService";
import { buildDefaultClinicalAssessmentParameters, buildDefaultRiskAssessmentScoreParameters } from "../helpers/builders";

const mildObtainDiagnosticsWithTotalRiskScore: Partial<ClinicalAssessmentsParameters> = {
    ...mildPatientOverrides,
    RespiratoryRate: 25,
    O2Saturation: 92,
}
const mildObtainDiagnosticsRiskFactorsCount: Partial<RiskAssessmentScoreParameters> = {
    CardiovascularDisease: true,
    DownsSyndrome: true,
}
const imagingResultsGreaterThanOne: Partial<ClinicalAssessmentsParameters> = {
    ChestXRayConcerning: true,
}

describe('disposition summary', () => {
    test.each([
            ['mild and total risk score >= 5', true, mildObtainDiagnosticsWithTotalRiskScore, {}],
            ['mild and risk factors count > 1', true, mildPatientOverrides, mildObtainDiagnosticsRiskFactorsCount],
            ['moderate', true, moderatePatientOverrides, {}],
            ['severe', true, severePatientOverrides, {}],
            ['critical', true, criticalPatientOverrides, {}],
            ['lab results count >= 1', false, moderatePatientOverridesWithNonObtainDiagnosticsRecommendation, {}],
            ['imaging result count >= 1', false, imagingResultsGreaterThanOne, {}],
            ['mild and risk score not >= 5 or risk factors not >1', false, mildPatientOverrides, {}],
        ]
    )('For %p, Recommend Obtain Diagnostics is %p', (title: string, expectedRecommendation: string, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>, riskAssessmentOverrides: Partial<RiskAssessmentScoreParameters>) => {
        const cqlExpressionParameters = {
            IgnoreFallbackResourceValues: true,
            PatientData: null,
            RiskFactors: buildDefaultRiskAssessmentScoreParameters(riskAssessmentOverrides),
            ClinicalAssessments: buildDefaultClinicalAssessmentParameters(clinicalAssessmentOverrides),
        };
        const recommendNonPharma = executeSummaryCQLExpression(cqlExpressionParameters, 'Recommend Obtain Diagnostics');
        expect(recommendNonPharma).toEqual(expectedRecommendation);
    });
});