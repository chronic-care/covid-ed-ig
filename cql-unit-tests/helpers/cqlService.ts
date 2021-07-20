import { CQLExpressionParameters } from "../types/parameter";
// Types not available for these modules
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import cql from 'cql-execution';
// @ts-ignore
import cqlfhir from 'cql-exec-fhir';
/* eslint-enable */
import COVID19EDSummary from '../../output/Library-COVID19EmergencyDeptSummary-2.json';
import COVID19EmergencyDeptAssessment from '../../output/Library-COVID19EmergencyDeptAssessment-2.json';
import CDSConnectCommons from '../../output/Library-CDSConnectCommons-2.json';
import COVID19Concepts from '../../output/Library-COVID19Concepts-2.json';
import FHIRHelpers from '../../output/Library-FHIRHelpers-4.0.1-2.json';
import valueSetDB from '../../input/cql/valueset-db.json';
import { ICondition, IPatient, PatientGenderKind } from "@ahryman40k/ts-fhir-types/lib/R4";
import { IObservation } from "@ahryman40k/ts-fhir-types/lib/R4/Resource/RTTI_Observation";

const summaryLibrary = new cql.Library(COVID19EDSummary, new cql.Repository({
    COVID19EmergencyDeptAssessment,
    CDSConnectCommons,
    COVID19Concepts,
    FHIRHelpers,
}));

const assessmentLibrary = new cql.Library(COVID19EmergencyDeptAssessment, new cql.Repository({
    CDSConnectCommons,
    COVID19Concepts,
    FHIRHelpers,
}));

const codeService = new cql.CodeService(valueSetDB);

export const createPatientSource = (observations: IObservation[], conditions: ICondition[]): unknown => {
    const patientSource = cqlfhir.PatientSource.FHIRv401();

    const observationResources = observations.map((observation) => {
        return {resource: observation};
    });

    const conditionResources = conditions.map((condition) => {
        return {resource: condition};
    });

    const patient: IPatient = {
        gender: PatientGenderKind._male, id: "va-pat-dan", resourceType: "Patient"
    }
    const entry = [
        {
            resource: patient,
        },
        ...observationResources,
        ...conditionResources
    ];

    patientSource.loadBundles([
        {
            resourceType: 'Bundle',
            entry,
        },
    ] as unknown);

    return patientSource;
}

export const executeAssessmentCQLExpression = (parameters: CQLExpressionParameters, expressionName: string, conditions: ICondition[] = []): unknown => {
    const expressionExecutor = new cql.Executor(assessmentLibrary, codeService, parameters);

    const results = expressionExecutor.exec_expression(expressionName, createPatientSource([], conditions));

    const patientResults = Object.keys(results.patientResults);
    const firstPatientResult = patientResults[0];
    const expressions = results.patientResults[firstPatientResult];

    return expressions[expressionName];
};

export const executeAssessmentNoParams = (expressionName: string, observations: IObservation[]): unknown => {
    const expressionExecutor = new cql.Executor(assessmentLibrary, codeService);

    const results = expressionExecutor.exec_expression(expressionName, createPatientSource(observations, []));

    const patientResults = Object.keys(results.patientResults);
    const firstPatientResult = patientResults[0];
    const expressions = results.patientResults[firstPatientResult];

    return expressions[expressionName];
}


export const executeSummaryCQLExpression = (parameters: CQLExpressionParameters, expressionName: string): unknown => {
    let finishTime;

    const listener = {
        onMessage: (source, code, severity, message) => {
            finishTime = Date.now();
        }
    };

    const expressionExecutor = new cql.Executor(summaryLibrary, codeService, parameters, listener);

    const startTime = Date.now();
    const results = expressionExecutor.exec_expression(expressionName, createPatientSource([], []));

    console.log('run time:', finishTime - startTime);

    const patientResults = Object.keys(results.patientResults);
    const firstPatientResult = patientResults[0];
    const expressions = results.patientResults[firstPatientResult];

    return expressions[expressionName];
};

export const executeSummaryNoParams = (expressionName: string, observations: IObservation[]): unknown => {
    const expressionExecutor = new cql.Executor(summaryLibrary, codeService);

    const results = expressionExecutor.exec_expression(expressionName, createPatientSource(observations, []));

    const patientResults = Object.keys(results.patientResults);
    const firstPatientResult = patientResults[0];
    const expressions = results.patientResults[firstPatientResult];

    return expressions[expressionName];
}
