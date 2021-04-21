import { buildDefaultClinicalAssessmentParameters } from '../helpers/builders';
import { executeSummaryCQLExpression, executeSummaryNoParams } from '../helpers/cqlService';
import { LabResultBuilder } from "./builders/Observation/LabResult";
import { Diagnostic, DiagnosticSummary } from "../types/summary";
import { Resource } from "../types/resource";

describe('diagnostic interpretation with parameter overrides', () => {
    test.each`
        concerningLabCount | expectedConcerningLabCount
        ${1}               | ${1}
        ${null}            | ${0}
        ${5}               | ${5}
    `(`returns expectedConcerningLabCount=$expectedConcerningLabCount when values 
    are concerningLabCount=$concerningLabCount `, ({concerningLabCount, expectedConcerningLabCount}) => {
        const cqlExpressionParameters = {
            IgnoreFallbackResourceValues: true,
            PatientData: null,
            RiskFactors: null,
            ClinicalAssessments: buildDefaultClinicalAssessmentParameters({
                ConcerningLabCount: concerningLabCount
            }),
        };

        const CQLConcerningLabCount = executeSummaryCQLExpression(cqlExpressionParameters, 'ConcerningLabCount');

        expect(CQLConcerningLabCount).toEqual(expectedConcerningLabCount);
    });

    test.each`
        chestXRayConcerning | ultrasoundConcerning | cTConcerning | expectedConcerningImagingCount
        ${true}             | ${false}             | ${false}     | ${1}
        ${true}             | ${true}              | ${false}     | ${2}
        ${true}             | ${true}              | ${true}      | ${3}
        ${true}             | ${false}             | ${true}      | ${2}
        ${false}            | ${false}             | ${true}      | ${1}
     
    `(`returns expectedConcerningImagingCount=$expectedConcerningImagingCount when values 
    are chestXRayConcerning=$chestXRayConcerning, ultrasoundConcerning=$ultrasoundConcerning, 
     cTConcerning=$cTConcerning`, ({ chestXRayConcerning, ultrasoundConcerning, cTConcerning, expectedConcerningImagingCount }) => {
        const cqlExpressionParameters = {
            IgnoreFallbackResourceValues: true,
            PatientData: null,
            RiskFactors: null,
            ClinicalAssessments: buildDefaultClinicalAssessmentParameters({
                ChestXRayConcerning: chestXRayConcerning,
                UltrasoundConcerning: ultrasoundConcerning,
                CTConcerning: cTConcerning
            }),
        };

        const CQLConcerningImagingCount = executeSummaryCQLExpression(cqlExpressionParameters, 'ConcerningImagingCount');

        expect(CQLConcerningImagingCount).toEqual(expectedConcerningImagingCount);
    });

    test.each`
        chestXRayConcerning | ultrasoundConcerning | cTConcerning | concerningLabCount | expectedDiagnosticInterpretation
        ${true}             | ${false}             | ${false}     | ${1}               | ${2}
        ${true}             | ${true}              | ${false}     | ${2}               | ${4}
        ${true}             | ${true}              | ${true}      | ${null}            | ${3}
        ${true}             | ${true}              | ${true}      | ${3}               | ${6}
        ${true}             | ${false}             | ${true}      | ${1}               | ${3}
        ${false}            | ${false}             | ${true}      | ${null}            | ${1}
     
    `(`returns expectedDiagnosticInterpretation=$expectedDiagnosticInterpretation when values 
    are chestXRayConcerning=$chestXRayConcerning, ultrasoundConcerning=$ultrasoundConcerning, 
     cTConcerning=$cTConcerning`, ({ chestXRayConcerning, ultrasoundConcerning, cTConcerning, concerningLabCount, expectedDiagnosticInterpretation }) => {
        const cqlExpressionParameters = {
            IgnoreFallbackResourceValues: true,
            PatientData: null,
            RiskFactors: null,
            ClinicalAssessments: buildDefaultClinicalAssessmentParameters({
                ConcerningLabCount: concerningLabCount,
                ChestXRayConcerning: chestXRayConcerning,
                UltrasoundConcerning: ultrasoundConcerning,
                CTConcerning: cTConcerning
            }),
        };

        const CQLDiagnosticInterpretation = executeSummaryCQLExpression(cqlExpressionParameters, 'DiagnosticInterpretation');

        expect(CQLDiagnosticInterpretation).toEqual(expectedDiagnosticInterpretation);
    });
});

describe('diagnostic interpretation with fhir repsonses', () => {
    const altLabResult = new LabResultBuilder().build();

    const creatinineLabResult = new LabResultBuilder().withCoding([{
        "system": "http://loinc.org",
        "display" : "CREATININE",
        "code" : "2160-0"
    }]).build();

    const ddimerLabResult = new LabResultBuilder().withCoding([
        {
            "system": "http://loinc.org",
            "display" : "DDIMER",
            "code": "7799-0"
        }
    ]).build();

    const astLabResult = new LabResultBuilder().withCoding([
        {
            "system": "http://loinc.org",
            "code": "1920-8",
            "display": "AST"
        }
    ]).withReferenceRanges([{
        "low" : {
            "code" : "U/L",
            "value" : 10.0,
            "system" : "http://unitsofmeasure.org",
            "unit" : "U/L"
        },
        "high" : {
            "code" : "U/L",
            "value" : 35.0,
            "system" : "http://unitsofmeasure.org",
            "unit" : "U/L"
        }
    }]).withValueQuantity({
        "value" : 36.0,
        "unit" : "U/L"
    }).build();



    test('Concerning lab count for diagnostic interpretation ',() => {


        const concerningLabCount: DiagnosticSummary = executeSummaryNoParams('ConcerningLabCount', [
            altLabResult,
            creatinineLabResult,
            ddimerLabResult,
            astLabResult
            ]
        ) as DiagnosticSummary;

        expect(concerningLabCount).toEqual(1);
    })

})
