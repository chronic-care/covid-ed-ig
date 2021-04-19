import { buildDefaultClinicalAssessmentParameters, buildDefaultPatientDataParameters } from "../helpers/builders";
import { executeAssessmentCQLExpression } from "../helpers/cqlService";

describe('severity with parameter overrides', () => {
    test.each`
        respiratoryFailure  | septicShock   | multiOrganDysfunction | expectedCriticalSeverity
        ${true}             | ${false}      | ${false}              | ${true}
        ${false}            | ${true}       | ${false}              | ${true}
        ${false}            | ${false}      | ${true}               | ${true}
        ${false}            | ${false}      | ${false}              | ${false}
        ${true}             | ${true}       | ${true}               | ${true}
        ${null}             | ${null}       | ${null}               | ${false}
        ${true}             | ${null}       | ${null}               | ${true}
    `(`returns expectedCriticalSeverity=$expectedCriticalSeverity when values are respiratoryFailure=$respiratoryFailure,
    septicShock=$septicShock, and multiOrganDysfunction=$multiOrganDysfunction`, ({
        respiratoryFailure, septicShock, multiOrganDysfunction, expectedCriticalSeverity
    }) => {
        const cqlExpressionParameters = {
            IgnoreFallbackResourceValues: true,
            PatientData: undefined,
            RiskFactors: undefined,
            ClinicalAssessments: buildDefaultClinicalAssessmentParameters({
                SepticShock: septicShock,
                RespiratoryFailure: respiratoryFailure,
                MultiorganDysfunction: multiOrganDysfunction,
            }),
        };

        const isCriticalSeverity = executeAssessmentCQLExpression(cqlExpressionParameters, 'Is Critical Severity');

        expect(isCriticalSeverity).toEqual(expectedCriticalSeverity);
    });

    test.each`
        o2Saturation   | respiratoryRate | paO2FiO2 | lungInfiltrates | expectedSevereSeverity
        ${93}             | ${null}      | ${null}         | ${null}  |  ${true}
        ${94}             | ${null}      | ${null}         | ${null}  |  ${false}
        ${null}            | ${35}       | ${null}         | ${null}  | ${true}
        ${null}            | ${30}       | ${null}         | ${null}  | ${false}
        ${null}            | ${null}      | ${300}          | ${null} | ${false}
        ${null}            | ${null}      | ${299}          | ${null} | ${true}
        ${null}            | ${null}      | ${null}         | ${true} | ${true}
    `(`returns expectedSevereSeverity=$expectedSevereSeverity when values are ,
    o2Saturation=$o2Saturation, respiratoryRate=$respiratoryRate, paO2FiO2=$paO2FiO2, lungInfiltrates=$lungInfiltrates`, ({
        o2Saturation, respiratoryRate, paO2FiO2, lungInfiltrates, expectedSevereSeverity
    }) => {
        const cqlExpressionParameters = {
            IgnoreFallbackResourceValues: true,
            PatientData: undefined,
            RiskFactors: undefined,
            ClinicalAssessments: buildDefaultClinicalAssessmentParameters({
                O2Saturation: o2Saturation,
                RespiratoryRate: respiratoryRate,
                PaO2FiO2Ratio: paO2FiO2,
                LungInfiltratesOver50: lungInfiltrates
            }),
        };

        const isSevereSeverity = executeAssessmentCQLExpression(cqlExpressionParameters, 'Is Severe Severity');

        expect(isSevereSeverity).toEqual(expectedSevereSeverity);
    });
});
