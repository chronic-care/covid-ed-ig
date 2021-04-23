import { ObservationStatusKind } from "@ahryman40k/ts-fhir-types/lib/R4";
import { defaultPatientId } from "../defaults";
import { Resource } from "../../../types/resource";

abstract class ObservationBuilder {
  observationId = '123';

  status = ObservationStatusKind._final;

  patient = defaultPatientId;

  effectiveDateTime = new Date().toISOString()

  public withObservationId(id: string): ObservationBuilder {
    this.observationId = id;
    return this;
  }

  public withStatus(status: ObservationStatusKind): ObservationBuilder {
    this.status = status;
    return this;
  }

  public withPatient(patient: string): ObservationBuilder {
    this.patient = patient;
    return this;
  }

  public withEffectiveDateTime(effectiveDateTime: string): ObservationBuilder {
    this.effectiveDateTime = effectiveDateTime;
    return this;
  }

  public abstract build() : Resource
}

export default ObservationBuilder;
