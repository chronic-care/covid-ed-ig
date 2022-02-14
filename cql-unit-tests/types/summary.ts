export interface DiagnosticSummary {
    ALT: Diagnostic | null,
    AST: Diagnostic | null,
    CRP: Diagnostic | null,
    DDimer: Diagnostic | null,
    Ferritin: Diagnostic | null
    LDH: Diagnostic | null,
    Lymphopenia: Diagnostic | null,
    Neutrophils: Diagnostic | null,
    PaO2FiO2LessThan300: boolean | null,
    ImmuneDysregulation: boolean | null,
    PCT: boolean | null
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