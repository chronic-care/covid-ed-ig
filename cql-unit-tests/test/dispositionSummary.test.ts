import { ClinicalAssessmentsParameters, RiskAssessmentScoreParameters } from "../types/parameter";
import { executeSummaryCQLExpression } from "../helpers/cqlService";
import { ClinicalAssessmentBuilder } from './builders/ClinicalAssessmentBuilder';
import { buildCQLExpressionParameters, riskFactorsCountOfTwo } from "./helpers";

describe('disposition summary', () => {
    test.each([
            ['mild and total risk score >= 5', true, new ClinicalAssessmentBuilder().withMildSeverity().withRiskScoreOfFive().build(), {}],
            ['mild and risk factors count > 1', true, new ClinicalAssessmentBuilder().withMildSeverity().build(), riskFactorsCountOfTwo],
            ['moderate', true, new ClinicalAssessmentBuilder().withModerateSeverity().build(), {}],
            ['severe', true, new ClinicalAssessmentBuilder().withSevereSeverity().build(), {}],
            ['critical', true, new ClinicalAssessmentBuilder().withCriticalSeverity().build(), {}],
            ['lab results count >= 1', false, new ClinicalAssessmentBuilder().withModerateSeverity().withConcerningLab(1).build(), {}],
            ['imaging result count >= 1', false, new ClinicalAssessmentBuilder().withConcerningImagingOfOne().build(), {}],
            ['mild and risk score not >= 5 or risk factors not >1', false, new ClinicalAssessmentBuilder().withMildSeverity().build(), {}],
        ]
    )('For %p, Recommend Obtain Diagnostics is %p', (title: string, expectedRecommendation: string, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>, riskAssessmentOverrides: Partial<RiskAssessmentScoreParameters>) => {
        const cqlExpressionParameters = buildCQLExpressionParameters(clinicalAssessmentOverrides, riskAssessmentOverrides);
        const recommendNonPharma = executeSummaryCQLExpression(cqlExpressionParameters, 'Recommend Obtain Diagnostics');
        expect(recommendNonPharma).toEqual(expectedRecommendation);
    });

    test.each([
            ['mild, total risk score <= 4, risk factor count <= 1, ConcerningLabsorImaging is false', true, new ClinicalAssessmentBuilder().withMildSeverity().build(), {}],
            ['severe', false, new ClinicalAssessmentBuilder().withSevereSeverity().build(), {}],
            ['mild, totalRiskScore 5', false, new ClinicalAssessmentBuilder().withMildSeverity().withRiskScoreOfFive(), {}],
            ['mild, riskFactorCount 2', false, new ClinicalAssessmentBuilder().withMildSeverity().build(), riskFactorsCountOfTwo],
            ['mild, ConcerningLab 1', false, new ClinicalAssessmentBuilder().withMildSeverity().withConcerningLab(1).build(), riskFactorsCountOfTwo],
            ['mild, ConcerningImaging 1', false, new ClinicalAssessmentBuilder().withMildSeverity().withConcerningImagingOfOne().build(), riskFactorsCountOfTwo],
        ]
    )('For %p, Recommend Discharge Home is %p', (title: string, expectedRecommendation: string, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>, riskAssessmentOverrides: Partial<RiskAssessmentScoreParameters>) => {
        const cqlExpressionParameters = buildCQLExpressionParameters(clinicalAssessmentOverrides, riskAssessmentOverrides);
        const recommendNonPharma = executeSummaryCQLExpression(cqlExpressionParameters, 'Recommend Discharge Home');
        expect(recommendNonPharma).toEqual(expectedRecommendation);
    });

    test.each([
            ['moderate', true, new ClinicalAssessmentBuilder().withModerateSeverity().withNoConcerningImaging().build(), {}],
            ['mild, total risk score <= 4, risk factor count <= 1, ConcerningLabsorImaging is false', false, new ClinicalAssessmentBuilder().withMildSeverity().build(), {}],
            ['moderate, totalRiskScore 5', false, new ClinicalAssessmentBuilder().withMildSeverity().withRiskScoreOfFive().build(), {}],
            ['moderate, riskFactorCount 2', false, new ClinicalAssessmentBuilder().withModerateSeverity(), riskFactorsCountOfTwo],
            ['moderate, ConcerningLab 1', false, new ClinicalAssessmentBuilder().withModerateSeverity().withConcerningLab(1), {}],
            ['moderate, ConcerningImaging 1', false, new ClinicalAssessmentBuilder().withModerateSeverity().withConcerningImagingOfOne(), {}],
        ]
    )('For %p, Recommend Consider Discharging Home is %p', (title: string, expectedRecommendation: string, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>, riskAssessmentOverrides: Partial<RiskAssessmentScoreParameters>) => {
        const cqlExpressionParameters = buildCQLExpressionParameters(clinicalAssessmentOverrides, riskAssessmentOverrides);
        const recommendNonPharma = executeSummaryCQLExpression(cqlExpressionParameters, 'Recommend Consider Discharging Home');
        expect(recommendNonPharma).toEqual(expectedRecommendation);
    });

    test.each([
            ['mild, concerning lab, LabResultCount >= 1', true, new ClinicalAssessmentBuilder().withMildSeverity().withConcerningLab(1).build(), {}],
            ['mild, Total Risk Score > 4, ImagingResultCount >= 1', true, new ClinicalAssessmentBuilder().withMildSeverity().withRiskScoreOfFive().withNoConcerningImaging().build(), {}],
            ['mild, Risk Factors Count > 1, ImagingResultCount >= 1', true, new ClinicalAssessmentBuilder().withMildSeverity().withNoConcerningImaging().build(), riskFactorsCountOfTwo],
            ['moderate, concerning lab, LabResultCount >= 1', true, new ClinicalAssessmentBuilder().withModerateSeverity().withConcerningLab(1).build(), {}],
            ['moderate, Total Risk Score > 4, ImagingResultCount >= 1', true, new ClinicalAssessmentBuilder().withModerateSeverity().withRiskScoreOfFive().withNoConcerningImaging().build(), {}],
            ['moderate, Risk Factors Count > 1, ImagingResultCount >= 1', true, new ClinicalAssessmentBuilder().withModerateSeverity().withNoConcerningImaging().build(), riskFactorsCountOfTwo],
            ['severe', false, new ClinicalAssessmentBuilder().withSevereSeverity().build(), {}],
            ['critical', false, new ClinicalAssessmentBuilder().withCriticalSeverity().build(), {}],
            ['mild, no concerning labs/imaging, Risk Score <= 4, Risk Factors Count <= 1', false, new ClinicalAssessmentBuilder().withMildSeverity().withNoConcerningLabOrImaging(), {}],
            ['moderate, no concerning labs/imaging, Risk Score <= 4, Risk Factors Count <= 1', false, new ClinicalAssessmentBuilder().withModerateSeverity().withNoConcerningLabOrImaging(), {}],
        ]
    )('For %p, Recommend Consider Admission is %p', (title: string, expectedRecommendation: string, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>, riskAssessmentOverrides: Partial<RiskAssessmentScoreParameters>) => {
        const cqlExpressionParameters = buildCQLExpressionParameters(clinicalAssessmentOverrides, riskAssessmentOverrides);
        const recommendNonPharma = executeSummaryCQLExpression(cqlExpressionParameters, 'Recommend Consider Admission');
        expect(recommendNonPharma).toEqual(expectedRecommendation);
    });

    test.each([
            ['severe severity', true, new ClinicalAssessmentBuilder().withSevereSeverity().build()],
            ['mild severity', false, new ClinicalAssessmentBuilder().withMildSeverity().build()],
            ['moderate severity', false, new ClinicalAssessmentBuilder().withModerateSeverity().build()],
            ['critical severity', false, new ClinicalAssessmentBuilder().withCriticalSeverity().build()],
        ]
    )('For %p, Recommend Severe Admission is %p', (title: string, expectedRecommendation: string, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>) => {
        const cqlExpressionParameters = buildCQLExpressionParameters(clinicalAssessmentOverrides);
        const recommendNonPharma = executeSummaryCQLExpression(cqlExpressionParameters, 'Recommend Severe Admission');
        expect(recommendNonPharma).toEqual(expectedRecommendation);
    });

    test.each([
            ['critical severity', true, new ClinicalAssessmentBuilder().withCriticalSeverity().build()],
            ['mild severity', false, new ClinicalAssessmentBuilder().withMildSeverity().build()],
            ['moderate severity', false, new ClinicalAssessmentBuilder().withModerateSeverity().build()],
            ['severe severity', false, new ClinicalAssessmentBuilder().withSevereSeverity().build()],
        ]
    )('For %p, Recommend Critical Admission is %p', (title: string, expectedRecommendation: string, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>) => {
        const cqlExpressionParameters = buildCQLExpressionParameters(clinicalAssessmentOverrides);
        const recommendNonPharma = executeSummaryCQLExpression(cqlExpressionParameters, 'Recommend Critical Admission');
        expect(recommendNonPharma).toEqual(expectedRecommendation);
    });
});
