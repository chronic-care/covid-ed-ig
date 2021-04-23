import { IObservation, IObservation_ReferenceRange, ObservationStatusKind } from "@ahryman40k/ts-fhir-types/lib/R4";
import { IQuantity } from "@ahryman40k/ts-fhir-types/lib/R4/Resource/RTTI_Quantity";
import { ICoding } from "@ahryman40k/ts-fhir-types/lib/R4/Resource/RTTI_Coding";
import { Resource } from "../../../types/resource";

export class LabResultBuilder {
    private id: string = "va-obs-dan-lab-alt";
    private status: ObservationStatusKind = ObservationStatusKind._final;
    private subject: string = "Patient/va-pat-dan";
    private effectiveDateTime: string = new Date().toISOString();
    private coding: ICoding[] = [{"system": "http://loinc.org","code": "1742-6","display": "ALT"}]
    private valueQuantity: IQuantity = {unit: "U/L", value: 25}
    private referenceRanges: IObservation_ReferenceRange[] = [{
        high: {code: "U/L", system: "http://unitsofmeasure.org", unit: "U/L", value: 46},
        low: {code: "U/L", system: "http://unitsofmeasure.org", unit: "U/L", value: 9}
    }]

    public withId = (id: string) => {
        this.id = id;
        return this;
    }

    public withStatus = (status: ObservationStatusKind) => {
        this.status = status
        return this;
    }

    public withSubject = (subject: string) => {
        this.subject = subject
        return this;
    }

    public withEffectiveDateTime = (effectiveDateTimeISO: string) => {
        this.effectiveDateTime = effectiveDateTimeISO;
        return this;
    }

    public withCoding = (coding: ICoding[]) => {
        this.coding = coding;
        return this;
    }

    public withValueQuantity = (valueQuantity: IQuantity) => {
        this.valueQuantity = valueQuantity;
        return this;
    }

    public withReferenceRanges = (referenceRanges: IObservation_ReferenceRange[]) => {
        this.referenceRanges = referenceRanges;
        return this;
    }

    public build = (): Resource => {
        return {
            resource: {
                category: [{
                    coding: [{
                        code: "laboratory",
                        system: "http://terminology.hl7.org/CodeSystem/observation-category"
                    }], text: "Laboratory"
                }],
                code: {
                    coding: this.coding
                },
                effectiveDateTime: this.effectiveDateTime,
                id: this.id,
                performer: [{display: "Dr. Francis, MD", reference: "Practitioner/va-prac-visn6-francis"}],
                referenceRange: this.referenceRanges,
                resourceType: "Observation",
                status: this.status,
                subject: {reference: this.subject},
                valueQuantity: this.valueQuantity
            }
        }
    }
}

interface LabResult extends IObservation {
    resourceType: "Observation"
    status: ObservationStatusKind,
    id: string,
    category: [
        {
            coding: [
                {
                    "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                    "code": "laboratory"
                }
            ],
            text: "Laboratory"
        }
    ],
    "code": {
        coding: ICoding[],
    },
    subject: {
        reference: string
    },
    effectiveDateTime: string,
    "performer": [
        {
            "reference": "Practitioner/va-prac-visn6-francis",
            "display": "Dr. Francis, MD"
        }
    ],
    valueQuantity: IQuantity,
    referenceRange: IObservation_ReferenceRange[]
}
