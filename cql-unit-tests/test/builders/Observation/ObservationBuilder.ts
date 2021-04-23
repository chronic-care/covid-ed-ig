abstract class ObservationBuilder {
  observationId = '123';

  status = 'final';

  patient = 'BILIBABY';

  effectiveDateTime = new Date().toISOString()

  public withObservationId(id: string): ObservationBuilder {
    this.observationId = id;
    return this;
  }

  public withStatus(status: string): ObservationBuilder {
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

  public abstract build() : unknown
}

export default ObservationBuilder;
