import { ClinicalAssessmentsParameters, RiskAssessmentScoreParameters } from "../types/parameter";
import { executeSummaryCQLExpression } from "../helpers/cqlService";
import {
    buildDefaultClinicalAssessmentParameters,
    buildDefaultRiskAssessmentScoreParameters
} from "../helpers/builders";
import { ClinicalAssessmentBuilder } from './builders/ClinicalAssessmentBuilder';

const mildObtainDiagnosticsRiskFactorsCount: Partial<RiskAssessmentScoreParameters> = {
    CardiovascularDisease: true,
    DownsSyndrome: true,
}

describe('disposition summary', () => {
    test.each([
            ['mild and total risk score >= 5', true, new ClinicalAssessmentBuilder().withMildSeverity().withRiskScoreOfFive().build(), {}],
            ['mild and risk factors count > 1', true, new ClinicalAssessmentBuilder().withMildSeverity().build(), mildObtainDiagnosticsRiskFactorsCount],
            ['moderate', true, new ClinicalAssessmentBuilder().withModerateSeverity().build(), {}],
            ['severe', true, new ClinicalAssessmentBuilder().withSevereSeverity().build(), {}],
            ['critical', true, new ClinicalAssessmentBuilder().withCriticalSeverity().build(), {}],
            ['lab results count >= 1', false, new ClinicalAssessmentBuilder().withModerateSeverity().withConcerningLab(1).build(), {}],
            ['imaging result count >= 1', false, new ClinicalAssessmentBuilder().withConcerningImagingOfOne().build(), {}],
            ['mild and risk score not >= 5 or risk factors not >1', false, new ClinicalAssessmentBuilder().withMildSeverity().build(), {}],
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

    test.each([
            ['mild, total risk score <= 4, risk factor count <= 1, ConcerningLabsorImaging is false', true, new ClinicalAssessmentBuilder().withMildSeverity().build(), {}],
            ['severe', false, new ClinicalAssessmentBuilder().withSevereSeverity().build(), {}],
            ['mild, totalRiskScore 5', false, new ClinicalAssessmentBuilder().withMildSeverity().withRiskScoreOfFive(), {}],
            ['mild, riskFactorCount 2', false, new ClinicalAssessmentBuilder().withMildSeverity().build(), mildObtainDiagnosticsRiskFactorsCount],
            ['mild, ConcerningLab 1', false, new ClinicalAssessmentBuilder().withMildSeverity().withConcerningLab(1).build(), mildObtainDiagnosticsRiskFactorsCount],
            ['mild, ConcerningImaging 1', false, new ClinicalAssessmentBuilder().withMildSeverity().withConcerningImagingOfOne().build(), mildObtainDiagnosticsRiskFactorsCount],
        ]
    )('For %p, Recommend Discharge Home is %p', (title: string, expectedRecommendation: string, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>, riskAssessmentOverrides: Partial<RiskAssessmentScoreParameters>) => {
        const cqlExpressionParameters = {
            IgnoreFallbackResourceValues: true,
            PatientData: null,
            RiskFactors: buildDefaultRiskAssessmentScoreParameters(riskAssessmentOverrides),
            ClinicalAssessments: buildDefaultClinicalAssessmentParameters(clinicalAssessmentOverrides),
        };
        const recommendNonPharma = executeSummaryCQLExpression(cqlExpressionParameters, 'Recommend Discharge Home');
        expect(recommendNonPharma).toEqual(expectedRecommendation);
    });

    test.each([
            ['moderate', true, new ClinicalAssessmentBuilder().withModerateSeverity().withNoConcerningImaging().build(), {}],
            ['mild, total risk score <= 4, risk factor count <= 1, ConcerningLabsorImaging is false', false, new ClinicalAssessmentBuilder().withMildSeverity().build(), {}],
            ['moderate, totalRiskScore 5', false, new ClinicalAssessmentBuilder().withMildSeverity().withRiskScoreOfFive().build(), {}],
            // ['mild, riskFactorCount 2', false, mildPatientOverrides, mildObtainDiagnosticsRiskFactorsCount],
            // ['mild, ConcerningLab 1', false, {...mildPatientOverrides, ConcerningLabCount: 1}, mildObtainDiagnosticsRiskFactorsCount],
            // ['mild, ConcerningImaging 1', false, {...mildPatientOverrides, ChestXRayConcerning: true}, mildObtainDiagnosticsRiskFactorsCount],
        ]
    )('For %p, Recommend Consider Discharging Home is %p', (title: string, expectedRecommendation: string, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>, riskAssessmentOverrides: Partial<RiskAssessmentScoreParameters>) => {
        const cqlExpressionParameters = {
            IgnoreFallbackResourceValues: true,
            PatientData: null,
            RiskFactors: buildDefaultRiskAssessmentScoreParameters(riskAssessmentOverrides),
            ClinicalAssessments: buildDefaultClinicalAssessmentParameters(clinicalAssessmentOverrides),
        };
        const recommendNonPharma = executeSummaryCQLExpression(cqlExpressionParameters, 'Recommend Consider Discharging Home');
        expect(recommendNonPharma).toEqual(expectedRecommendation);
    });
});