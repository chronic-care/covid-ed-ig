// # Introduction

// CDS Hooks logic for use with CQF Ruler

library COVID19EmergencyDeptHooks version '0.1.0'

// # Data model #

using FHIR version '4.0.1'

// # Referenced libraries #

include COVID19EmergencyDeptSummary version '1.0.0' called CovidED

// # CDS logic #

context Patient

/*
 * Expressions for CDS Hook cards.
 */

// Used to trigger presentation of result
define "Has Severity Classification":
  CovidED.RiskSummary.SeverityClassification is not null

define "Get Severity Card Summary":
  CovidED.RiskSummary.SeverityClassification + ' COVID-19 Severity'

define "Get Severity Card Detail":
  'COVID-19 severity classification is ' + CovidED.RiskSummary.SeverityClassification + ' with a risk score of ' + ToString(CovidED.RiskSummary.RiskScore)

define "Get Severity Card Indicator":
  if CovidED.RiskSummary.SeverityClassification = 'CRITICAL' or CovidED.RiskSummary.SeverityClassification = 'SEVERE'
    then 'critical'
  else 'warning'
