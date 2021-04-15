import { buildDefaultClinicalAssessmentParameters } from '../helpers/builders';
import { executeAssessmentCQLExpression } from '../helpers/cqlService';

describe('risk score with parameter overrides', () => {
    test.each`
        respiratoryRate | expectedScore
        ${12}           | ${0}
        ${20}           | ${0}
        ${null}         | ${0}
        ${9}            | ${1}
        ${11}           | ${1}
        ${21}           | ${2}
        ${24}           | ${2}
        ${8}            | ${3}
        ${25}           | ${3}
    `('returns score of $expectedScore for respiratory rate value of $respiratoryRate', ({
        respiratoryRate, expectedScore
    }) => {

        const cqlExpressionParameters = {
            IgnoreFallbackResourceValues: true,
            PatientData: undefined,
            RiskFactors: undefined,
            ClinicalAssessments: buildDefaultClinicalAssessmentParameters({RespiratoryRate: respiratoryRate}),
        };

        const respiratoryRateScore = executeAssessmentCQLExpression(cqlExpressionParameters, 'Respiratory Rate Risk Score');

        expect(respiratoryRateScore).toEqual(expectedScore);
    });

    test.each`
        heartRate | expectedScore
        ${51}     | ${0}
        ${90}     | ${0}
        ${null}   | ${0}
        ${41}     | ${1}
        ${50}     | ${1}
        ${91}     | ${1}
        ${110}    | ${1}
        ${111}    | ${2}
        ${130}    | ${2}
        ${40}     | ${3}
        ${131}    | ${3}
    `('returns score of $expectedScore for heart rate value of $heartRate', ({
        heartRate, expectedScore
    }) => {

        const cqlExpressionParameters = {
            IgnoreFallbackResourceValues: true,
            PatientData: undefined,
            RiskFactors: undefined,
            ClinicalAssessments: buildDefaultClinicalAssessmentParameters({HeartRate: heartRate}),
        };

        const heartRateScore = executeAssessmentCQLExpression(cqlExpressionParameters, 'Heart Rate Risk Score');

        expect(heartRateScore).toEqual(expectedScore);
    });
});