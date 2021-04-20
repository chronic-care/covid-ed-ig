import { buildDefaultRiskAssessmentScoreParameters } from "../helpers/builders";
import { CQLExpressionParameters, RiskAssessmentScoreParameters } from "../helpers/types";
import { executeAssessmentCQLExpression } from "../helpers/cqlService";

describe('risk assessment score', () => {
    it('return 0 as the risk assessment score when all values are false', () => {
        const riskAssessmentScoreParameters = buildDefaultRiskAssessmentScoreParameters();

        const cqlParams: CQLExpressionParameters = {
            ClinicalAssessments: undefined,
            IgnoreFallbackResourceValues: true,
            PatientData: undefined,
            RiskFactors: riskAssessmentScoreParameters
        };

        const results = executeAssessmentCQLExpression(cqlParams, 'Risk Factors count');

        expect(results).toBe(0);
    });

    it('return 13 as the risk assessment score when all values are true', () => {
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
            ClinicalAssessments: undefined,
            IgnoreFallbackResourceValues: true,
            PatientData: undefined,
            RiskFactors: riskAssessmentScoreParameters
        };

        const results = executeAssessmentCQLExpression(cqlParams, 'Risk Factors count');

        expect(results).toBe(13);
    });
});

