import { ClinicalAssessmentsParameters } from '../../types/parameter';

export class ClinicalAssessmentBuilder  {
    private anyMildCOVIDSymptoms: boolean | null = null;
    private respiratoryRate: number | null = null;
    private o2Saturation: number | null = null;
    private heartRate: number | null = null;
    private systolicBloodPressure: number | null = null;
    private temperatureF: number | null = null;
    private alertness: string | null = null;
    private supplementalOxygen: boolean | null = null;
    private performanceStatus: string | null = null;
    private respiratoryDiseaseSymptoms: boolean | null = null;
    private chestXRayConcerning: boolean | null = null;
    private ultrasoundConcerning: boolean | null = null;
    private cTConcerning: boolean | null = null;
    private lungInfiltratesOver50: boolean | null = null;
    private respiratoryDiseaseImagingEvidence: boolean | null = null;
    private paO2FiO2Ratio: number | null =  null;
    private respiratoryFailure: boolean | null = null;
    private septicShock: boolean | null = null;
    private multiorganDysfunction: boolean | null = null;
    private concerningLabCount: number | null = null;

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
        this.respiratoryRate = 12; //to make risk score = 0
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
        this.systolicBloodPressure = 91;
        return this;
    }

    public withRiskScoreOfFour = () => {
        this.respiratoryRate = 22;
        this.systolicBloodPressure = 91;
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