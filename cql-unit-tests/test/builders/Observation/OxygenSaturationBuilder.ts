import ObservationBuilder from './ObservationBuilder';
import { Resource } from "../../../types/resource";
import { IObservation } from "@ahryman40k/ts-fhir-types/lib/R4/Resource/RTTI_Observation";

class OxygenSaturationBuilder extends ObservationBuilder {
  oxygenSaturationValue = 96;

  public withOxygenSaturationValue(value: number): OxygenSaturationBuilder {
    this.oxygenSaturationValue = value;
    return this;
  }

  public build(): IObservation {
    return {
        resourceType: 'Observation',
        id: this.observationId,
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
    };
  }
}

export default OxygenSaturationBuilder;
