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
        ['Recommend Admission Treatment'],
        ['Recommend Discharge Treatment'],
        ['Recommend Steroids Treatment']
        ])( '%p returns false when all inputs are null', (expressionName: string ) => {
        const cqlExpressionParameters = buildCQLExpressionParameters({}, buildAllNullRiskAssessmentScoreParameters());
        const recommendNonPharma = executeSummaryCQLExpression(cqlExpressionParameters, expressionName);
        expect(recommendNonPharma).toEqual(false);
    });

    it.each([
        ['Moderate', 'Discharge' , 1, new ClinicalAssessmentBuilder().withModerateSeverity().build()  ],
        ['Moderate', 'Admission', 2, new ClinicalAssessmentBuilder().withModerateSeverity().build() ],
        ['Severe', 'Admission', 1, new ClinicalAssessmentBuilder().withSevereSeverity().build() ],
        ['Severe',  'Discharge', 2 , new ClinicalAssessmentBuilder().withSevereSeverity().build() ]
        ])( 'For %p severity display order for %p is %p ', (expressionName: string, treatmentId: string, priorityOrder: number, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters> ) => {
        const cqlExpressionParameters = buildCQLExpressionParameters(clinicalAssessmentOverrides, buildAllNullRiskAssessmentScoreParameters());
        const treatmentSummaryList = executeSummaryCQLExpression(cqlExpressionParameters, 'TreatmentSummary');
        const treatment = treatmentSummaryList.filter((t) => t.TreatmentId === treatmentId);
        expect(treatment[0].PriorityOrder).toBe(priorityOrder);
    
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
          ['mild', true, new ClinicalAssessmentBuilder().withMildSeverity().build()],
          ['moderate', true, new ClinicalAssessmentBuilder().withConcerningLab(1).withMildSeverity().build()],
          ['severe', true, new ClinicalAssessmentBuilder().withSevereSeverity().build()],
          ['critical', true, new ClinicalAssessmentBuilder().withCriticalSeverity().build()],
          ['none', false, {}]
        ]
    )('For %p severity, %p is %p', (severityType: string, expectedRecommendation: string, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>) => {
        const cqlExpressionParameters = buildCQLExpressionParameters(clinicalAssessmentOverrides);
        const recommendNonPharma = executeSummaryCQLExpression(cqlExpressionParameters, 'Recommend Non-Pharmacologic Treatment');
        expect(recommendNonPharma).toEqual(expectedRecommendation);
    });

    it.each([
            ['mild', true, new ClinicalAssessmentBuilder().withMildSeverity().build()],
            ['moderate', true, new ClinicalAssessmentBuilder().withModerateSeverity().withConcerningLab(1).build()],
            ['severe', true, new ClinicalAssessmentBuilder().withSevereSeverity().build()],
            ['critical', false, new ClinicalAssessmentBuilder().withCriticalSeverity().build()],
            ['none', false, {}],
        ]
    )('For %p severity, Recommend DischargeHome Treatment is %p', (severityType: string, expectedRecommendation: string, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>) => {
        const cqlExpressionParameters = buildCQLExpressionParameters(clinicalAssessmentOverrides);
        const recommendNonPharma = executeSummaryCQLExpression(cqlExpressionParameters, 'Recommend Discharge Treatment');
        expect(recommendNonPharma).toEqual(expectedRecommendation);
    });

    it.each([
            ['mild', false, new ClinicalAssessmentBuilder().withMildSeverity().build()],
            ['moderate', true, new ClinicalAssessmentBuilder().withModerateSeverity().withConcerningLab(1).build()],
            ['severe', true, new ClinicalAssessmentBuilder().withSevereSeverity().build()],
            ['critical', true, new ClinicalAssessmentBuilder().withCriticalSeverity().build()],
            ['none', false, {}],
        ]
    )('For %p severity, Recommend Addmission Treatment is %p', (severityType: string, expectedRecommendation: string, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>) => {
        const cqlExpressionParameters = buildCQLExpressionParameters(clinicalAssessmentOverrides);
        const recommendNonPharma = executeSummaryCQLExpression(cqlExpressionParameters, 'Recommend Admission Treatment');
        expect(recommendNonPharma).toEqual(expectedRecommendation);
    });

    it.each([
            ['mild', true, new ClinicalAssessmentBuilder().withMildSeverity().build()],
            ['moderate', true, new ClinicalAssessmentBuilder().withModerateSeverity().withConcerningLab(1).build()],
            ['severe', false, new ClinicalAssessmentBuilder().withSevereSeverity().build()],
            ['critical', false, new ClinicalAssessmentBuilder().withCriticalSeverity().build()],
            ['none', false, {}],
        ]
    )('For %p severity, Recommend Steroids Treatment is %p', (severityType: string, expectedRecommendation: string, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>) => {
        const cqlExpressionParameters = buildCQLExpressionParameters(clinicalAssessmentOverrides);
        const recommendNonPharma = executeSummaryCQLExpression(cqlExpressionParameters, 'Recommend Steroids Treatment');
        expect(recommendNonPharma).toEqual(expectedRecommendation);
    });
});