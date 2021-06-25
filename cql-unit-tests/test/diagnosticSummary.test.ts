import { LabResultBuilder } from "./builders/Observation/LabResult";
import { Diagnostic, DiagnosticSummary } from "../types/summary";
import { executeSummaryNoParams } from "../helpers/cqlService";

describe('diagnostic summary with fhir resources', () => {
    test('obtains latest ALT Lab Result in Diagnostic Summary Section', () => {

        const oldestSeconds = 10;

        const oldestDate = new Date(2020, 10, 10, 1, 30, oldestSeconds);
        const middleDate = new Date(2020, 10, 10, 1, 30, oldestSeconds + 10);
        const newestDate = new Date(2020, 10, 10, 1, 30, oldestSeconds + 20);

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

        const oldestLabResult = new LabResultBuilder()
            .withId('oldie')
            .withCoding(coding)
            .withEffectiveDateTime(oldestDate.toISOString())
            .withValueQuantity({
                "value" : 1.5,
                "unit" : "mg/dL"
            })
            .withReferenceRanges(referenceRange)
            .build();

        const middleLabResult = new LabResultBuilder()
            .withId('middle')
            .withCoding(coding)
            .withValueQuantity({
                "value" : 1.37,
                "unit" : "mg/dL"
            })
            .withEffectiveDateTime(middleDate.toISOString())
            .withReferenceRanges(referenceRange)
            .build();

        const newestLabResult = new LabResultBuilder()
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
            Name: newestLabResult.code.coding![0].display!,
            ReferenceRange: "0.7 - 1.25",
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

    test('obtains latest CRP Lab Result in Diagnostic Summary Section', () => {

        const oldestSeconds = 10;

        const oldestDate = new Date(2020, 10, 10, 1, 30, oldestSeconds);
        const middleDate = new Date(2020, 10, 10, 1, 30, oldestSeconds + 10);
        const newestDate = new Date(2020, 10, 10, 1, 30, oldestSeconds + 20);
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

        const oldestSeconds = 10;

        const oldestDate = new Date(2020, 10, 10, 1, 30, oldestSeconds);
        const middleDate = new Date(2020, 10, 10, 1, 30, oldestSeconds + 10);
        const newestDate = new Date(2020, 10, 10, 1, 30, oldestSeconds + 20);
        const coding = [
            {
                "system": "http://loinc.org",
                "display" : "DDIMER",
                "code": "7799-0"
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

        const oldestSeconds = 10;

        const oldestDate = new Date(2020, 10, 10, 1, 30, oldestSeconds);
        const middleDate = new Date(2020, 10, 10, 1, 30, oldestSeconds + 10);
        const newestDate = new Date(2020, 10, 10, 1, 30, oldestSeconds + 20);
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

        const oldestSeconds = 10;

        const oldestDate = new Date(2020, 10, 10, 1, 30, oldestSeconds);
        const middleDate = new Date(2020, 10, 10, 1, 30, oldestSeconds + 10);
        const newestDate = new Date(2020, 10, 10, 1, 30, oldestSeconds + 20);
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

        const oldestSeconds = 10;

        const oldestDate = new Date(2020, 10, 10, 1, 30, oldestSeconds);
        const middleDate = new Date(2020, 10, 10, 1, 30, oldestSeconds + 10);
        const newestDate = new Date(2020, 10, 10, 1, 30, oldestSeconds + 20);
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

        const oldestSeconds = 10;

        const oldestDate = new Date(2020, 10, 10, 1, 30, oldestSeconds);
        const middleDate = new Date(2020, 10, 10, 1, 30, oldestSeconds + 10);
        const newestDate = new Date(2020, 10, 10, 1, 30, oldestSeconds + 20);
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

    test('obtains latest Thrombocytopenia Lab Result in Diagnostic Summary Section', () => {

        const oldestSeconds = 10;

        const oldestDate = new Date(2020, 10, 10, 1, 30, oldestSeconds);
        const middleDate = new Date(2020, 10, 10, 1, 30, oldestSeconds + 10);
        const newestDate = new Date(2020, 10, 10, 1, 30, oldestSeconds + 20);
        const coding = [
            {
                "system": "http://loinc.org",
                "display" : "PLATELET COUNT",
                "code" : "777-3"
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


        const retrievedThrombocytopenia = diagnosticSummary.Thrombocytopenia;

        expect(retrievedThrombocytopenia).not.toBeNull();
        expect(retrievedThrombocytopenia!.Flag).toEqual(expectedLabResult.Flag);
        expect(retrievedThrombocytopenia!.Interpretation).toEqual(expectedLabResult.Interpretation);
        expect(retrievedThrombocytopenia!.Name).toEqual(expectedLabResult.Name);
        expect(retrievedThrombocytopenia!.ResultText).toEqual(expectedLabResult.ResultText);
        expect(Date.parse(retrievedThrombocytopenia!.Date)).toEqual(Date.parse(expectedLabResult.Date));
    });

    test('obtains latest Troponin Lab Result in Diagnostic Summary Section', () => {

        const oldestSeconds = 10;

        const oldestDate = new Date(2020, 10, 10, 1, 30, oldestSeconds);
        const middleDate = new Date(2020, 10, 10, 1, 30, oldestSeconds + 10);
        const newestDate = new Date(2020, 10, 10, 1, 30, oldestSeconds + 20);
        const coding = [
            {
                "system": "http://loinc.org",
                "display" : "TROPONIN",
                "code" : "16255-2"
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


        const retrievedTroponin = diagnosticSummary.Troponin;

        expect(retrievedTroponin).not.toBeNull();
        expect(retrievedTroponin!.Flag).toEqual(expectedLabResult.Flag);
        expect(retrievedTroponin!.Interpretation).toEqual(expectedLabResult.Interpretation);
        expect(retrievedTroponin!.Name).toEqual(expectedLabResult.Name);
        expect(retrievedTroponin!.ResultText).toEqual(expectedLabResult.ResultText);
        expect(Date.parse(retrievedTroponin!.Date)).toEqual(Date.parse(expectedLabResult.Date));
    });

    test('obtains latest WBC Lab Result in Diagnostic Summary Section', () => {

        const oldestSeconds = 10;

        const oldestDate = new Date(2020, 10, 10, 1, 30, oldestSeconds);
        const middleDate = new Date(2020, 10, 10, 1, 30, oldestSeconds + 10);
        const newestDate = new Date(2020, 10, 10, 1, 30, oldestSeconds + 20);
        const coding = [
            {
                "system": "http://loinc.org",
                "display" : "LEUKOCYTE",
                "code" : "26464-8"
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


        const retrievedWbc = diagnosticSummary.WBC;

        expect(retrievedWbc).not.toBeNull();
        expect(retrievedWbc!.Flag).toEqual(expectedLabResult.Flag);
        expect(retrievedWbc!.Interpretation).toEqual(expectedLabResult.Interpretation);
        expect(retrievedWbc!.Name).toEqual(expectedLabResult.Name);
        expect(retrievedWbc!.ResultText).toEqual(expectedLabResult.ResultText);
        expect(Date.parse(retrievedWbc!.Date)).toEqual(Date.parse(expectedLabResult.Date));
    });
});
