import { buildDefaultClinicalAssessmentParameters, buildDefaultRiskAssessmentScoreParameters } from "../helpers/builders";
import { executeSummaryCQLExpression } from "../helpers/cqlService";
import {
    ClinicalAssessmentsParameters,
    CQLExpressionParameters,
    RiskAssessmentScoreParameters
} from "../types/parameter";
import {
    buildCQLExpressionParameters,
    considerAdmissionClinicalAssessmentOverrides,
    considerAdmissionRiskAssessmentOverrides,
    considerDischargeHomeOverrides,
    criticalAdmissionClinicalAssessmentOverrides,
    criticalPatientOverrides,
    dischargeHomeClinicalAssessmentOverrides,
    mildPatientOverrides,
    moderatePatientOverrides,
    obtainDiagnosticsClinicalAssessmentOverrides,
    obtainDiagnosticsRiskAssessmentOverrides,
    severeAdmissionClinicalAssessmentOverrides,
    severePatientOverrides
} from "./helpers";

describe('treatment summary', () => {
    test.each([
        ['ObtainDiagnostics', false, obtainDiagnosticsClinicalAssessmentOverrides, obtainDiagnosticsRiskAssessmentOverrides],
        ['DischargeHome', true, dischargeHomeClinicalAssessmentOverrides, {}],
        ['ConsiderDischargeHome', true, considerDischargeHomeOverrides, {}],
        ['ConsiderAdmission', true, considerAdmissionClinicalAssessmentOverrides, considerAdmissionRiskAssessmentOverrides],
        ['SevereAdmission', true, severeAdmissionClinicalAssessmentOverrides, {}],
        ['CriticalAdmission', true, criticalAdmissionClinicalAssessmentOverrides, {}],
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
          ['mild', 'use', mildPatientOverrides],
          ['moderate', 'use', moderatePatientOverrides],
          ['severe', 'use', severePatientOverrides],
          ['critical', 'use', criticalPatientOverrides],
          ['none', null, {}],
        ]
    )('For %p severity, Recommend Non-Pharmacologic Treatment is %p', (severityType: string, expectedRecommendation: string, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>) => {
        const recommendNonPharma = executeSummaryCQLExpression(buildCQLExpressionParameters(clinicalAssessmentOverrides), 'Recommend Non-Pharmacologic Treatment');
        expect(recommendNonPharma).toEqual(expectedRecommendation);
    });

    test.each([
            ['mild', 'use', mildPatientOverrides],
            ['moderate', 'use', moderatePatientOverrides],
            ['severe', null, severePatientOverrides],
            ['critical', null, criticalPatientOverrides],
            ['none', null, {}],
        ]
    )('For %p severity, Recommend Antibodies Treatment is %p', (severityType: string, expectedRecommendation: string, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>) => {
        const recommendNonPharma = executeSummaryCQLExpression(buildCQLExpressionParameters(clinicalAssessmentOverrides), 'Recommend Antibodies Treatment');
        expect(recommendNonPharma).toEqual(expectedRecommendation);
    });

    test.each([
            ['mild', null, mildPatientOverrides],
            ['moderate', 'use', moderatePatientOverrides],
            ['severe', 'use', severePatientOverrides],
            ['critical', 'use', criticalPatientOverrides],
            ['none', null, {}],
        ]
    )('For %p severity, Recommend Anticoagulation Treatment is %p', (severityType: string, expectedRecommendation: string, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>) => {
        const recommendNonPharma = executeSummaryCQLExpression(buildCQLExpressionParameters(clinicalAssessmentOverrides), 'Recommend Anticoagulation Treatment');
        expect(recommendNonPharma).toEqual(expectedRecommendation);
    });

    test.each([
            ['mild', 'do-not-use', mildPatientOverrides],
            ['moderate', 'do-not-use', moderatePatientOverrides],
            ['severe', null, severePatientOverrides],
            ['critical', null, criticalPatientOverrides],
            ['none', null, {}],
        ]
    )('For %p severity, Recommend Steroids Treatment is %p', (severityType: string, expectedRecommendation: string, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>) => {
        const recommendNonPharma = executeSummaryCQLExpression(buildCQLExpressionParameters(clinicalAssessmentOverrides), 'Recommend Steroids Treatment');
        expect(recommendNonPharma).toEqual(expectedRecommendation);
    });

    test.each([
            ['mild', 'insufficient-evidence', mildPatientOverrides],
            ['moderate', 'use', moderatePatientOverrides],
            ['severe', null, severePatientOverrides],
            ['critical', null, criticalPatientOverrides],
            ['none', null, {}],
        ]
    )('For %p severity, Recommend Remdesivir Treatment is %p', (severityType: string, expectedRecommendation: string, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>) => {
        const recommendNonPharma = executeSummaryCQLExpression(buildCQLExpressionParameters(clinicalAssessmentOverrides), 'Recommend Remdesivir Treatment');
        expect(recommendNonPharma).toEqual(expectedRecommendation);
    });

    test.each([
            ['mild', null, mildPatientOverrides],
            ['moderate', null, moderatePatientOverrides],
            ['severe', 'use', severePatientOverrides],
            ['critical', 'use', criticalPatientOverrides],
            ['none', null, {}],
        ]
    )('For %p severity, Recommend SteroidsAndOrRemdesivir Treatment is %p', (severityType: string, expectedRecommendation: string, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>) => {
        const recommendNonPharma = executeSummaryCQLExpression(buildCQLExpressionParameters(clinicalAssessmentOverrides), 'Recommend SteroidsAndOrRemdesivir Treatment');
        expect(recommendNonPharma).toEqual(expectedRecommendation);
    });
});