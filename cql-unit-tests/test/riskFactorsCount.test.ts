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

    describe('Cancer', () => {
       describe('given that the patient has at least one condition with a code for the given condition type', () => {
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

           describe('when the Cancer parameter is set to true', () => {
               test('then the calculated risk factor should be true', () => {
                   const riskAssessmentScoreParameters: RiskAssessmentScoreParameters = {
                       Cancer: true,
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
                   };
                   const conditions: ICondition[] = [
                       new CancerBuilder().build()
                   ];
                   const cqlParams: CQLExpressionParameters = {
                       ClinicalAssessments: null,
                       IgnoreFallbackResourceValues: true,
                       PatientData: null,
                       RiskFactors: riskAssessmentScoreParameters,
                   };
                   const results = executeAssessmentCQLExpression(cqlParams, 'Has Cancer Risk Factor', conditions);
                   expect(results).toEqual(true);
               });
           });

           describe('when the Cancer parameter is set to false', () => {
               test('then the calculated risk factor should be false', () => {
                   const riskAssessmentScoreParameters: RiskAssessmentScoreParameters = {
                       Cancer: false,
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
                   };
                   const conditions: ICondition[] = [
                       new CancerBuilder().build()
                   ];
                   const cqlParams: CQLExpressionParameters = {
                       ClinicalAssessments: null,
                       IgnoreFallbackResourceValues: true,
                       PatientData: null,
                       RiskFactors: riskAssessmentScoreParameters,
                   };
                   const results = executeAssessmentCQLExpression(cqlParams, 'Has Cancer Risk Factor', conditions);
                   expect(results).toEqual(false);
               });
           });

           describe('when the Cancer parameter is set to null', () => {
               test('then the calculated risk factor should be null', () => {
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
                   };
                   const conditions: ICondition[] = [
                       new CancerBuilder().build()
                   ];
                   const cqlParams: CQLExpressionParameters = {
                       ClinicalAssessments: null,
                       IgnoreFallbackResourceValues: true,
                       PatientData: null,
                       RiskFactors: riskAssessmentScoreParameters,
                   };
                   const results = executeAssessmentCQLExpression(cqlParams, 'Has Cancer Risk Factor', conditions);
                   expect(results).toEqual(null);
               });
           });
       });

       describe('given that the patient does not have any conditions with a code for the given condition type', () => {
           describe('when the Cancer parameter is set to true', () => {
               test('then the calculated risk factor should be true', () => {
                   const riskAssessmentScoreParameters: RiskAssessmentScoreParameters = {
                       Cancer: true,
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
                   };

                   const cqlParams: CQLExpressionParameters = {
                       ClinicalAssessments: null,
                       IgnoreFallbackResourceValues: true,
                       PatientData: null,
                       RiskFactors: riskAssessmentScoreParameters
                   };

                   const results = executeAssessmentCQLExpression(cqlParams, 'Has Cancer Risk Factor');

                   expect(results).toEqual(true);
               });
           });

           describe('when the Cancer parameter is set to false', () => {
               test('then the calculated risk factor should be null', () => {
                   const riskAssessmentScoreParameters: RiskAssessmentScoreParameters = {
                       Cancer: false,
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
                   };

                   const cqlParams: CQLExpressionParameters = {
                       ClinicalAssessments: null,
                       IgnoreFallbackResourceValues: true,
                       PatientData: null,
                       RiskFactors: riskAssessmentScoreParameters
                   };

                   const results = executeAssessmentCQLExpression(cqlParams, 'Has Cancer Risk Factor');

                   expect(results).toEqual(false);
               });
           });

           describe('when the Cancer parameter is set to null', () => {
               test('then the calculated risk factor should be null', () => {
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
                   };

                   const cqlParams: CQLExpressionParameters = {
                       ClinicalAssessments: null,
                       IgnoreFallbackResourceValues: true,
                       PatientData: null,
                       RiskFactors: riskAssessmentScoreParameters
                   };

                   const results = executeAssessmentCQLExpression(cqlParams, 'Has Cancer Risk Factor');

                   expect(results).toEqual(null);
               });
           });
       });
    });

    // Given that the patient has a condition with a Cancer code
    // When the score is calculated initially
    // Then include Cancer when counting the risk factors

    // Given that the patient does not have a condition with a Cancer code
    // When the score is calculated initially
    // Then do not include Cancer when counting the risk factors

    // Given that the patient has a condition with a Cancer code
    // When the clinician sets the Cancer parameter to true
    // Then include Cancer when counting the risk factors

    // Given that the patient has a condition with a Cancer code
    // When the clinician sets the Cancer parameter to false
    // Then do not include Cancer when counting the risk factors

    // Given that the patient has a condition with a Cancer code
    // When the clinician sets the Cancer parameter to null
    // Then do not include Cancer when counting the risk factors

    // Given that the patient does not have a condition with a Cancer code
    // When the clinician sets the Cancer parameter to true
    // Then include Cancer when counting the risk factors

    // Given that the patient does not have a condition with a Cancer code
    // When the clinician sets the Cancer parameter to false
    // Then do not include Cancer when counting the risk factors

    // Given that the patient does not have a condition with a Cancer code
    // When the clinician sets the Cancer parameter to null
    // Then do not include Cancer when counting the risk factors
});
