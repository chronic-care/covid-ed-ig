import { ClinicalAssessmentsParameters } from '../../types/parameter';

export class ClinicalAssessmentBuilder  {
    private anyMildCOVIDSymptoms = null;
    private respiratoryRate = null;
    private o2Saturation = null;
    private heartRate = null;
    private systolicBloodPressure = null;
    private temperatureF = null;
    private alertness = null;
    private supplementalOxygen = null;
    private performanceStatus = null;
    private respiratoryDiseaseSymptoms = null;
    private chestXRayConcerning = null;
    private ultrasoundConcerning = null;
    private cTConcerning = null;
    private lungInfiltratesOver50 = null;
    private respiratoryDiseaseImagingEvidence = null;
    private paO2FiO2Ratio =  null;
    private respiratoryFailure = null;
    private septicShock = null;
    private multiorganDysfunction = null;
    private concerningLabCount = null;

    public withConcerningLab = (concerningLabCount: number) => {
        this.concerningLabCount = concerningLabCount;
        return this;
    }

    public withNoConcerningLabOrImaging = () => {
        this.concerningLabCount = 0;
        this.chestXRayConcerning = false;
        return this;
    }

    public withMildSeverity = () => {
        this.anyMildCOVIDSymptoms = true;
        this.respiratoryDiseaseSymptoms = false;
        return this;
    }

    public withModerateSeverity = () => {
        this.o2Saturation = 94;
        this.respiratoryDiseaseSymptoms = true;
        return this;
    }

    public withSevereSeverity = () => {
        this.o2Saturation = 90;
        return this;
    }

    public withCriticalSeverity = () => {
        this.respiratoryFailure = true;
        return this;
    }

    public withRiskScoreOfFive = () => {
        this.respiratoryRate = 25;
        this.o2Saturation =  92;
        return this;
    }

    public withConcerningImagingOfOne = () => {
        this.chestXRayConcerning = true;
        return this;
    }

    public withNoConcerningImaging = () => {
        this.chestXRayConcerning = false;
        return this;
    }

    public build = () : ClinicalAssessmentsParameters => {
        return {
            AnyMildCOVIDSymptoms: this.anyMildCOVIDSymptoms,
            RespiratoryRate: this.respiratoryRate,
            O2Saturation: this.o2Saturation,
            HeartRate: this.heartRate,
            SystolicBloodPressure: this.systolicBloodPressure,
            TemperatureF: this.temperatureF,
            Alertness: this.alertness,
            SupplementalOxygen: this.supplementalOxygen,
            PerformanceStatus: this.performanceStatus,
            RespiratoryDiseaseSymptoms: this.respiratoryDiseaseSymptoms,
            ChestXRayConcerning: this.chestXRayConcerning,
            UltrasoundConcerning: this.ultrasoundConcerning,
            CTConcerning: this.cTConcerning,
            LungInfiltratesOver50: this.lungInfiltratesOver50,
            RespiratoryDiseaseImagingEvidence: this.respiratoryDiseaseImagingEvidence,
            PaO2FiO2Ratio: this.paO2FiO2Ratio,
            RespiratoryFailure: this.respiratoryFailure,
            SepticShock: this.septicShock,
            MultiorganDysfunction: this.multiorganDysfunction,
            ConcerningLabCount: this.concerningLabCount,
        }
    }
}