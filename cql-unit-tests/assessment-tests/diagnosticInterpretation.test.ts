import { buildDefaultClinicalAssessmentParameters } from '../helpers/builders';
import { executeAssessmentCQLExpression, executeSummaryCQLExpression } from '../helpers/cqlService';

describe('diagnostic interpretation',() => {
    test.each`
        concerningLabCount | expectedConcerningLabCount
        ${1}               | ${1}
        ${null}            | ${0}
        ${5}               | ${5}
    `(`returns expectedConcerningLabCount=$expectedConcerningLabCount when values 
    are concerningLabCount=$concerningLabCount `, ({ concerningLabCount, expectedConcerningLabCount }) => {
        const cqlExpressionParameters = {
            IgnoreFallbackResourceValues: true,
            PatientData: undefined,
            RiskFactors: undefined,
            ClinicalAssessments: buildDefaultClinicalAssessmentParameters({
                ConcerningLabCount: concerningLabCount
            }),
        };

        const CQLConcerningLabCount = executeSummaryCQLExpression(cqlExpressionParameters, 'ConcerningLabCount');

        expect(CQLConcerningLabCount).toEqual(expectedConcerningLabCount);
    });

});