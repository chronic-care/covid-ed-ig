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
});
