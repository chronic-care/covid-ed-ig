import { buildDefaultClinicalAssessmentParameters } from "../helpers/builders";
import { executeSummaryCQLExpression } from "../helpers/cqlService";
import { ClinicalAssessmentsParameters } from "../types/parameter";

const mildPatientOverrides = {
    AnyMildCOVIDSymptoms: true,
    RespiratoryDiseaseSymptoms: false,
};

const moderatePatientOverrides = {
    O2Saturation: 94,
    RespiratoryDiseaseSymptoms: true,
    ConcerningLabCount: 1,
};

const severePatientOverrides = {
    O2Saturation: 90,
};

const criticalPatientOverrides = {
    RespiratoryFailure: true,
};

describe('treatment summary', () => {
    test.each([
          ['mild', 'use', mildPatientOverrides],
          ['moderate', 'use', moderatePatientOverrides],
          ['severe', 'use', severePatientOverrides],
          ['critical', 'use', criticalPatientOverrides],
          ['none', null, {}],
        ]
    )('For %p severity, Recommend Non-Pharmacologic Treatment is %p', (severityType: string, expectedRecommendation: string, clinicalAssessmentOverrides: Partial<ClinicalAssessmentsParameters>) => {
        const cqlExpressionParameters = {
            IgnoreFallbackResourceValues: true,
            PatientData: null,
            RiskFactors: null,
            ClinicalAssessments: buildDefaultClinicalAssessmentParameters(clinicalAssessmentOverrides),
        };
        const recommendNonPharma = executeSummaryCQLExpression(cqlExpressionParameters, 'Recommend Non-Pharmacologic Treatment');
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
        const cqlExpressionParameters = {
            IgnoreFallbackResourceValues: true,
            PatientData: null,
            RiskFactors: null,
            ClinicalAssessments: buildDefaultClinicalAssessmentParameters(clinicalAssessmentOverrides),
        };
        const recommendNonPharma = executeSummaryCQLExpression(cqlExpressionParameters, 'Recommend Antibodies Treatment');
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
        const cqlExpressionParameters = {
            IgnoreFallbackResourceValues: true,
            PatientData: null,
            RiskFactors: null,
            ClinicalAssessments: buildDefaultClinicalAssessmentParameters(clinicalAssessmentOverrides),
        };
        const recommendNonPharma = executeSummaryCQLExpression(cqlExpressionParameters, 'Recommend Anticoagulation Treatment');
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
        const cqlExpressionParameters = {
            IgnoreFallbackResourceValues: true,
            PatientData: null,
            RiskFactors: null,
            ClinicalAssessments: buildDefaultClinicalAssessmentParameters(clinicalAssessmentOverrides),
        };
        const recommendNonPharma = executeSummaryCQLExpression(cqlExpressionParameters, 'Recommend Steroids Treatment');
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
        const cqlExpressionParameters = {
            IgnoreFallbackResourceValues: true,
            PatientData: null,
            RiskFactors: null,
            ClinicalAssessments: buildDefaultClinicalAssessmentParameters(clinicalAssessmentOverrides),
        };
        const recommendNonPharma = executeSummaryCQLExpression(cqlExpressionParameters, 'Recommend Remdesivir Treatment');
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
        const cqlExpressionParameters = {
            IgnoreFallbackResourceValues: true,
            PatientData: null,
            RiskFactors: null,
            ClinicalAssessments: buildDefaultClinicalAssessmentParameters(clinicalAssessmentOverrides),
        };
        const recommendNonPharma = executeSummaryCQLExpression(cqlExpressionParameters, 'Recommend SteroidsAndOrRemdesivir Treatment');
        expect(recommendNonPharma).toEqual(expectedRecommendation);
    });


});