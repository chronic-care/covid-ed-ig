import { LabResultBuilder } from "./builders/Observation/LabResult";
import { Diagnostic, DiagnosticSummary } from "../types/summary";
import { executeSummaryNoParams } from "../helpers/cqlService";

const yesterday = new Date().getTime() - 24 * 60 * 60 * 1000;
const tenSeconds = 10 * 1000;
const twentySeconds = 20 * 1000;

describe('diagnostic summary with fhir resources', () => {
    test('obtains latest ALT Lab Result in Diagnostic Summary Section', () => {
        const oldestDate = new Date(yesterday);
        const middleDate = new Date(yesterday + tenSeconds);
        const newestDate = new Date(yesterday + twentySeconds);

        const oldestLabResult = new LabResultBuilder()
            .withId('oldie')
            .withEffectiveDateTime(oldestDate.toISOString())
            .build();

        const middleLabResult = new LabResultBuilder()
            .withId('middle')
            .withEffectiveDateTime(middleDate.toISOString())
            .build();

        const newestLabResult = new LabResultBuilder()
            .withId('newer')
            .withEffectiveDateTime(newestDate.toISOString())
            .build();

        const expectedLabResult: Diagnostic = {
            Date: newestDate.toISOString(),
            Flag: false,
            Interpretation: null,
            Name: newestLabResult.code.coding![0].display!,
            ReferenceRange: "9 - 46",
            ResultText: `${newestLabResult.valueQuantity!.value} ${newestLabResult.valueQuantity!.unit}`,
            ResultUnits: newestLabResult.valueQuantity!.unit!,
            ResultValue: newestLabResult.valueQuantity!.value!
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
        const oldestDate = new Date(yesterday);
        const middleDate = new Date(yesterday + tenSeconds);
        const newestDate = new Date(yesterday + twentySeconds);

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

        const oldestLabResult = new LabResultBuilder()
            .withId('oldie')
            .withCoding(coding)
            .withEffectiveDateTime(oldestDate.toISOString())
            .withReferenceRanges(referenceRange)
            .build();

        const middleLabResult = new LabResultBuilder()
            .withId('middle')
            .withCoding(coding)
            .withEffectiveDateTime(middleDate.toISOString())
            .withReferenceRanges(referenceRange)
            .build();

        const newestLabResult = new LabResultBuilder()
            .withId('newer')
            .withCoding(coding)
            .withEffectiveDateTime(newestDate.toISOString())
            .withReferenceRanges(referenceRange)
            .build();

        const expectedLabResult: Diagnostic = {
            Date: newestDate.toISOString(),
            Flag: false,
            Interpretation: null,
            Name: newestLabResult.code.coding![0].display!,
            ReferenceRange: "10 - 35",
            ResultText: `${newestLabResult.valueQuantity!.value} ${newestLabResult.valueQuantity!.unit}`,
            ResultUnits: newestLabResult.valueQuantity!.unit!,
            ResultValue: newestLabResult.valueQuantity!.value!
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

   
    test('obtains latest CRP Lab Result in Diagnostic Summary Section', () => {
        const oldestDate = new Date(yesterday);
        const middleDate = new Date(yesterday + tenSeconds);
        const newestDate = new Date(yesterday + twentySeconds);

        const coding = [
            {
                "system": "http://loinc.org",
                "display" : "CRP",
                "code": "1988-5"
            }
        ]

        const oldestLabResult = new LabResultBuilder()
            .withId('oldie')
            .withCoding(coding)
            .withEffectiveDateTime(oldestDate.toISOString())
            .build();

        const middleLabResult = new LabResultBuilder()
            .withId('middle')
            .withCoding(coding)
            .withEffectiveDateTime(middleDate.toISOString())
            .build();

        const newestLabResult = new LabResultBuilder()
            .withId('newer')
            .withCoding(coding)
            .withEffectiveDateTime(newestDate.toISOString())
            .build();

        const expectedLabResult: Diagnostic = {
            Date: newestDate.toISOString(),
            Flag: false,
            Interpretation: null,
            Name: newestLabResult.code.coding![0].display!,
            ReferenceRange: "",
            ResultText: `${newestLabResult.valueQuantity!.value} ${newestLabResult.valueQuantity!.unit}`,
            ResultUnits: newestLabResult.valueQuantity!.unit!,
            ResultValue: newestLabResult.valueQuantity!.value!
        }

        const diagnosticSummary: DiagnosticSummary = executeSummaryNoParams('DiagnosticSummary', [
                oldestLabResult,
                middleLabResult,
                newestLabResult,
            ]
        ) as DiagnosticSummary;


        const retrievedCrp = diagnosticSummary.CRP;

        expect(retrievedCrp).not.toBeNull();
        expect(retrievedCrp!.Flag).toEqual(expectedLabResult.Flag);
        expect(retrievedCrp!.Interpretation).toEqual(expectedLabResult.Interpretation);
        expect(retrievedCrp!.Name).toEqual(expectedLabResult.Name);
        expect(retrievedCrp!.ResultText).toEqual(expectedLabResult.ResultText);
        expect(Date.parse(retrievedCrp!.Date)).toEqual(Date.parse(expectedLabResult.Date));
    });

    test('obtains latest DDimer Lab Result in Diagnostic Summary Section', () => {
        const oldestDate = new Date(yesterday);
        const middleDate = new Date(yesterday + tenSeconds);
        const newestDate = new Date(yesterday + twentySeconds);

        const coding = [
            {
                "system": "http://loinc.org",
                "display" : "DDIMER",
                "code": "48066-5"
            }
        ]

        const oldestLabResult = new LabResultBuilder()
            .withId('oldie')
            .withCoding(coding)
            .withEffectiveDateTime(oldestDate.toISOString())
            .build();

        const middleLabResult = new LabResultBuilder()
            .withId('middle')
            .withCoding(coding)
            .withEffectiveDateTime(middleDate.toISOString())
            .build();

        const newestLabResult = new LabResultBuilder()
            .withId('newer')
            .withCoding(coding)
            .withEffectiveDateTime(newestDate.toISOString())
            .build();

        const expectedLabResult: Diagnostic = {
            Date: newestDate.toISOString(),
            Flag: false,
            Interpretation: null,
            Name: newestLabResult.code.coding![0].display!,
            ReferenceRange: "",
            ResultText: `${newestLabResult.valueQuantity!.value} ${newestLabResult.valueQuantity!.unit}`,
            ResultUnits: newestLabResult.valueQuantity!.unit!,
            ResultValue: newestLabResult.valueQuantity!.value!
        }

        const diagnosticSummary: DiagnosticSummary = executeSummaryNoParams('DiagnosticSummary', [
                oldestLabResult,
                middleLabResult,
                newestLabResult,
            ]
        ) as DiagnosticSummary;


        const retrievedDDimer = diagnosticSummary.DDimer;

        expect(retrievedDDimer).not.toBeNull();
        expect(retrievedDDimer!.Flag).toEqual(expectedLabResult.Flag);
        expect(retrievedDDimer!.Interpretation).toEqual(expectedLabResult.Interpretation);
        expect(retrievedDDimer!.Name).toEqual(expectedLabResult.Name);
        expect(retrievedDDimer!.ResultText).toEqual(expectedLabResult.ResultText);
        expect(Date.parse(retrievedDDimer!.Date)).toEqual(Date.parse(expectedLabResult.Date));
    });

    test('obtains latest Ferritin Lab Result in Diagnostic Summary Section', () => {
        const oldestDate = new Date(yesterday);
        const middleDate = new Date(yesterday + tenSeconds);
        const newestDate = new Date(yesterday + twentySeconds);

        const coding = [
            {
                "system": "http://loinc.org",
                "display" : "FERRITIN",
                "code": "2276-4"
            }
        ]

        const oldestLabResult = new LabResultBuilder()
            .withId('oldie')
            .withCoding(coding)
            .withEffectiveDateTime(oldestDate.toISOString())
            .build();

        const middleLabResult = new LabResultBuilder()
            .withId('middle')
            .withCoding(coding)
            .withEffectiveDateTime(middleDate.toISOString())
            .build();

        const newestLabResult = new LabResultBuilder()
            .withId('newer')
            .withCoding(coding)
            .withEffectiveDateTime(newestDate.toISOString())
            .build();

        const expectedLabResult: Diagnostic = {
            Date: newestDate.toISOString(),
            Flag: false,
            Interpretation: null,
            Name: newestLabResult.code.coding![0].display!,
            ReferenceRange: "",
            ResultText: `${newestLabResult.valueQuantity!.value} ${newestLabResult.valueQuantity!.unit}`,
            ResultUnits: newestLabResult.valueQuantity!.unit!,
            ResultValue: newestLabResult.valueQuantity!.value!
        }

        const diagnosticSummary: DiagnosticSummary = executeSummaryNoParams('DiagnosticSummary', [
                oldestLabResult,
                middleLabResult,
                newestLabResult,
            ]
        ) as DiagnosticSummary;


        const retrievedFerritin = diagnosticSummary.Ferritin;

        expect(retrievedFerritin).not.toBeNull();
        expect(retrievedFerritin!.Flag).toEqual(expectedLabResult.Flag);
        expect(retrievedFerritin!.Interpretation).toEqual(expectedLabResult.Interpretation);
        expect(retrievedFerritin!.Name).toEqual(expectedLabResult.Name);
        expect(retrievedFerritin!.ResultText).toEqual(expectedLabResult.ResultText);
        expect(Date.parse(retrievedFerritin!.Date)).toEqual(Date.parse(expectedLabResult.Date));
    });

    test('obtains latest LDH Lab Result in Diagnostic Summary Section', () => {
        const oldestDate = new Date(yesterday);
        const middleDate = new Date(yesterday + tenSeconds);
        const newestDate = new Date(yesterday + twentySeconds);

        const coding = [
            {
                "system": "http://loinc.org",
                "display" : "LDH",
                "code": "2532-0"
            }
        ]

        const oldestLabResult = new LabResultBuilder()
            .withId('oldie')
            .withCoding(coding)
            .withEffectiveDateTime(oldestDate.toISOString())
            .build();

        const middleLabResult = new LabResultBuilder()
            .withId('middle')
            .withCoding(coding)
            .withEffectiveDateTime(middleDate.toISOString())
            .build();

        const newestLabResult = new LabResultBuilder()
            .withId('newer')
            .withCoding(coding)
            .withEffectiveDateTime(newestDate.toISOString())
            .build();

        const expectedLabResult: Diagnostic = {
            Date: newestDate.toISOString(),
            Flag: false,
            Interpretation: null,
            Name: newestLabResult.code.coding![0].display!,
            ReferenceRange: "",
            ResultText: `${newestLabResult.valueQuantity!.value} ${newestLabResult.valueQuantity!.unit}`,
            ResultUnits: newestLabResult.valueQuantity!.unit!,
            ResultValue: newestLabResult.valueQuantity!.value!
        }

        const diagnosticSummary: DiagnosticSummary = executeSummaryNoParams('DiagnosticSummary', [
                oldestLabResult,
                middleLabResult,
                newestLabResult,
            ]
        ) as DiagnosticSummary;


        const retrievedLDH = diagnosticSummary.LDH;

        expect(retrievedLDH).not.toBeNull();
        expect(retrievedLDH!.Flag).toEqual(expectedLabResult.Flag);
        expect(retrievedLDH!.Interpretation).toEqual(expectedLabResult.Interpretation);
        expect(retrievedLDH!.Name).toEqual(expectedLabResult.Name);
        expect(retrievedLDH!.ResultText).toEqual(expectedLabResult.ResultText);
        expect(Date.parse(retrievedLDH!.Date)).toEqual(Date.parse(expectedLabResult.Date));
    });

    test('obtains latest Lymphopenia Lab Result in Diagnostic Summary Section', () => {
        const oldestDate = new Date(yesterday);
        const middleDate = new Date(yesterday + tenSeconds);
        const newestDate = new Date(yesterday + twentySeconds);

        const coding = [
            {
                "system": "http://loinc.org",
                "display" : "ABSOLUTE LYMPHOCYTES",
                "code" : "731-0"
            }
        ]

        const oldestLabResult = new LabResultBuilder()
            .withId('oldie')
            .withCoding(coding)
            .withEffectiveDateTime(oldestDate.toISOString())
            .build();

        const middleLabResult = new LabResultBuilder()
            .withId('middle')
            .withCoding(coding)
            .withEffectiveDateTime(middleDate.toISOString())
            .build();

        const newestLabResult = new LabResultBuilder()
            .withId('newer')
            .withCoding(coding)
            .withEffectiveDateTime(newestDate.toISOString())
            .build();

        const expectedLabResult: Diagnostic = {
            Date: newestDate.toISOString(),
            Flag: false,
            Interpretation: null,
            Name: newestLabResult.code.coding![0].display!,
            ReferenceRange: "",
            ResultText: `${newestLabResult.valueQuantity!.value} ${newestLabResult.valueQuantity!.unit}`,
            ResultUnits: newestLabResult.valueQuantity!.unit!,
            ResultValue: newestLabResult.valueQuantity!.value!
        }

        const diagnosticSummary: DiagnosticSummary = executeSummaryNoParams('DiagnosticSummary', [
                oldestLabResult,
                middleLabResult,
                newestLabResult,
            ]
        ) as DiagnosticSummary;


        const retrievedLymphopenia = diagnosticSummary.Lymphopenia;

        expect(retrievedLymphopenia).not.toBeNull();
        expect(retrievedLymphopenia!.Flag).toEqual(expectedLabResult.Flag);
        expect(retrievedLymphopenia!.Interpretation).toEqual(expectedLabResult.Interpretation);
        expect(retrievedLymphopenia!.Name).toEqual(expectedLabResult.Name);
        expect(retrievedLymphopenia!.ResultText).toEqual(expectedLabResult.ResultText);
        expect(Date.parse(retrievedLymphopenia!.Date)).toEqual(Date.parse(expectedLabResult.Date));
    });

    test('obtains latest Neutrophils Lab Result in Diagnostic Summary Section', () => {
        const oldestDate = new Date(yesterday);
        const middleDate = new Date(yesterday + tenSeconds);
        const newestDate = new Date(yesterday + twentySeconds);

        const coding = [
            {
                "system": "http://loinc.org",
                "code": "751-8",
                "display": "Neutrophils [#/volume] in Blood by Automated count"
            }
        ]

        const oldestLabResult = new LabResultBuilder()
            .withId('oldie')
            .withCoding(coding)
            .withEffectiveDateTime(oldestDate.toISOString())
            .build();

        const middleLabResult = new LabResultBuilder()
            .withId('middle')
            .withCoding(coding)
            .withEffectiveDateTime(middleDate.toISOString())
            .build();

        const newestLabResult = new LabResultBuilder()
            .withId('newer')
            .withCoding(coding)
            .withEffectiveDateTime(newestDate.toISOString())
            .build();

        const expectedLabResult: Diagnostic = {
            Date: newestDate.toISOString(),
            Flag: false,
            Interpretation: null,
            Name: newestLabResult.code.coding![0].display!,
            ReferenceRange: "",
            ResultText: `${newestLabResult.valueQuantity!.value} ${newestLabResult.valueQuantity!.unit}`,
            ResultUnits: newestLabResult.valueQuantity!.unit!,
            ResultValue: newestLabResult.valueQuantity!.value!
        }

        const diagnosticSummary: DiagnosticSummary = executeSummaryNoParams('DiagnosticSummary', [
                oldestLabResult,
                middleLabResult,
                newestLabResult,
            ]
        ) as DiagnosticSummary;


        const retrievedNeutrophils = diagnosticSummary.Neutrophils;

        expect(retrievedNeutrophils).not.toBeNull();
        expect(retrievedNeutrophils!.Flag).toEqual(expectedLabResult.Flag);
        expect(retrievedNeutrophils!.Interpretation).toEqual(expectedLabResult.Interpretation);
        expect(retrievedNeutrophils!.Name).toEqual(expectedLabResult.Name);
        expect(retrievedNeutrophils!.ResultText).toEqual(expectedLabResult.ResultText);
        expect(Date.parse(retrievedNeutrophils!.Date)).toEqual(Date.parse(expectedLabResult.Date));
    });

    
    test('obtains latest Procalcitonin Lab Result in Diagnostic Summary Section', () => {
        const oldestDate = new Date(yesterday);
        const middleDate = new Date(yesterday + tenSeconds);
        const newestDate = new Date(yesterday + twentySeconds);

        const coding = [
            {
                "system": "http://loinc.org",
                "display" : "PCT",
                "code" : "33959-8"
            }
        ]

        const oldestLabResult = new LabResultBuilder()
            .withId('oldie')
            .withCoding(coding)
            .withEffectiveDateTime(oldestDate.toISOString())
            .build();

        const middleLabResult = new LabResultBuilder()
            .withId('middle')
            .withCoding(coding)
            .withEffectiveDateTime(middleDate.toISOString())
            .build();

        const newestLabResult = new LabResultBuilder()
            .withId('newer')
            .withCoding(coding)
            .withEffectiveDateTime(newestDate.toISOString())
            .build();

        const expectedLabResult: Diagnostic = {
            Date: newestDate.toISOString(),
            Flag: false,
            Interpretation: null,
            Name: newestLabResult.code.coding![0].display!,
            ReferenceRange: "",
            ResultText: `${newestLabResult.valueQuantity!.value} ${newestLabResult.valueQuantity!.unit}`,
            ResultUnits: newestLabResult.valueQuantity!.unit!,
            ResultValue: newestLabResult.valueQuantity!.value!
        }

        const diagnosticSummary: DiagnosticSummary = executeSummaryNoParams('DiagnosticSummary', [
                oldestLabResult,
                middleLabResult,
                newestLabResult,
            ]
        ) as DiagnosticSummary;


        const retrievedPCT = diagnosticSummary.PCT;

        expect(retrievedPCT).not.toBeNull();
        expect(retrievedPCT!.Flag).toEqual(expectedLabResult.Flag);
        expect(retrievedPCT!.Interpretation).toEqual(expectedLabResult.Interpretation);
        expect(retrievedPCT!.Name).toEqual(expectedLabResult.Name);
        expect(retrievedPCT!.ResultText).toEqual(expectedLabResult.ResultText);
        expect(Date.parse(retrievedPCT!.Date)).toEqual(Date.parse(expectedLabResult.Date));
    });

    test('obtains latest Immune dysregulation Lab Result in Diagnostic Summary Section', () => {
        const oldestDate = new Date(yesterday);
        const middleDate = new Date(yesterday + tenSeconds);
        const newestDate = new Date(yesterday + twentySeconds);

        const coding = [
            {
                "system": "http://loinc.org",
                "display" : "Immunedysregulation",
                "code" : "34407-7"
            }
        ]

        const oldestLabResult = new LabResultBuilder()
            .withId('oldie')
            .withCoding(coding)
            .withEffectiveDateTime(oldestDate.toISOString())
            .build();

        const middleLabResult = new LabResultBuilder()
            .withId('middle')
            .withCoding(coding)
            .withEffectiveDateTime(middleDate.toISOString())
            .build();

        const newestLabResult = new LabResultBuilder()
            .withId('newer')
            .withCoding(coding)
            .withEffectiveDateTime(newestDate.toISOString())
            .build();

        const expectedLabResult: Diagnostic = {
            Date: newestDate.toISOString(),
            Flag: false,
            Interpretation: null,
            Name: newestLabResult.code.coding![0].display!,
            ReferenceRange: "",
            ResultText: `${newestLabResult.valueQuantity!.value} ${newestLabResult.valueQuantity!.unit}`,
            ResultUnits: newestLabResult.valueQuantity!.unit!,
            ResultValue: newestLabResult.valueQuantity!.value!
        }

        const diagnosticSummary: DiagnosticSummary = executeSummaryNoParams('DiagnosticSummary', [
                oldestLabResult,
                middleLabResult,
                newestLabResult,
            ]
        ) as DiagnosticSummary;


        const retrievedImmuneDysregulation = diagnosticSummary.ImmuneDysregulation;

        expect(retrievedImmuneDysregulation).not.toBeNull();
        expect(retrievedImmuneDysregulation!.Flag).toEqual(expectedLabResult.Flag);
        expect(retrievedImmuneDysregulation!.Interpretation).toEqual(expectedLabResult.Interpretation);
        expect(retrievedImmuneDysregulation!.Name).toEqual(expectedLabResult.Name);
        expect(retrievedImmuneDysregulation!.ResultText).toEqual(expectedLabResult.ResultText);
        expect(Date.parse(retrievedImmuneDysregulation!.Date)).toEqual(Date.parse(expectedLabResult.Date));
    });
});
