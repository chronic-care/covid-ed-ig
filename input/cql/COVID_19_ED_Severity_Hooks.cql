// # Introduction

// CDS Hooks logic for use with CQF Ruler

library COVID_19_ED_Severity_Hooks version '0.1.0'

// # Data model #

using FHIR version '4.0.1'

// # Referenced libraries #

include COVID_19_ED_Severity_FHIRv400 version '1.0.0' called CovidED

// # CDS logic #

context Patient

/*
 * Expressions for CDS Hook cards.
 */

// Used to trigger presentation of result
define "Has Severity Classification":
  CovidED."Severity Classification" is not null

define "Get Severity Card Summary":
  CovidED."Severity Classification" + ' COVID-19 Severity'

define "Get Severity Card Detail":
  'COVID-19 severity classification is ' + CovidED."Severity Classification" + ' with a qCSI score of ' + ToString(CovidED."qCSI Score")

define "Get Severity Card Indicator":
  if CovidED."Is Critical Risk" then 'critical'
  else 'warning'
