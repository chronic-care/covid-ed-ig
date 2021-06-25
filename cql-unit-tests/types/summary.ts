export interface DiagnosticSummary {
    ALT: Diagnostic | null,
    AST: Diagnostic | null,
    Creatinine: Diagnostic | null,
    CRP: Diagnostic | null,
    DDimer: Diagnostic | null,
    Ferritin: Diagnostic | null
    LDH: Diagnostic | null,
    Lymphopenia: Diagnostic | null,
    Neutrophils: Diagnostic | null,
    Thrombocytopenia: Diagnostic | null,
    Troponin: Diagnostic | null,
    WBC: Diagnostic | null,
    PaO2FiO2: boolean | null
}

export interface Diagnostic {
    Date: string,
    Name: string,
    ResultText: string,
    ResultValue: number,
    ResultUnits: string,
    ReferenceRange: string,
    Interpretation: string | null,
    Flag: boolean
}