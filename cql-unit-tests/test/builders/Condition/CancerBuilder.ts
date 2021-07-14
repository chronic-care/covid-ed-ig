import { ICondition } from "@ahryman40k/ts-fhir-types/lib/R4";

class CancerBuilder {
    code = "100721000119109";
    displayName = "High grade astrocytoma of brain (disorder)";
    codesystem = "http://snomed.info/sct";

    public withCancerCode(code: string, displayName: string, codesystem: string): CancerBuilder {
        this.code = code;
        this.displayName = displayName;
        return this;
    }

    public build(): ICondition {
        return {
            "resourceType": "Condition",
            "id": "smart-Condition-128",
            "clinicalStatus": {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
                        "code": "active",
                        "display": "Active"
                    }
                ],
                "text": "Active"
            },
            "verificationStatus": {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/condition-ver-status",
                        "code": "confirmed",
                        "display": "Confirmed"
                    }
                ],
                "text": "Confirmed"
            },
            "code": {
                "coding": [
                    {
                        "system": this.codesystem,
                        "code": this.code,
                        "display": this.displayName
                    }
                ],
                "text": this.displayName
            },
            "subject": {
                "reference": "Patient/va-pat-dan"
            },
            "onsetDateTime": "2006-01-14"
        };
    }
}

export default CancerBuilder;
