import { Resource } from '../../../types/resource';
import ObservationBuilder from './ObservationBuilder';

class RespiratoryRateBuilder extends ObservationBuilder {
  respiratoryRateValue = 22;

  public withRespiratoryRateValue(value: number): RespiratoryRateBuilder {
    this.respiratoryRateValue = value;
    return this;
  }

  public build(): Resource {
    return {
      resource: {
        resourceType: 'Observation',
        id: this.observationId,
        meta:
          {
            versionId: '1',
            lastUpdated:
              '2021-02-04T20:43:02.000+00:00',
            source:
              '#bmxUXAKqXHWNaIXj',
          },
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
          }
        ,
      },
    };
  }
}

export default RespiratoryRateBuilder;
