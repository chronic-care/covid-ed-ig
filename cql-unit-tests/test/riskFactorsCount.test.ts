import {
    buildAllNullRiskAssessmentScoreParameters,
    buildDefaultRiskAssessmentScoreParameters
} from "../helpers/builders";
import { CQLExpressionParameters, RiskAssessmentScoreParameters } from "../types/parameter";
import { executeAssessmentCQLExpression } from "../helpers/cqlService";
import { ICondition } from "@ahryman40k/ts-fhir-types/lib/R4";
import ConditionBuilder from './builders/Condition/ConditionBuilder';

const testValueOverrideViaParameter = (hasCondition: boolean,
                                       conditionType: string,
                                       cqlExpression: string,
                                       cqlParameter: boolean | null,
                                       expected: boolean | null,
                                       conditionBuilder: ConditionBuilder) => {
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

    const conditions: ICondition[] = hasCondition ? [ conditionBuilder.build() ] : [];

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
            { conditionType: 'Cancer', cqlExpression: 'Has Cancer Risk Factor', conditionBuilder: new ConditionBuilder("100721000119109", "High grade astrocytoma of brain (disorder)") },
            { conditionType: 'CardiovascularDisease', cqlExpression: 'Has Cardiovascular Disease Risk Factor', conditionBuilder: new ConditionBuilder("722890004", "Heart disease co-occurrent and due to chronic Chagas disease") },
            { conditionType: 'ChronicRespiratoryDisease', cqlExpression: 'Has Chronic Respiratory Disease Risk Factor', conditionBuilder: new ConditionBuilder("195798007", "Chronic adenotonsillitis") },
            { conditionType: 'DiabetesType2', cqlExpression: 'Has Diabetes Type 2 Risk Factor', conditionBuilder: new ConditionBuilder("E08.3499", "Diabetes mellitus due to underlying condition with severe nonproliferative diabetic retinopathy without macular edema, unspecified eye") },
            { conditionType: 'DownsSyndrome', cqlExpression: 'Has Downs Syndrome Risk Factor', conditionBuilder: new ConditionBuilder("724644005", "Myeloid leukaemia co-occurrent with Down syndrome") },
            { conditionType: 'Hypertension', cqlExpression: 'Has Hypertension Risk Factor', conditionBuilder: new ConditionBuilder("10725009", "Benign hypertension (disorder)") },
        ].forEach(({conditionType, cqlExpression, conditionBuilder}) => {
            describe(conditionType, () => {
                test(`Given that the patient has at least one condition of type ${conditionType} and the risk factor parameter is true then the calculated risk factor is true`, () => {
                    testValueOverrideViaParameter(true, conditionType, cqlExpression, true, true, conditionBuilder);
                });
                test(`Given that the patient has at least one condition of type ${conditionType} and the risk factor parameter is false then the calculated risk factor is false`, () => {
                    testValueOverrideViaParameter(true, conditionType, cqlExpression, false, false, conditionBuilder);
                });
                test(`Given that the patient has at least one condition of type ${conditionType} and the risk factor parameter is null then the calculated risk factor is null`, () => {
                    testValueOverrideViaParameter(true, conditionType, cqlExpression, null, null, conditionBuilder);
                });
                test(`Given that the patient does not have any condition of type ${conditionType} and the risk factor parameter is true then the calculated risk factor is true`, () => {
                    testValueOverrideViaParameter(false, conditionType, cqlExpression, true, true, conditionBuilder);
                });
                test(`Given that the patient does not have any condition of type ${conditionType} and the risk factor parameter is false then the calculated risk factor is false`, () => {
                    testValueOverrideViaParameter(false, conditionType, cqlExpression, false, false, conditionBuilder);
                });
                test(`Given that the patient does not have any condition of type ${conditionType} and the risk factor parameter is null then the calculated risk factor is null`, () => {
                    testValueOverrideViaParameter(false, conditionType, cqlExpression, null, null, conditionBuilder);
                });
            });
        });
    });
});
