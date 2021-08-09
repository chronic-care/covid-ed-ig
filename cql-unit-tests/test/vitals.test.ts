import BloodPressureBuilder from './builders/Observation/BloodPressureBuilder';
import { executeAssessmentNoParams } from '../helpers/cqlService';

describe('Last Blood Pressure', () => {
    it('returns the expected component', () => {
        const bloodPressure = new BloodPressureBuilder()
            .withSystolicValue(105)
            .withDiastolicValue(80)
            .build();

        const actual = executeAssessmentNoParams('Last Blood Pressure', [bloodPressure]);

        expect(actual).toMatchObject({
            'Systolic': 105,
            'Diastolic': 80,
            'Display': '105/80',
        });
    });
});

describe('Last SBP value', () => {
    it('returns the expected value', () => {
        const bloodPressure = new BloodPressureBuilder()
            .withSystolicValue(105)
            .withDiastolicValue(80)
            .build();

        const actual = executeAssessmentNoParams('Last SBP value', [bloodPressure]);

        expect(actual).toEqual(105);
    });
});