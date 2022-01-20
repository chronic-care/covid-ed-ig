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
        Bronchiectasis: null,
        BronchopulmonaryDysplasia: null,
        PulmonaryHypertension: null,
        PulmonaryEmbolism: null,
        Cancer: null,
        CerebrovascularDisease: null,
        ChronicKidneyDisease: null,
        ChronicLiverDisease: null,
        COPD: null,
        DiabetesMellitus: null,
        HeartConditions: null,
        InterstitialLungDisease: null,
        CurrentAndFormerSmoking: null,
        Tuberculosis: null,
        Obesity: null,
        PregnancyAndRecentPregnancy: null,
        MentalHealthDisorders: null,
        ChildrenWithCertainUnderlyingConditions: null,
        DownSyndrome: null,
        HIV: null,
        NeurologicConditions: null,
        Overweight: null,
        SickleCellDisease: null,
        SolidOrganOrBloodStemTransplantation: null,
        SubstanceUseDisorders: null,
        Corticosteroids: null,
        ImmunosuppressiveMedications: null,
        CysticFibrosis: null,
        Thalassemia: null,
        Asthma: null,
        Hypertension: null,
        ImmuneDeficiencies: null,
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

    it('returns 32 as the risk assessment score when all values are true', () => {
        const riskAssessmentScoreParameters: RiskAssessmentScoreParameters = {
            Bronchiectasis: true,
            BronchopulmonaryDysplasia: true,
            PulmonaryHypertension: true,
            PulmonaryEmbolism: true,
            Cancer: true,
            CerebrovascularDisease: true,
            ChronicKidneyDisease: true,
            ChronicLiverDisease: true,
            COPD: true,
            DiabetesMellitus: true,
            HeartConditions: true,
            InterstitialLungDisease: true,
            CurrentAndFormerSmoking: true,
            Tuberculosis: true,
            Obesity: true,
            PregnancyAndRecentPregnancy: true,
            MentalHealthDisorders: true,
            ChildrenWithCertainUnderlyingConditions: true,
            DownSyndrome: true,
            HIV: true,
            NeurologicConditions: true,
            Overweight: true,
            SickleCellDisease: true,
            SolidOrganOrBloodStemTransplantation: true,
            SubstanceUseDisorders: true,
            Corticosteroids: true,
            ImmunosuppressiveMedications: true,
            CysticFibrosis: true,
            Thalassemia: true,
            Asthma: true,
            Hypertension: true,
            ImmuneDeficiencies: true
        };

        const cqlParams: CQLExpressionParameters = {
            ClinicalAssessments: null,
            IgnoreFallbackResourceValues: true,
            PatientData: null,
            RiskFactors: riskAssessmentScoreParameters
        };

        const results = executeAssessmentCQLExpression(cqlParams, 'Risk Factors count');

        expect(results).toBe(32);
    });

    describe('overriding original values with parameters', () => {
        [
            { conditionType: 'COPD', cqlExpression: 'Has COPD Risk Factor', conditions:[] },
            { conditionType: 'Bronchiectasis', cqlExpression: 'Has Bronchiectasis Risk Factor', conditions:[] },
            { conditionType: 'BronchopulmonaryDysplasia', cqlExpression: 'Has Bronchopulmonary Dysplasia Risk Factor', conditions:[] },
            { conditionType: 'PulmonaryHypertension', cqlExpression: 'Has Pulmonary Hypertension Risk Factor', conditions:[] },
            { conditionType: 'PulmonaryEmbolism', cqlExpression: 'Has Pulmonary Embolism Risk Factor', conditions: [] },
            { conditionType: 'CerebrovascularDisease', cqlExpression: 'Has Cerebrovascular Disease Risk Factor',  conditions:[] },
            { conditionType: 'ChronicLiverDisease', cqlExpression: 'Has Chronic Liver Disease Risk Factor', conditions:[] },
            { conditionType: 'HeartConditions', cqlExpression: 'Has Heart Conditions Risk Factor', conditions:[] },
            { conditionType: 'InterstitialLungDisease', cqlExpression: 'Has Interstitial Lung Disease Risk Factor', conditions:[] },
            { conditionType: 'CurrentAndFormerSmoking', cqlExpression: 'Has Current And Former Smoking Risk Factor', conditions:[] },
            { conditionType: 'Tuberculosis', cqlExpression: 'Has Tuberculosis Risk Factor', conditions:[] },
            { conditionType: 'Obesity', cqlExpression: 'Has Obesity Risk Factor', conditions:[] },
            { conditionType: 'PregnancyAndRecentPregnancy', cqlExpression: 'Has Pregnancy And Recent Pregnancy Risk Factor', conditions:[] },
            { conditionType: 'MentalHealthDisorders', cqlExpression: 'Has Mental Health Disorders Risk Factor', conditions:[] },
            { conditionType: 'ChildrenWithCertainUnderlyingConditions', cqlExpression: 'Has Children With Certain Underlying Conditions Risk Factor', conditions:[] },
            { conditionType: 'HIV', cqlExpression: 'Has HIV Risk Factor', conditions:[] },
            { conditionType: 'NeurologicConditions', cqlExpression: 'Has Neurologic Conditions Risk Factor', conditions:[] },
            { conditionType: 'Overweight', cqlExpression: 'Has Overweight Risk Factor', conditions:[] },
            { conditionType: 'SickleCellDisease', cqlExpression: 'Has Sickle Cell Disease Risk Factor', conditions:[] },
            { conditionType: 'SolidOrganOrBloodStemTransplantation', cqlExpression: 'Has Solid Organ Or Blood Stem Transplantation Risk Factor', conditions:[] },
            { conditionType: 'SubstanceUseDisorders', cqlExpression: 'Has Substance Use Disorders Risk Factor', conditions:[] },
            { conditionType: 'ImmunosuppressiveMedications', cqlExpression: 'Has Immunosuppressive Medications Risk Factor', conditions:[] },
            { conditionType: 'CysticFibrosis', cqlExpression: 'Has Cystic Fibrosis Risk Factor', conditions:[] },
            { conditionType: 'Thalassemia', cqlExpression: 'Has Thalassemia Risk Factor', conditions:[] },
            { conditionType: 'Asthma', cqlExpression: 'Has Asthma Risk Factor', conditions:[] },
            { conditionType: 'Hypertension', cqlExpression: 'Has Hypertension Risk Factor', conditions:[] },
            { conditionType: 'Cancer', cqlExpression: 'Has Cancer Risk Factor', conditions:[] },
            { conditionType: 'ChronicKidneyDisease', cqlExpression: 'Has Chronic Kidney Disease Risk Factor', conditions:[] },
            { conditionType: 'ImmuneDeficiencies', cqlExpression: 'Has Immune deficiencies Risk Factor', conditions: [new ConditionBuilder("700051000", "Sepsis in asplenic subject (disorder)").build()]},
            { conditionType: 'Corticosteroids', cqlExpression: 'Has Corticosteroids Usage Risk Factor', conditions: [new ConditionBuilder("T38.0X5A", "Adverse effect of glucocorticoids and synthetic analogues, initial encounter", "http://hl7.org/fhir/sid/icd-10-cm").build()]},
            { conditionType: 'DownSyndrome', cqlExpression: 'Has Down Syndrome Risk Factor', conditions: [new ConditionBuilder("Q90.0", "Trisomy 21, nonmosaicism (meiotic nondisjunction)", "http://hl7.org/fhir/sid/icd-10-cm").build()]},
            { conditionType: 'DiabetesMellitus', cqlExpression: 'Has Diabetes Mellitus Risk Factor', conditions: [new ConditionBuilder("E08.3499", "Diabetes mellitus due to underlying condition with severe nonproliferative diabetic retinopathy without macular edema, unspecified eye").build()] },
          
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
            { conditionType: 'Immunosuppression', cqlExpression: 'Has Immune deficiencies Risk Factor', condition: new ConditionBuilder("700051000", "Sepsis in asplenic subject (disorder)").build()},
            { conditionType: 'Immunosuppression', cqlExpression: 'Has Immune deficiencies Risk Factor', condition: new ConditionBuilder("Z90.81", "Acquired absence of spleen", "http://hl7.org/fhir/sid/icd-10-cm").build()},
            { conditionType: 'Steroid Usage', cqlExpression: 'Has Corticosteroids Usage Risk Factor', condition: new ConditionBuilder("T38.0X5A", "Adverse effect of glucocorticoids and synthetic analogues, initial encounter", "http://hl7.org/fhir/sid/icd-10-cm").build()},
            { conditionType: 'Steroid Usage', cqlExpression: 'Has Corticosteroids Usage Risk Factor', condition: new ConditionBuilder("95919007", "Dependence on corticoids (disorder)").build()},
            { conditionType: 'Downs Syndrome', cqlExpression: 'Has Down Syndrome Risk Factor', condition: new ConditionBuilder("Q90.0", "Trisomy 21, nonmosaicism (meiotic nondisjunction)", "http://hl7.org/fhir/sid/icd-10-cm").build()},
            { conditionType: 'Downs Syndrome', cqlExpression: 'Has Down Syndrome Risk Factor', condition: new ConditionBuilder("840505007", "Down syndrome co-occurrent with leukaemoid reaction associated transient neonatal pustulosis").build()},
            { conditionType: 'Diabetes', cqlExpression: 'Has Diabetes Mellitus Risk Factor', condition: new ConditionBuilder("E08.11", "Diabetes mellitus due to underlying condition with hyperosmolarity with coma", "http://hl7.org/fhir/sid/icd-10-cm").build()},
            { conditionType: 'Diabetes', cqlExpression: 'Has Diabetes Mellitus Risk Factor', condition:new ConditionBuilder("712882000", "Autonomic neuropathy co-occurrent and due to type 1 diabetes mellitus (disorder)").build() },

        ].forEach(({conditionType, cqlExpression, condition}) => {
            describe(conditionType, () => {
                test(`Given that the patient has codes associated with ${conditionType} then the '${cqlExpression}' should come back as true`, () => {
                    testCodesMapToConditions(cqlExpression, true, condition);
                });
            });
        });
    });


    describe('Irrespective of the condition code maps to its null for manual entry', () => {
        [
            { conditionType: 'COPD', cqlExpression: 'Has COPD Risk Factor', condition: new ConditionBuilder("840505007", "Down syndrome co-occurrent with leukaemoid reaction associated transient neonatal pustulosis").build() },
            { conditionType: 'Bronchiectasis', cqlExpression: 'Has Bronchiectasis Risk Factor',condition: new ConditionBuilder("840505007", "Down syndrome co-occurrent with leukaemoid reaction associated transient neonatal pustulosis").build()},
            { conditionType: 'Bronchopulmonary Dysplasia', cqlExpression: 'Has Bronchopulmonary Dysplasia Risk Factor', condition: null },
            { conditionType: 'Pulmonary Hypertension', cqlExpression: 'Has Pulmonary Hypertension Risk Factor', condition: null },
            { conditionType: 'Pulmonary Embolism', cqlExpression: 'Has Pulmonary Embolism Risk Factor', condition: null },
            { conditionType: 'Cerebrovascular Disease', cqlExpression: 'Has Cerebrovascular Disease Risk Factor',  condition: new ConditionBuilder("840505007", "Down syndrome co-occurrent with leukaemoid reaction associated transient neonatal pustulosis").build() },
            { conditionType: 'Chronic Liver Disease', cqlExpression: 'Has Chronic Liver Disease Risk Factor', condition: null },
            { conditionType: 'Heart Conditions', cqlExpression: 'Has Heart Conditions Risk Factor', condition: null },
            { conditionType: 'Interstitial Lung Disease', cqlExpression: 'Has Interstitial Lung Disease Risk Factor', condition: null },
            { conditionType: 'Current And Former Smoking', cqlExpression: 'Has Current And Former Smoking Risk Factor', condition: null },
            { conditionType: 'Tuberculosis', cqlExpression: 'Has Tuberculosis Risk Factor', condition: null },
            { conditionType: 'Obesity', cqlExpression: 'Has Obesity Risk Factor', condition: null },
            { conditionType: 'Pregnancy And Recent Pregnancy', cqlExpression: 'Has Pregnancy And Recent Pregnancy Risk Factor', condition: null },
            { conditionType: 'Mental Health Disorders', cqlExpression: 'Has Mental Health Disorders Risk Factor', condition: null },
            { conditionType: 'Children With Certain Underlying Conditions', cqlExpression: 'Has Children With Certain Underlying Conditions Risk Factor', condition: null },
            { conditionType: 'HIV', cqlExpression: 'Has HIV Risk Factor', condition: null },
            { conditionType: 'Neurologic Conditions', cqlExpression: 'Has Neurologic Conditions Risk Factor', condition: new ConditionBuilder("840505007", "Down syndrome co-occurrent with leukaemoid reaction associated transient neonatal pustulosis").build() },
            { conditionType: 'Overweight', cqlExpression: 'Has Overweight Risk Factor', condition: null },
            { conditionType: 'Sickle Cell Disease', cqlExpression: 'Has Sickle Cell Disease Risk Factor', condition: null },
            { conditionType: 'Solid Organ Or Blood Stem Transplantation', cqlExpression: 'Has Solid Organ Or Blood Stem Transplantation Risk Factor', condition: null },
            { conditionType: 'Substance Use Disorders', cqlExpression: 'Has Substance Use Disorders Risk Factor', condition: null },
            { conditionType: 'Immunosuppressive Medications', cqlExpression: 'Has Immunosuppressive Medications Risk Factor', condition: null },
            { conditionType: 'Cystic Fibrosis', cqlExpression: 'Has Cystic Fibrosis Risk Factor', condition: null },
            { conditionType: 'Thalassemia', cqlExpression: 'Has Thalassemia Risk Factor', condition: null },
            { conditionType: 'Asthma', cqlExpression: 'Has Asthma Risk Factor', condition: null },
            { conditionType: 'Hypertension', cqlExpression: 'Has Hypertension Risk Factor', condition: null },
            { conditionType: 'Cancer', cqlExpression: 'Has Cancer Risk Factor', condition: new ConditionBuilder("100721000119109", "High grade astrocytoma of brain (disorder)").build()},
            { conditionType: 'Chronic Kidney Disease', cqlExpression: 'Has Chronic Kidney Disease Risk Factor', condition: new ConditionBuilder("90708001", "Kidney disease (disorder)").build()},
          
        ].forEach(({conditionType, cqlExpression, condition}) => {
            describe(conditionType, () => {
                test(`Given that the patient has codes associated with ${conditionType} then the '${cqlExpression}' should come back as null`, () => {
                    testCodesMapToConditions(cqlExpression, null, condition);
                });
            });
        });
    });
});
