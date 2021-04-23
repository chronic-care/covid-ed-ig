import ObservationBuilder from './ObservationBuilder';
import { Resource } from "../../../types/resource";

class OxygenSaturationBuilder extends ObservationBuilder {
  oxygenSaturationValue = 96;

  public withOxygenSaturationValue(value: number): OxygenSaturationBuilder {
    this.oxygenSaturationValue = value;
    return this;
  }

  public build(): Resource {
    return {
      resource: {
        resourceType: 'Observation',
        id: this.observationId,
        meta: {
          versionId: '1',
          lastUpdated: '2021-02-04T18:02:27.000+00:00',
          source: '#D7Yi1dW2FyEbJn5U',
          profile: [
            'http://hl7.org/fhir/StructureDefinition/vitalsigns',
          ],
        },
        status: this.status,
        category: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/observation-category',
                code: 'vital-signs',
              },
            ],
            text: 'Vital Signs',
          },
        ],
        code: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '2708-6',
              display: 'Oxygen saturation in Arterial blood',
            },
          ],
        },
        subject: {
          reference: `Patient/${this.patient}`,
        },
        effectiveDateTime: this.effectiveDateTime,
        valueQuantity: {
          value: this.oxygenSaturationValue,
          unit: '%',
          system: 'http://unitsofmeasure.org',
          code: '%',
        },
      },
    };
  }
}

export default OxygenSaturationBuilder;
