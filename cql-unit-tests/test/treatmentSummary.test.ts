import {buildDefaultClinicalAssessmentParameters, buildDefaultRiskAssessmentScoreParameters} from "../helpers/builders";
import { executeSummaryCQLExpression } from "../helpers/cqlService";
import {
    ClinicalAssessmentsParameters,
    CQLExpressionParameters,
    RiskAssessmentScoreParameters
} from "../types/parameter";

const mildPatientOverrides: Partial<ClinicalAssessmentsParameters> = {
    AnyMildCOVIDSymptoms: true,
    RespiratoryDiseaseSymptoms: false,
};

const moderatePatientOverrides: Partial<ClinicalAssessmentsParameters> = {
    O2Saturation: 94,
    RespiratoryDiseaseSymptoms: true,
    ConcerningLabCount: 1,
};

const severePatientOverrides: Partial<ClinicalAssessmentsParameters> = {
    O2Saturation: 90,
};

const criticalPatientOverrides: Partial<ClinicalAssessmentsParameters> = {
    RespiratoryFailure: true,
};


const obtainDiagnosticsOverrides: Partial<ClinicalAssessmentsParameters> = mildPatientOverrides;
const obtainDiagnosticsRiskAssessmentOverrides: Partial<RiskAssessmentScoreParameters> = {
    SteroidUsage: true,
    CardiovascularDisease: true,
}
const dischargeHomeOverrides: Partial<ClinicalAssessmentsParameters> = mildPatientOverrides;
const considerDischargeHomeOverrides: Partial<ClinicalAssessmentsParameters> = {
    O2Saturation: 94,
    RespiratoryDiseaseSymptoms: true,
    ConcerningLabCount: 0,
    ChestXRayConcerning: false,
};
const considerAdmissionOverrides: Partial<ClinicalAssessmentsParameters> = {
    AnyMildCOVIDSymptoms: true,
    RespiratoryDiseaseSymptoms: false,
    ConcerningLabCount: 1,
};
const considerAdmissionRiskAssessmentOverrides: Partial<RiskAssessmentScoreParameters> = {
    Obesity: true,
    RenalDisease: true,
}
const severeAdmissionOverrides: Partial<ClinicalAssessmentsParameters> = severePatientOverrides;
const criticalAdmissionOverrides: Partial<ClinicalAssessmentsParameters> = criticalPatientOverrides;

const buildCQLExpressionParameters = (clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>): CQLExpressionParameters => {
   return {
        IgnoreFallbackResourceValues: true,
        PatientData: null,
        RiskFactors: null,
        ClinicalAssessments: buildDefaultClinicalAssessmentParameters(clinicalAssessmentOverrides),
    };
};

describe('treatment summary', () => {
    test.each([
        ['ObtainDiagnostics', false, obtainDiagnosticsOverrides, obtainDiagnosticsRiskAssessmentOverrides],
        ['DischargeHome', true, dischargeHomeOverrides, {}],
        ['ConsiderDischargeHome', true, considerDischargeHomeOverrides, {}],
        ['ConsiderAdmission', true, considerAdmissionOverrides, considerAdmissionRiskAssessmentOverrides],
        ['SevereAdmission', true, severeAdmissionOverrides, {}],
        ['CriticalAdmission', true, criticalAdmissionOverrides, {}],
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