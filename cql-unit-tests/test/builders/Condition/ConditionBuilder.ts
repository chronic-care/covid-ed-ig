import { ICondition } from "@ahryman40k/ts-fhir-types/lib/R4";

class ConditionBuilder {
    code: string;
    displayName: string;
    codeSystem: string;

    constructor(code: string, displayName: string) {
        this.code = code;
        this.displayName = displayName;
        this.codeSystem = "http://snomed.info/sct";
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
                        "system": this.codeSystem,
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

export default ConditionBuilder;
