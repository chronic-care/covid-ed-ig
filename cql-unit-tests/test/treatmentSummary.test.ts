import { executeSummaryCQLExpression } from "../helpers/cqlService";
import { ClinicalAssessmentsParameters, RiskAssessmentScoreParameters } from "../types/parameter";
import {
    buildCQLExpressionParameters,
    considerAdmissionRiskAssessmentOverrides,
    obtainDiagnosticsRiskAssessmentOverrides
} from "./helpers";
import { ClinicalAssessmentBuilder } from './builders/ClinicalAssessmentBuilder';
import { buildAllNullRiskAssessmentScoreParameters } from '../helpers/builders';

describe('treatment summary', () => {
    it.each([
        ['Recommend Non-Pharmacologic Treatment'],
        ['Recommend Antibodies Treatment'],
        ['Recommend Anticoagulation Treatment'],
        ['Recommend Steroids Treatment'],
        ['Recommend Remdesivir Treatment'],
        ['Recommend SteroidsAndOrRemdesivir Treatment'],
        ])( '%p returns null when all inputs are null', (expressionName: string ) => {
        const cqlExpressionParameters = buildCQLExpressionParameters({}, buildAllNullRiskAssessmentScoreParameters());
        const recommendNonPharma = executeSummaryCQLExpression(cqlExpressionParameters, expressionName);
        expect(recommendNonPharma).toEqual(null);
    })

    it.each([
        ['ObtainDiagnostics', false, new ClinicalAssessmentBuilder().withModerateSeverity().build(), obtainDiagnosticsRiskAssessmentOverrides],
        ['DischargeHome', true, new ClinicalAssessmentBuilder().withMildSeverity().build(), {}],
        ['ConsiderDischargeHome', true, new ClinicalAssessmentBuilder().withModerateSeverity().withNoConcerningLabOrImaging().build(), {}],
        ['DischargeHomeElevatedRisk', true, new ClinicalAssessmentBuilder().withMildSeverity().withRiskScoreOfFive().withNoConcerningImaging().build(), {}],
        ['ConsiderAdmission', true, new ClinicalAssessmentBuilder().withMildSeverity().withConcerningLab(1).build(), considerAdmissionRiskAssessmentOverrides],
        ['SevereAdmission', true, new ClinicalAssessmentBuilder().withSevereSeverity().build(), {}],
        ['CriticalAdmission', true, new ClinicalAssessmentBuilder().withCriticalSeverity().build(), {}],
        ['none', false, {}, {}],
    ])('For %p disposition, HasAdmissionOrDischargeRecommendation is %p',
        (disposition: string, expectedRecommendation: boolean, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>, riskAssessmentOverrides: Partial<RiskAssessmentScoreParameters>) => {
            const cqlExpressionParameters = buildCQLExpressionParameters(clinicalAssessmentOverrides, riskAssessmentOverrides);
            const hasAdmissionsOrDischargeRecommendation = executeSummaryCQLExpression(cqlExpressionParameters, 'HasAdmissionOrDischargeRecommendation');
            expect(hasAdmissionsOrDischargeRecommendation).toEqual(expectedRecommendation);
    });

    it.each([
          ['mild', 'use', new ClinicalAssessmentBuilder().withMildSeverity().build()],
          ['moderate', 'use', new ClinicalAssessmentBuilder().withConcerningLab(1).withMildSeverity().build()],
          ['severe', 'use', new ClinicalAssessmentBuilder().withSevereSeverity().build()],
          ['critical', 'use', new ClinicalAssessmentBuilder().withCriticalSeverity().build()],
          ['none', null, {}],
        ]
    )('For %p severity, Recommend Non-Pharmacologic Treatment is %p', (severityType: string, expectedRecommendation: string, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>) => {
        const cqlExpressionParameters = buildCQLExpressionParameters(clinicalAssessmentOverrides);
        const recommendNonPharma = executeSummaryCQLExpression(cqlExpressionParameters, 'Recommend Non-Pharmacologic Treatment');
        expect(recommendNonPharma).toEqual(expectedRecommendation);
    });

    it.each([
            ['mild', 'use', new ClinicalAssessmentBuilder().withMildSeverity().build()],
            ['moderate', 'use', new ClinicalAssessmentBuilder().withModerateSeverity().withConcerningLab(1).build()],
            ['severe', null, new ClinicalAssessmentBuilder().withSevereSeverity().build()],
            ['critical', null, new ClinicalAssessmentBuilder().withCriticalSeverity().build()],
            ['none', null, {}],
        ]
    )('For %p severity, Recommend Antibodies Treatment is %p', (severityType: string, expectedRecommendation: string, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>) => {
        const cqlExpressionParameters = buildCQLExpressionParameters(clinicalAssessmentOverrides);
        const recommendNonPharma = executeSummaryCQLExpression(cqlExpressionParameters, 'Recommend Antibodies Treatment');
        expect(recommendNonPharma).toEqual(expectedRecommendation);
    });

    it.each([
            ['mild', null, new ClinicalAssessmentBuilder().withMildSeverity().build()],
            ['moderate', 'use', new ClinicalAssessmentBuilder().withModerateSeverity().withConcerningLab(1).build()],
            ['severe', 'use', new ClinicalAssessmentBuilder().withSevereSeverity().build()],
            ['critical', 'use', new ClinicalAssessmentBuilder().withCriticalSeverity().build()],
            ['none', null, {}],
        ]
    )('For %p severity, Recommend Anticoagulation Treatment is %p', (severityType: string, expectedRecommendation: string, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>) => {
        const cqlExpressionParameters = buildCQLExpressionParameters(clinicalAssessmentOverrides);
        const recommendNonPharma = executeSummaryCQLExpression(cqlExpressionParameters, 'Recommend Anticoagulation Treatment');
        expect(recommendNonPharma).toEqual(expectedRecommendation);
    });

    it.each([
            ['mild', 'do-not-use', new ClinicalAssessmentBuilder().withMildSeverity().build()],
            ['moderate', 'do-not-use', new ClinicalAssessmentBuilder().withModerateSeverity().withConcerningLab(1).build()],
            ['severe', null, new ClinicalAssessmentBuilder().withSevereSeverity().build()],
            ['critical', null, new ClinicalAssessmentBuilder().withCriticalSeverity().build()],
            ['none', null, {}],
        ]
    )('For %p severity, Recommend Steroids Treatment is %p', (severityType: string, expectedRecommendation: string, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>) => {
        const cqlExpressionParameters = buildCQLExpressionParameters(clinicalAssessmentOverrides);
        const recommendNonPharma = executeSummaryCQLExpression(cqlExpressionParameters, 'Recommend Steroids Treatment');
        expect(recommendNonPharma).toEqual(expectedRecommendation);
    });

    it.each([
            ['mild', 'insufficient-evidence', new ClinicalAssessmentBuilder().withMildSeverity().build()],
            ['moderate', 'insufficient-evidence', new ClinicalAssessmentBuilder().withModerateSeverity().withConcerningLab(1).build()],
            ['severe', null, new ClinicalAssessmentBuilder().withSevereSeverity().build()],
            ['critical', null, new ClinicalAssessmentBuilder().withCriticalSeverity().build()],
            ['none', null, {}],
        ]
    )('For %p severity, Recommend Remdesivir Treatment is %p', (severityType: string, expectedRecommendation: string, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>) => {
        const cqlExpressionParameters = buildCQLExpressionParameters(clinicalAssessmentOverrides);
        const recommendNonPharma = executeSummaryCQLExpression(cqlExpressionParameters, 'Recommend Remdesivir Treatment');
        expect(recommendNonPharma).toEqual(expectedRecommendation);
    });

    it.each([
            ['mild', null, new ClinicalAssessmentBuilder().withMildSeverity().build()],
            ['moderate', null, new ClinicalAssessmentBuilder().withModerateSeverity().build()],
            ['severe', 'use', new ClinicalAssessmentBuilder().withSevereSeverity().build()],
            ['critical', 'use', new ClinicalAssessmentBuilder().withCriticalSeverity().build()],
            ['none', null, {}],
        ]
    )('For %p severity, Recommend SteroidsAndOrRemdesivir Treatment is %p', (severityType: string, expectedRecommendation: string, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>) => {
        const cqlExpressionParameters = buildCQLExpressionParameters(clinicalAssessmentOverrides);
        const recommendNonPharma = executeSummaryCQLExpression(cqlExpressionParameters, 'Recommend SteroidsAndOrRemdesivir Treatment');
        expect(recommendNonPharma).toEqual(expectedRecommendation);
    });
});