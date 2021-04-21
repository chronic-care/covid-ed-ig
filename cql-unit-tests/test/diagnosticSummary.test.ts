import { Resource } from "../types/resource";
import { LabResultBuilder } from "./builders/Observation/LabResult";
import { Diagnostic, DiagnosticSummary } from "../types/summary";
import { executeSummaryNoParams } from "../helpers/cqlService";

describe('diagnostic interpretation with fhir resources', () => {
    test('obtains latest ALT Lab Result in Diagnostic Summary Section', () => {

        const oldestSeconds = 10;

        const oldestDate = new Date(2020, 10, 10, 1, 30, oldestSeconds);
        const middleDate = new Date(2020, 10, 10, 1, 30, oldestSeconds + 10);
        const newestDate = new Date(2020, 10, 10, 1, 30, oldestSeconds + 20);

        const oldestLabResult: Resource = new LabResultBuilder()
            .withId('oldie')
            .withEffectiveDateTime(oldestDate.toISOString())
            .build();

        const middleLabResult: Resource = new LabResultBuilder()
            .withId('middle')
            .withEffectiveDateTime(middleDate.toISOString())
            .build();

        const newestLabResult: Resource = new LabResultBuilder()
            .withId('newer')
            .withEffectiveDateTime(newestDate.toISOString())
            .build();

        const expectedLabResult: Diagnostic = {
            Date: newestDate.toISOString(),
            Flag: false,
            Interpretation: null,
            Name: newestLabResult.resource.code.coding![0].display!,
            ReferenceRange: "9 - 46",
            ResultText: `${newestLabResult.resource.valueQuantity!.value} ${newestLabResult.resource.valueQuantity!.unit}`,
            ResultUnits: newestLabResult.resource.valueQuantity!.unit!,
            ResultValue: newestLabResult.resource.valueQuantity!.value!
        }

        const diagnosticSummary: DiagnosticSummary = executeSummaryNoParams('DiagnosticSummary', [
                oldestLabResult,
                middleLabResult,
                newestLabResult,
            ]
        ) as DiagnosticSummary;


        const retrievedAlt = diagnosticSummary.ALT;

        expect(retrievedAlt).not.toBeNull();
        expect(retrievedAlt!.Flag).toEqual(expectedLabResult.Flag);
        expect(retrievedAlt!.Interpretation).toEqual(expectedLabResult.Interpretation);
        expect(retrievedAlt!.Name).toEqual(expectedLabResult.Name);
        expect(retrievedAlt!.ReferenceRange).toEqual(expectedLabResult.ReferenceRange);
        expect(retrievedAlt!.ResultText).toEqual(expectedLabResult.ResultText);
        expect(retrievedAlt!.ResultUnits).toEqual(expectedLabResult.ResultUnits);
        expect(retrievedAlt!.ResultValue).toEqual(expectedLabResult.ResultValue);
        expect(Date.parse(retrievedAlt!.Date)).toEqual(Date.parse(expectedLabResult.Date));
    });

    test('obtains latest AST Lab Result in Diagnostic Summary Section', () => {

        const oldestSeconds = 10;

        const oldestDate = new Date(2020, 10, 10, 1, 30, oldestSeconds);
        const middleDate = new Date(2020, 10, 10, 1, 30, oldestSeconds + 10);
        const newestDate = new Date(2020, 10, 10, 1, 30, oldestSeconds + 20);
        const referenceRange = [{
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
        }];
        const coding = [
            {
                "system": "http://loinc.org",
                "code": "1920-8",
                "display": "AST"
            }
        ]

        const oldestLabResult: Resource = new LabResultBuilder()
            .withId('oldie')
            .withCoding(coding)
            .withEffectiveDateTime(oldestDate.toISOString())
            .withReferenceRanges(referenceRange)
            .build();

        const middleLabResult: Resource = new LabResultBuilder()
            .withId('middle')
            .withCoding(coding)
            .withEffectiveDateTime(middleDate.toISOString())
            .withReferenceRanges(referenceRange)
            .build();

        const newestLabResult: Resource = new LabResultBuilder()
            .withId('newer')
            .withCoding(coding)
            .withEffectiveDateTime(newestDate.toISOString())
            .withReferenceRanges(referenceRange)
            .build();

        const expectedLabResult: Diagnostic = {
            Date: newestDate.toISOString(),
            Flag: false,
            Interpretation: null,
            Name: newestLabResult.resource.code.coding![0].display!,
            ReferenceRange: "10 - 35",
            ResultText: `${newestLabResult.resource.valueQuantity!.value} ${newestLabResult.resource.valueQuantity!.unit}`,
            ResultUnits: newestLabResult.resource.valueQuantity!.unit!,
            ResultValue: newestLabResult.resource.valueQuantity!.value!
        }

        const diagnosticSummary: DiagnosticSummary = executeSummaryNoParams('DiagnosticSummary', [
                oldestLabResult,
                middleLabResult,
                newestLabResult,
            ]
        ) as DiagnosticSummary;


        const retrievedAst = diagnosticSummary.AST;

        expect(retrievedAst).not.toBeNull();
        expect(retrievedAst!.Flag).toEqual(expectedLabResult.Flag);
        expect(retrievedAst!.Interpretation).toEqual(expectedLabResult.Interpretation);
        expect(retrievedAst!.Name).toEqual(expectedLabResult.Name);
        expect(retrievedAst!.ReferenceRange).toEqual(expectedLabResult.ReferenceRange);
        expect(retrievedAst!.ResultText).toEqual(expectedLabResult.ResultText);
        expect(retrievedAst!.ResultUnits).toEqual(expectedLabResult.ResultUnits);
        expect(retrievedAst!.ResultValue).toEqual(expectedLabResult.ResultValue);
        expect(Date.parse(retrievedAst!.Date)).toEqual(Date.parse(expectedLabResult.Date));
    });

    test('obtains latest Creatinine Lab Result in Diagnostic Summary Section', () => {

        const oldestSeconds = 10;

        const oldestDate = new Date(2020, 10, 10, 1, 30, oldestSeconds);
        const middleDate = new Date(2020, 10, 10, 1, 30, oldestSeconds + 10);
        const newestDate = new Date(2020, 10, 10, 1, 30, oldestSeconds + 20);
        const referenceRange = [
            {
                "low" : {
                    "code" : "mg/dL",
                    "value" : 0.7,
                    "system" : "http://unitsofmeasure.org",
                    "unit" : "mg/dL"
                },
                "high" : {
                    "code" : "mg/dL",
                    "value" : 1.25,
                    "system" : "http://unitsofmeasure.org",
                    "unit" : "mg/dL"
                }
            }
        ];
        const coding = [
            {
                "system": "http://loinc.org",
                "display" : "CREATININE",
                "code" : "2160-0"
            }
        ]

        const oldestLabResult: Resource = new LabResultBuilder()
            .withId('oldie')
            .withCoding(coding)
            .withEffectiveDateTime(oldestDate.toISOString())
            .withValueQuantity({
                "value" : 1.5,
                "unit" : "mg/dL"
            })
            .withReferenceRanges(referenceRange)
            .build();

        const middleLabResult: Resource = new LabResultBuilder()
            .withId('middle')
            .withCoding(coding)
            .withValueQuantity({
                "value" : 1.37,
                "unit" : "mg/dL"
            })
            .withEffectiveDateTime(middleDate.toISOString())
            .withReferenceRanges(referenceRange)
            .build();

        const newestLabResult: Resource = new LabResultBuilder()
            .withId('newer')
            .withCoding(coding)
            .withValueQuantity({
                "value" : 1.1,
                "unit" : "mg/dL"
            })
            .withEffectiveDateTime(newestDate.toISOString())
            .withReferenceRanges(referenceRange)
            .build();

        const expectedLabResult: Diagnostic = {
            Date: newestDate.toISOString(),
            Flag: false,
            Interpretation: null,
            Name: newestLabResult.resource.code.coding![0].display!,
            ReferenceRange: "0.7 - 1.25",
            ResultText: `${newestLabResult.resource.valueQuantity!.value} ${newestLabResult.resource.valueQuantity!.unit}`,
            ResultUnits: newestLabResult.resource.valueQuantity!.unit!,
            ResultValue: newestLabResult.resource.valueQuantity!.value!
        }

        const diagnosticSummary: DiagnosticSummary = executeSummaryNoParams('DiagnosticSummary', [
                oldestLabResult,
                middleLabResult,
                newestLabResult,
            ]
        ) as DiagnosticSummary;


        const retrievedCreatinine = diagnosticSummary.Creatinine;

        expect(retrievedCreatinine).not.toBeNull();
        expect(retrievedCreatinine!.Flag).toEqual(expectedLabResult.Flag);
        expect(retrievedCreatinine!.Interpretation).toEqual(expectedLabResult.Interpretation);
        expect(retrievedCreatinine!.Name).toEqual(expectedLabResult.Name);
        expect(retrievedCreatinine!.ReferenceRange).toEqual(expectedLabResult.ReferenceRange);
        expect(retrievedCreatinine!.ResultText).toEqual(expectedLabResult.ResultText);
        expect(retrievedCreatinine!.ResultUnits).toEqual(expectedLabResult.ResultUnits);
        expect(retrievedCreatinine!.ResultValue).toEqual(expectedLabResult.ResultValue);
        expect(Date.parse(retrievedCreatinine!.Date)).toEqual(Date.parse(expectedLabResult.Date));
    });

});