import { Resource } from '../../../types/resource';
import ObservationBuilder from './ObservationBuilder';
import { IObservation } from "@ahryman40k/ts-fhir-types/lib/R4/Resource/RTTI_Observation";

class RespiratoryRateBuilder extends ObservationBuilder {
  respiratoryRateValue = 22;

  public withRespiratoryRateValue(value: number): RespiratoryRateBuilder {
    this.respiratoryRateValue = value;
    return this;
  }

  public build(): IObservation {
    return {
        resourceType: 'Observation',
        id: this.observationId,
        status: this.status,
        category:
          [
            {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/observation-category',
                  code: 'vital-signs',
                  display: 'Vital Signs',
                },
              ],
              text: 'Vital Signs',
            },
          ],
        code:
          {
            coding: [
              {
                system: 'http://loinc.org',
                code: '9279-1',
                display: 'Respiratory rate',
              },
            ],
            text:
              'Respiratory rate',
          },
        subject: {
          reference: `Patient/${this.patient}`,
        },
        effectiveDateTime: this.effectiveDateTime,
        valueQuantity:
          {
            value: this.respiratoryRateValue,
            unit: '/min',
            system: 'http://unitsofmeasure.org',
            code: '/min',
          },
    };
  }
}

export default RespiratoryRateBuilder;
