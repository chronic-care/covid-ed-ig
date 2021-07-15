import {
    buildAllNullRiskAssessmentScoreParameters,
    buildDefaultRiskAssessmentScoreParameters
} from "../helpers/builders";
import { CQLExpressionParameters, RiskAssessmentScoreParameters } from "../types/parameter";
import { executeAssessmentCQLExpression } from "../helpers/cqlService";
import { ICondition } from "@ahryman40k/ts-fhir-types/lib/R4";
import CancerBuilder from "./builders/Condition/CancerBuilder";

describe('risk assessment score', () => {
    it('returns 0 when all inputs are null', () => {
        const riskAssessmentScoreParameters = buildAllNullRiskAssessmentScoreParameters();

        const cqlParams: CQLExpressionParameters = {
            ClinicalAssessments: null,
            IgnoreFallbackResourceValues: true,
            PatientData: null,
            RiskFactors: riskAssessmentScoreParameters
        };

        const results = executeAssessmentCQLExpression(cqlParams, 'Risk Factors count');

        expect(results).toBe(0);
    });

    it('returns 0 as the risk assessment score when all values are false', () => {
        const riskAssessmentScoreParameters = buildDefaultRiskAssessmentScoreParameters();

        const cqlParams: CQLExpressionParameters = {
            ClinicalAssessments: null,
            IgnoreFallbackResourceValues: true,
            PatientData: null,
            RiskFactors: riskAssessmentScoreParameters
        };

        const results = executeAssessmentCQLExpression(cqlParams, 'Risk Factors count');

        expect(results).toBe(0);
    });

    it('returns 13 as the risk assessment score when all values are true', () => {
        const riskAssessmentScoreParameters: RiskAssessmentScoreParameters = {
            Cancer: true,
            CardiovascularDisease: true,
            ChronicRespiratoryDisease: true,
            DiabetesType2: true,
            DownsSyndrome: true,
            Hypertension: true,
            Immunosuppression: true,
            NeurologicDisease: true,
            Obesity: true,
            ObstructiveSleepApnea: true,
            Pregnancy: true,
            RenalDisease: true,
            SteroidUsage: true,
        };

        const cqlParams: CQLExpressionParameters = {
            ClinicalAssessments: null,
            IgnoreFallbackResourceValues: true,
            PatientData: null,
            RiskFactors: riskAssessmentScoreParameters
        };

        const results = executeAssessmentCQLExpression(cqlParams, 'Risk Factors count');

        expect(results).toBe(13);
    });

    describe('overriding original values with parameters', () => {
        test.each`
            hasCondition | conditionType                     | cqlExpression                        | cqlParameter | expected  | builder
            ${`has`}     | ${`Cancer`}                       | ${`Has Cancer Risk Factor`}          | ${true}      | ${true}   | ${CancerBuilder}
            ${`has`}     | ${`Cancer`}                       | ${`Has Cancer Risk Factor`}          | ${false}     | ${false}  | ${CancerBuilder}
            ${`has`}     | ${`Cancer`}                       | ${`Has Cancer Risk Factor`}          | ${null}      | ${null}   | ${CancerBuilder}
            ${`lacks`}   | ${`Cancer`}                       | ${`Has Cancer Risk Factor`}          | ${true}      | ${true}   | ${CancerBuilder}
            ${`lacks`}   | ${`Cancer`}                       | ${`Has Cancer Risk Factor`}          | ${false}     | ${null}   | ${CancerBuilder}
            ${`lacks`}   | ${`Cancer`}                       | ${`Has Cancer Risk Factor`}          | ${null}      | ${null}   | ${CancerBuilder}
        `('When the patient $hasCondition at least one condition of type $conditionType and that risk factor parameter is $cqlParameter then the calculated risk factor is $expected',
        ({ hasCondition, conditionType, cqlExpression, cqlParameter, expected, builder }) => {
            const riskAssessmentScoreParameters: RiskAssessmentScoreParameters = {
                Cancer: null,
                CardiovascularDisease: null,
                ChronicRespiratoryDisease: null,
                DiabetesType2: null,
                DownsSyndrome: null,
                Hypertension: null,
                Immunosuppression: null,
                NeurologicDisease: null,
                Obesity: null,
                ObstructiveSleepApnea: null,
                Pregnancy: null,
                RenalDisease: null,
                SteroidUsage: null,
                [conditionType]: cqlParameter,
            };

            const conditions: ICondition[] = hasCondition === 'has' ? [ new builder().build() ] : [];

            const cqlParams: CQLExpressionParameters = {
                ClinicalAssessments: null,
                IgnoreFallbackResourceValues: true,
                PatientData: null,
                RiskFactors: riskAssessmentScoreParameters,
            };

            const results = executeAssessmentCQLExpression(cqlParams, cqlExpression, conditions);
            expect(results).toEqual(expected);
        });
    });

    describe('Cancer', () => {
       describe('given that the patient has at least one condition with a code for the given condition type', () => {
           // TODO: Still necessary?
           describe('when initially calculating their risk factor count', () => {
               test('then the calculated risk factor should be true', () => {

                   const conditions: ICondition[] = [
                        new CancerBuilder().build()
                   ]
                   const cqlParams: CQLExpressionParameters = {
                       ClinicalAssessments: null,
                       IgnoreFallbackResourceValues: false,
                       PatientData: null,
                       RiskFactors: null,
                   };
                   const results = executeAssessmentCQLExpression(cqlParams, 'Has Cancer Risk Factor', conditions);
                   expect(results).toEqual(true);
               });
           });
       });
    });
});
