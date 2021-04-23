import ObservationBuilder from './ObservationBuilder';
import { Resource } from "../../../types/resource";

class TemperatureBuilder extends ObservationBuilder {
  temperateValue = 103;

  public withTemperatureValue(value: number): TemperatureBuilder {
    this.temperateValue = value;
    return this;
  }

  public build() : Resource {
    return {
      resource: {
        resourceType: 'Observation',
        id: this.observationId,
        meta: { versionId: '2', lastUpdated: '2021-02-04T20:45:18.000+00:00', source: '#Fmjld4SNlDbUS87E' },
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
    code: { coding: [{ system: 'http://loinc.org', code: '8310-5', display: 'Body temperature' }], text: 'Body temperature' },
        subject: { reference: `Patient/${this.patient}` },
        effectiveDateTime: this.effectiveDateTime,
        valueQuantity: {
          value: this.temperateValue, unit: '[degF]', system: 'http://unitsofmeasure.org', code: '[degF]',
        },
      },
    };
  }
}

export default TemperatureBuilder;
