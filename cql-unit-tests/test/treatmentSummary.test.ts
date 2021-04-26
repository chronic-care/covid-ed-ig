import {
    buildDefaultClinicalAssessmentParameters,
    buildDefaultRiskAssessmentScoreParameters
} from "../helpers/builders";
import { executeSummaryCQLExpression } from "../helpers/cqlService";
import { ClinicalAssessmentsParameters, RiskAssessmentScoreParameters } from "../types/parameter";
import {
    buildCQLExpressionParameters,
    considerAdmissionRiskAssessmentOverrides,
    obtainDiagnosticsRiskAssessmentOverrides
} from "./helpers";
import { ClinicalAssessmentBuilder } from './builders/ClinicalAssessmentBuilder';

describe('treatment summary', () => {
    test.each([
        ['ObtainDiagnostics', false, new ClinicalAssessmentBuilder().withMildSeverity().build(), obtainDiagnosticsRiskAssessmentOverrides],
        ['DischargeHome', true, new ClinicalAssessmentBuilder().withMildSeverity().build(), {}],
        ['ConsiderDischargeHome', true, new ClinicalAssessmentBuilder().withModerateSeverity().withNoConcerningLabOrImaging().build(), {}],
        ['ConsiderAdmission', true, new ClinicalAssessmentBuilder().withMildSeverity().withConcerningLab(1).build(), considerAdmissionRiskAssessmentOverrides],
        ['SevereAdmission', true, new ClinicalAssessmentBuilder().withSevereSeverity().build(), {}],
        ['CriticalAdmission', true, new ClinicalAssessmentBuilder().withCriticalSeverity().build(), {}],
        ['none', false, {}, {}],
    ])('For %p disposition, HasAdmissionOrDischargeRecommendation is %p',
        (disposition: string, expectedRecommendation: string, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>, riskAssessmentOverrides: Partial<RiskAssessmentScoreParameters>) => {
        const cqlExpressionParameters = {
            IgnoreFallbackResourceValues: true,
            PatientData: null,
            RiskFactors: buildDefaultRiskAssessmentScoreParameters(riskAssessmentOverrides),
            ClinicalAssessments: buildDefaultClinicalAssessmentParameters(clinicalAssessmentOverrides),
        };
        const hasAdmissionsOrDischargeRecommendation = executeSummaryCQLExpression(cqlExpressionParameters, 'HasAdmissionOrDischargeRecommendation');
        expect(hasAdmissionsOrDischargeRecommendation).toEqual(expectedRecommendation);
    });

    test.each([
          ['mild', 'use', new ClinicalAssessmentBuilder().withMildSeverity().build()],
          ['moderate', 'use', new ClinicalAssessmentBuilder().withConcerningLab(1).withMildSeverity().build()],
          ['severe', 'use', new ClinicalAssessmentBuilder().withSevereSeverity().build()],
          ['critical', 'use', new ClinicalAssessmentBuilder().withCriticalSeverity().build()],
          ['none', null, {}],
        ]
    )('For %p severity, Recommend Non-Pharmacologic Treatment is %p', (severityType: string, expectedRecommendation: string, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>) => {
        const recommendNonPharma = executeSummaryCQLExpression(buildCQLExpressionParameters(clinicalAssessmentOverrides), 'Recommend Non-Pharmacologic Treatment');
        expect(recommendNonPharma).toEqual(expectedRecommendation);
    });

    test.each([
            ['mild', 'use', new ClinicalAssessmentBuilder().withMildSeverity().build()],
            ['moderate', 'use', new ClinicalAssessmentBuilder().withModerateSeverity().withConcerningLab(1).build()],
            ['severe', null, new ClinicalAssessmentBuilder().withSevereSeverity().build()],
            ['critical', null, new ClinicalAssessmentBuilder().withCriticalSeverity().build()],
            ['none', null, {}],
        ]
    )('For %p severity, Recommend Antibodies Treatment is %p', (severityType: string, expectedRecommendation: string, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>) => {
        const recommendNonPharma = executeSummaryCQLExpression(buildCQLExpressionParameters(clinicalAssessmentOverrides), 'Recommend Antibodies Treatment');
        expect(recommendNonPharma).toEqual(expectedRecommendation);
    });

    test.each([
            ['mild', null, new ClinicalAssessmentBuilder().withMildSeverity().build()],
            ['moderate', 'use', new ClinicalAssessmentBuilder().withModerateSeverity().withConcerningLab(1).build()],
            ['severe', 'use', new ClinicalAssessmentBuilder().withSevereSeverity().build()],
            ['critical', 'use', new ClinicalAssessmentBuilder().withCriticalSeverity().build()],
            ['none', null, {}],
        ]
    )('For %p severity, Recommend Anticoagulation Treatment is %p', (severityType: string, expectedRecommendation: string, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>) => {
        const recommendNonPharma = executeSummaryCQLExpression(buildCQLExpressionParameters(clinicalAssessmentOverrides), 'Recommend Anticoagulation Treatment');
        expect(recommendNonPharma).toEqual(expectedRecommendation);
    });

    test.each([
            ['mild', 'do-not-use', new ClinicalAssessmentBuilder().withMildSeverity().build()],
            ['moderate', 'do-not-use', new ClinicalAssessmentBuilder().withModerateSeverity().withConcerningLab(1).build()],
            ['severe', null, new ClinicalAssessmentBuilder().withSevereSeverity().build()],
            ['critical', null, new ClinicalAssessmentBuilder().withCriticalSeverity().build()],
            ['none', null, {}],
        ]
    )('For %p severity, Recommend Steroids Treatment is %p', (severityType: string, expectedRecommendation: string, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>) => {
        const recommendNonPharma = executeSummaryCQLExpression(buildCQLExpressionParameters(clinicalAssessmentOverrides), 'Recommend Steroids Treatment');
        expect(recommendNonPharma).toEqual(expectedRecommendation);
    });

    test.each([
            ['mild', 'insufficient-evidence', new ClinicalAssessmentBuilder().withMildSeverity().build()],
            ['moderate', 'use', new ClinicalAssessmentBuilder().withModerateSeverity().withConcerningLab(1).build()],
            ['severe', null, new ClinicalAssessmentBuilder().withSevereSeverity().build()],
            ['critical', null, new ClinicalAssessmentBuilder().withCriticalSeverity().build()],
            ['none', null, {}],
        ]
    )('For %p severity, Recommend Remdesivir Treatment is %p', (severityType: string, expectedRecommendation: string, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>) => {
        const recommendNonPharma = executeSummaryCQLExpression(buildCQLExpressionParameters(clinicalAssessmentOverrides), 'Recommend Remdesivir Treatment');
        expect(recommendNonPharma).toEqual(expectedRecommendation);
    });

    test.each([
            ['mild', null, new ClinicalAssessmentBuilder().withMildSeverity().build()],
            ['moderate', null, new ClinicalAssessmentBuilder().withModerateSeverity().build()],
            ['severe', 'use', new ClinicalAssessmentBuilder().withSevereSeverity().build()],
            ['critical', 'use', new ClinicalAssessmentBuilder().withCriticalSeverity().build()],
            ['none', null, {}],
        ]
    )('For %p severity, Recommend SteroidsAndOrRemdesivir Treatment is %p', (severityType: string, expectedRecommendation: string, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>) => {
        const recommendNonPharma = executeSummaryCQLExpression(buildCQLExpressionParameters(clinicalAssessmentOverrides), 'Recommend SteroidsAndOrRemdesivir Treatment');
        expect(recommendNonPharma).toEqual(expectedRecommendation);
    });
});