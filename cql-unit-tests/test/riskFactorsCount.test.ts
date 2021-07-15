import {
    buildAllNullRiskAssessmentScoreParameters,
    buildDefaultRiskAssessmentScoreParameters
} from "../helpers/builders";
import { CQLExpressionParameters, RiskAssessmentScoreParameters } from "../types/parameter";
import { executeAssessmentCQLExpression } from "../helpers/cqlService";
import { ICondition } from "@ahryman40k/ts-fhir-types/lib/R4";
import CancerBuilder from "./builders/Condition/CancerBuilder";

const testValueOverrideViaParameter = (hasCondition: boolean,
                                       conditionType: string,
                                       cqlExpression: string,
                                       cqlParameter: boolean | null,
                                       expected: boolean | null,
                                       builder: any) => {
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

    const conditions: ICondition[] = hasCondition ? [ new builder().build() ] : [];

    const cqlParams: CQLExpressionParameters = {
        ClinicalAssessments: null,
        IgnoreFallbackResourceValues: true,
        PatientData: null,
        RiskFactors: riskAssessmentScoreParameters,
    };

    const results = executeAssessmentCQLExpression(cqlParams, cqlExpression, conditions);
    expect(results).toEqual(expected);
};

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
        [
            { conditionType: 'Cancer', cqlExpression: 'Has Cancer Risk Factor', builder: CancerBuilder },
        ].forEach(({conditionType, cqlExpression, builder}) => {
            test(`Given that the patient has at least one condition of type ${conditionType} and the risk factor parameter is true then the calculated risk factor is true`, () => {
                testValueOverrideViaParameter(true, conditionType, cqlExpression, true, true, builder);
            });
            test(`Given that the patient has at least one condition of type ${conditionType} and the risk factor parameter is false then the calculated risk factor is false`, () => {
                testValueOverrideViaParameter(true, conditionType, cqlExpression, true, true, builder);
            });
            test(`Given that the patient has at least one condition of type ${conditionType} and the risk factor parameter is null then the calculated risk factor is null`, () => {
                testValueOverrideViaParameter(true, conditionType, cqlExpression, true, true, builder);
            });
            test(`Given that the patient does not have any condition of type ${conditionType} and the risk factor parameter is true then the calculated risk factor is true`, () => {
                testValueOverrideViaParameter(true, conditionType, cqlExpression, true, true, builder);
            });
            test(`Given that the patient does not have any condition of type ${conditionType} and the risk factor parameter is false then the calculated risk factor is false`, () => {
                testValueOverrideViaParameter(true, conditionType, cqlExpression, true, true, builder);
            });
            test(`Given that the patient does not have any condition of type ${conditionType} and the risk factor parameter is null then the calculated risk factor is null`, () => {
                testValueOverrideViaParameter(true, conditionType, cqlExpression, true, true, builder);
            });
        });
    });
});
