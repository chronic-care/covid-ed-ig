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

    test.each`
        chestXRayConcerning | ultrasoundConcerning | cTConcerning | expectedConcerningImagingCount
        ${true}             | ${false}             | ${false}     | ${1}
        ${true}             | ${true}              | ${false}     | ${2}
        ${true}             | ${true}              | ${true}      | ${3}
        ${true}             | ${false}             | ${true}      | ${2}
        ${false}            | ${false}             | ${true}      | ${1}
     
    `(`returns expectedConcerningImagingCount=$expectedConcerningImagingCount when values 
    are chestXRayConcerning=$chestXRayConcerning, ultrasoundConcerning=$ultrasoundConcerning, 
     cTConcerning=$cTConcerning`, ({ chestXRayConcerning, ultrasoundConcerning, cTConcerning, expectedConcerningImagingCount }) => {
        const cqlExpressionParameters = {
            IgnoreFallbackResourceValues: true,
            PatientData: undefined,
            RiskFactors: undefined,
            ClinicalAssessments: buildDefaultClinicalAssessmentParameters({
                ChestXRayConcerning: chestXRayConcerning,
                UltrasoundConcerning: ultrasoundConcerning,
                CTConcerning: cTConcerning
            }),
        };

        const CQLConcerningImagingCount = executeSummaryCQLExpression(cqlExpressionParameters, 'ConcerningImagingCount');

        expect(CQLConcerningImagingCount).toEqual(expectedConcerningImagingCount);
    });
});