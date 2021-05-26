import { buildDefaultClinicalAssessmentParameters } from "../helpers/builders";
import { executeAssessmentCQLExpression } from "../helpers/cqlService";

describe('risk percent returns correct values', () => {
    test('risk percent returns null when riskScore is null', () => {
        const cqlExpressionParameters = {
            IgnoreFallbackResourceValues: true,
            PatientData: null,
            RiskFactors: null,
            ClinicalAssessments: buildDefaultClinicalAssessmentParameters({}),
        };

        const riskPercentage = executeAssessmentCQLExpression(cqlExpressionParameters, 'Risk Percent');
        expect(riskPercentage).toEqual(null);
    });

    it('risk percent returns 1% when riskScore is 0', () => {
        const cqlExpressionParameters = {
            IgnoreFallbackResourceValues: true,
            PatientData: null,
            RiskFactors: null,
            ClinicalAssessments: buildDefaultClinicalAssessmentParameters({
                RespiratoryRate: 12,
                O2Saturation: 96,
                HeartRate: 51,
                SystolicBloodPressure: 111,
                TemperatureF: 97.0,
            }),
        };

        const riskPercentage = executeAssessmentCQLExpression(cqlExpressionParameters, 'Risk Percent');
        expect(riskPercentage).toEqual(1);
    });

    it('risk percent returns 9% when riskScore is 5', () => {
        const cqlExpressionParameters = {
            IgnoreFallbackResourceValues: true,
            PatientData: null,
            RiskFactors: null,
            ClinicalAssessments: buildDefaultClinicalAssessmentParameters({
                RespiratoryRate: 10,
                O2Saturation: 94,
                HeartRate: 45,
                SystolicBloodPressure: 109,
                TemperatureF: 95.9,
            }),
        };

        const riskPercentage = executeAssessmentCQLExpression(cqlExpressionParameters, 'Risk Percent');
        expect(riskPercentage).toEqual(9);
    });

    it('risk percent returns 29% when riskScore is 10', () => {
        const cqlExpressionParameters = {
            IgnoreFallbackResourceValues: true,
            PatientData: null,
            RiskFactors: null,
            ClinicalAssessments: buildDefaultClinicalAssessmentParameters({
                RespiratoryRate: 22,
                O2Saturation: 92,
                HeartRate: 112,
                SystolicBloodPressure: 91,
                TemperatureF: 103,
            }),
        };

        const riskPercentage = executeAssessmentCQLExpression(cqlExpressionParameters, 'Risk Percent');
        expect(riskPercentage).toEqual(29);
    });

    it('risk percent returns 50% when riskScore is 15', () => {
        const cqlExpressionParameters = {
            IgnoreFallbackResourceValues: true,
            PatientData: null,
            RiskFactors: null,
            ClinicalAssessments: buildDefaultClinicalAssessmentParameters({
                RespiratoryRate: 8,
                O2Saturation: 91,
                HeartRate: 40,
                SystolicBloodPressure: 90,
                TemperatureF: 94,
            }),
        };

        const riskPercentage = executeAssessmentCQLExpression(cqlExpressionParameters, 'Risk Percent');
        expect(riskPercentage).toEqual(50);
    });

    it('risk percent returns 66% when riskScore is 17', () => {
        const cqlExpressionParameters = {
            IgnoreFallbackResourceValues: true,
            PatientData: null,
            RiskFactors: null,
            ClinicalAssessments: buildDefaultClinicalAssessmentParameters({
                RespiratoryRate: 8,
                O2Saturation: 91,
                HeartRate: 40,
                SystolicBloodPressure: 90,
                TemperatureF: 94,
                SupplementalOxygen: true,
            }),
        };

        const riskPercentage = executeAssessmentCQLExpression(cqlExpressionParameters, 'Risk Percent');
        expect(riskPercentage).toEqual(66);
    });
});
