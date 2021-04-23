import ObservationBuilder from './ObservationBuilder';
import { Resource } from "../../../types/resource";
import { IObservation } from "@ahryman40k/ts-fhir-types/lib/R4/Resource/RTTI_Observation";

class HeartRateBuilder extends ObservationBuilder {
  heartRateValue = 90;

  public withHeartRateValue(value: number): HeartRateBuilder {
    this.heartRateValue = value;
    return this;
  }

  public build() : IObservation {
    return {
        resourceType: 'Observation',
        id: this.observationId,
        status: this.status,
        category: [{
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/observation-category',
              code: 'vital-signs',
              display: 'Vital Signs',
            }],
          text: 'Vital Signs',
        }],
        code: { coding: [{ system: 'http://loinc.org', code: '8867-4', display: 'Heart rate' }], text: 'Heart rate' },
        subject: { reference: `Patient/${this.patient}` },
        effectiveDateTime: this.effectiveDateTime,
        valueQuantity: {
          value: this.heartRateValue, unit: '/min', system: 'http://unitsofmeasure.org', code: '/min',
        },
    };
  }
}

export default HeartRateBuilder;
