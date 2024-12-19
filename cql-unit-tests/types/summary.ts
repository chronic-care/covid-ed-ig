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
    Interleukin1: boolean | null,
    Interleukin6: boolean | null,
    Interleukin8: boolean | null,
    TumorNecrosisFactorAlpha: boolean | null,
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