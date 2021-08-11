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
                                       conditions: ICondition[]) => {
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

    const cqlParams: CQLExpressionParameters = {
        ClinicalAssessments: null,
        IgnoreFallbackResourceValues: true,
        PatientData: null,
        RiskFactors: riskAssessmentScoreParameters,
    };

    const results = executeAssessmentCQLExpression(cqlParams, cqlExpression, hasCondition ? conditions : []);
    expect(results).toEqual(expected);
};

const testCodesMapToConditions = (cqlExpression: string,
                                   expected: boolean | null,
                                   condition: ICondition) => {

    const cqlParams: CQLExpressionParameters = {
        ClinicalAssessments: null,
        IgnoreFallbackResourceValues: false,
        PatientData: null,
        RiskFactors: null,
    };

    const results = executeAssessmentCQLExpression(cqlParams, cqlExpression, [condition]);
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
            { conditionType: 'Cancer', cqlExpression: 'Has Cancer Risk Factor', conditions: [new ConditionBuilder("100721000119109", "High grade astrocytoma of brain (disorder)").build()] },
            { conditionType: 'CardiovascularDisease', cqlExpression: 'Has Cardiovascular Disease Risk Factor', conditions: [new ConditionBuilder("722890004", "Heart disease co-occurrent and due to chronic Chagas disease").build()] },
            { conditionType: 'ChronicRespiratoryDisease', cqlExpression: 'Has Chronic Respiratory Disease Risk Factor', conditions: [new ConditionBuilder("195798007", "Chronic adenotonsillitis").build()] },
            { conditionType: 'DiabetesType2', cqlExpression: 'Has Diabetes Type 2 Risk Factor', conditions: [new ConditionBuilder("E08.3499", "Diabetes mellitus due to underlying condition with severe nonproliferative diabetic retinopathy without macular edema, unspecified eye").build()] },
            { conditionType: 'DownsSyndrome', cqlExpression: 'Has Downs Syndrome Risk Factor', conditions: [new ConditionBuilder("724644005", "Myeloid leukaemia co-occurrent with Down syndrome").build()] },
            { conditionType: 'Hypertension', cqlExpression: 'Has Hypertension Risk Factor', conditions: [new ConditionBuilder("10725009", "Benign hypertension (disorder)").build()] },
            { conditionType: 'ObstructiveSleepApnea', cqlExpression: 'Has Obstructive Sleep Apnea Risk Factor', conditions: [new ConditionBuilder("230493001", "Mixed sleep apnoea").build()] },
            { conditionType: 'Obesity', cqlExpression: 'Has Obesity Risk Factor', conditions: [new ConditionBuilder("1076701000119104", "Hypertrophy of fat pad of right knee (disorder)").build()] },
            { conditionType: 'RenalDisease', cqlExpression: 'Has Renal Disease Risk Factor', conditions: [new ConditionBuilder("104931000119100", "Chronic kidney disease due to hypertension (disorder)").build()] },
            { conditionType: 'Immunosuppression', cqlExpression: 'Has Immunosuppression Risk Factor', conditions: [] },
            { conditionType: 'NeurologicDisease', cqlExpression: 'Has Neurologic Disease Risk Factor', conditions: [] },
            { conditionType: 'Pregnancy', cqlExpression: 'Has Pregnancy Risk Factor', conditions: [] },
            { conditionType: 'SteroidUsage', cqlExpression: 'Has Steroid Usage Risk Factor', conditions: [] },
        ].forEach(({conditionType, cqlExpression, conditions}) => {
            describe(conditionType, () => {
                test(`Given that the patient has at least one condition of type ${conditionType} and the risk factor parameter is true then the calculated risk factor is true`, () => {
                    testValueOverrideViaParameter(true, conditionType, cqlExpression, true, true, conditions);
                });
                test(`Given that the patient has at least one condition of type ${conditionType} and the risk factor parameter is false then the calculated risk factor is false`, () => {
                    testValueOverrideViaParameter(true, conditionType, cqlExpression, false, false, conditions);
                });
                test(`Given that the patient has at least one condition of type ${conditionType} and the risk factor parameter is null then the calculated risk factor is null`, () => {
                    testValueOverrideViaParameter(true, conditionType, cqlExpression, null, null, conditions);
                });
                test(`Given that the patient does not have any condition of type ${conditionType} and the risk factor parameter is true then the calculated risk factor is true`, () => {
                    testValueOverrideViaParameter(false, conditionType, cqlExpression, true, true, conditions);
                });
                test(`Given that the patient does not have any condition of type ${conditionType} and the risk factor parameter is false then the calculated risk factor is false`, () => {
                    testValueOverrideViaParameter(false, conditionType, cqlExpression, false, false, conditions);
                });
                test(`Given that the patient does not have any condition of type ${conditionType} and the risk factor parameter is null then the calculated risk factor is null`, () => {
                    testValueOverrideViaParameter(false, conditionType, cqlExpression, null, null, conditions);
                });
            });
        });
    });

    describe('code maps to its expected condition', () => {
        [
            { conditionType: 'Cancer', cqlExpression: 'Has Cancer Risk Factor', condition: new ConditionBuilder("703135009", "Anemia in malignant neoplastic disease (disorder)").build()},
            { conditionType: 'Cancer', cqlExpression: 'Has Cancer Risk Factor', condition: new ConditionBuilder("100721000119109", "High grade astrocytoma of brain (disorder)").build()},
            { conditionType: 'Renal Disease', cqlExpression: 'Has Renal Disease Risk Factor', condition: new ConditionBuilder("90708001", "Kidney disease (disorder)").build()},
            { conditionType: 'Immunosuppression', cqlExpression: 'Has Immunosuppression Risk Factor', condition: new ConditionBuilder("700051000", "Sepsis in asplenic subject (disorder)").build()},
            { conditionType: 'Immunosuppression', cqlExpression: 'Has Immunosuppression Risk Factor', condition: new ConditionBuilder("Z90.81", "Acquired absence of spleen", "http://hl7.org/fhir/sid/icd-10-cm").build()},
            { conditionType: 'Obstructive Sleep Apnea', cqlExpression: 'Has Obstructive Sleep Apnea Risk Factor', condition: new ConditionBuilder("G47.30", "Sleep apnea, unspecified", "http://hl7.org/fhir/sid/icd-10-cm").build()},
            { conditionType: 'Steroid Usage', cqlExpression: 'Has Steroid Usage Risk Factor', condition: new ConditionBuilder("T38.0X5A", "Adverse effect of glucocorticoids and synthetic analogues, initial encounter", "http://hl7.org/fhir/sid/icd-10-cm").build()},
            { conditionType: 'Steroid Usage', cqlExpression: 'Has Steroid Usage Risk Factor', condition: new ConditionBuilder("95919007", "Dependence on corticoids (disorder)").build()},
            { conditionType: 'Downs Syndrome', cqlExpression: 'Has Downs Syndrome Risk Factor', condition: new ConditionBuilder("Q90.0", "Trisomy 21, nonmosaicism (meiotic nondisjunction)", "http://hl7.org/fhir/sid/icd-10-cm").build()},
            { conditionType: 'Downs Syndrome', cqlExpression: 'Has Downs Syndrome Risk Factor', condition: new ConditionBuilder("840505007", "Down syndrome co-occurrent with leukaemoid reaction associated transient neonatal pustulosis").build()}
        ].forEach(({conditionType, cqlExpression, condition}) => {
            describe(conditionType, () => {
                test(`Given that the patient has codes associated with ${conditionType} then the '${cqlExpression}' should come back as true`, () => {
                    testCodesMapToConditions(cqlExpression, true, condition);
                });
            });
        });
    });
});
