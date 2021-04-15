import { buildDefaultClinicalAssessmentParameters, buildDefaultPatientDataParameters } from '../helpers/builders';
import { executeAssessmentCQLExpression } from '../helpers/cqlService';

describe('risk score with parameter overrides', () => {
    test.each`
        respiratoryRate | expectedScore
        ${12}           | ${0}
        ${20}           | ${0}
        ${null}         | ${0}
        ${9}            | ${1}
        ${10.5}         | ${1}
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
        o2SaturationRate | expectedScore
        ${96}            | ${0}
        ${null}          | ${0}
        ${94}            | ${1}
        ${95}            | ${1}
        ${92}            | ${2}
        ${93}            | ${2}
        ${91}            | ${3}
    `('returns score of $expectedScore for O2 saturation rate value of $o2SaturationRate', ({
        o2SaturationRate, expectedScore
    }) => {
        const cqlExpressionParameters = {
            IgnoreFallbackResourceValues: true,
            PatientData: undefined,
            RiskFactors: undefined,
            ClinicalAssessments: buildDefaultClinicalAssessmentParameters({O2Saturation: o2SaturationRate}),
        };

        const saturationRateScore = executeAssessmentCQLExpression(cqlExpressionParameters, 'O2 Saturation Risk Score');

        expect(saturationRateScore).toEqual(expectedScore);
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

    test.each`
        systolicBloodPressure | expectedScore
        ${111}                | ${0}
        ${219}                | ${0}
        ${null}               | ${0}
        ${101}                | ${1}
        ${110}                | ${1}
        ${91}                 | ${2}
        ${100}                | ${2}
        ${90}                 | ${3}
        ${220}                | ${3}
    `('returns score of $expectedScore for systolic blood pressure value of $systolicBloodPressure', ({
        systolicBloodPressure, expectedScore
    }) => {
        const cqlExpressionParameters = {
            IgnoreFallbackResourceValues: true,
            PatientData: undefined,
            RiskFactors: undefined,
            ClinicalAssessments: buildDefaultClinicalAssessmentParameters({SystolicBloodPressure: systolicBloodPressure}),
        };

        const systolicBloodPressureScore = executeAssessmentCQLExpression(cqlExpressionParameters, 'Systolic BP Risk Score');

        expect(systolicBloodPressureScore).toEqual(expectedScore);
    });

    test.each`
        temperatureF | expectedScore
        ${96.98}     | ${0}
        ${100.4}     | ${0}
        ${null}      | ${0}
        ${95.18}     | ${1}
        ${96.8}      | ${1}
        ${100.58}    | ${1}
        ${102.2}     | ${1}
        ${102.3}     | ${2}
        ${95}        | ${3}
    `('returns score of $expectedScore for temperature value of $temperatureF', ({
        temperatureF, expectedScore
    }) => {
        const cqlExpressionParameters = {
            IgnoreFallbackResourceValues: true,
            PatientData: undefined,
            RiskFactors: undefined,
            ClinicalAssessments: buildDefaultClinicalAssessmentParameters({TemperatureF: temperatureF}),
        };

        const temperatureScore = executeAssessmentCQLExpression(cqlExpressionParameters, 'Temperature Risk Score');

        expect(temperatureScore).toEqual(expectedScore);
    });

    test.each`
        sex         | expectedScore
        ${'male'}   | ${1}
        ${'female'} | ${0}
        ${null}     | ${0}
        ${'other'}  | ${0}
    `('returns score of $expectedScore for sex value of $sex', ({
            sex, expectedScore
        }) => {
        const cqlExpressionParameters = {
            IgnoreFallbackResourceValues: true,
            PatientData: buildDefaultPatientDataParameters({Gender: sex}),
            RiskFactors: undefined,
            ClinicalAssessments: undefined,
        };

        const sexScore = executeAssessmentCQLExpression(cqlExpressionParameters, 'Sex Risk Score');

        expect(sexScore).toEqual(expectedScore);
    });

    test.each`
        age         | expectedScore
        ${0}        | ${0}
        ${15}       | ${0}
        ${16}       | ${0}
        ${49}       | ${0}
        ${50}       | ${2}
        ${65}       | ${2}
        ${66}       | ${3}
        ${80}       | ${3}
        ${81}       | ${4}
    `('returns score of $expectedScore for age value of $age', ({
        age, expectedScore
    }) => {
        const cqlExpressionParameters = {
            IgnoreFallbackResourceValues: true,
            PatientData: buildDefaultPatientDataParameters({Age: age}),
            RiskFactors: undefined,
            ClinicalAssessments: undefined,
        };

        const ageScore = executeAssessmentCQLExpression(cqlExpressionParameters, 'Age Risk Score');

        expect(ageScore).toEqual(expectedScore);
    });
});
