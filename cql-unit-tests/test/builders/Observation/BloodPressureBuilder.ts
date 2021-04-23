import ObservationBuilder from './ObservationBuilder';
import { Resource } from "../../../types/resource";
import { NarrativeStatusKind } from "@ahryman40k/ts-fhir-types/lib/R4";
import { IObservation } from "@ahryman40k/ts-fhir-types/lib/R4/Resource/RTTI_Observation";

class BloodPressureBuilder extends ObservationBuilder {
  systolicValue = 120;

  diastolicValue = 120;

  public withSystolicValue(value: number): BloodPressureBuilder {
    this.systolicValue = value;
    return this;
  }

  public withDiastolicValue(value: number): BloodPressureBuilder {
    this.diastolicValue = value;
    return this;
  }

  public build(): IObservation {
    return {
        resourceType: 'Observation',
        id: this.observationId,
        text: { status: NarrativeStatusKind._generated, div: '<div xmlns="http://www.w3.org/1999/xhtml">Blood pressure</div>' },
        status: this.status,
        category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'vital-signs' }], text: 'Vital Signs' }],
        code: { coding: [{ system: 'http://loinc.org', code: '85354-9', display: 'Blood pressure systolic and diastolic' }] },
        subject: { reference: `Patient/${this.patient}` },
        effectiveDateTime: this.effectiveDateTime,
        performer: [{ reference: 'Practitioner/va-prac-visn6-francis', display: 'Dr. Francis, MD' }],
        bodySite: { coding: [{ system: 'http://snomed.info/sct', code: '368209003', display: 'Right arm' }] },
        component: [{
          code: { coding: [{ system: 'http://loinc.org', code: '8480-6', display: 'Systolic blood pressure' }] },
          valueQuantity: {
            value: this.systolicValue, unit: 'mmHg', system: 'http://unitsofmeasure.org', code: 'mm[Hg]',
          },
        }, {
          code: { coding: [{ system: 'http://loinc.org', code: '8462-4', display: 'Diastolic blood pressure' }] },
          valueQuantity: {
            value: this.diastolicValue, unit: 'mmHg', system: 'http://unitsofmeasure.org', code: 'mm[Hg]',
          },
        }],
    };
  }
}

export default BloodPressureBuilder;
