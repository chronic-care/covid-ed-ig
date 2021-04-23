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
});