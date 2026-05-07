import type { ScreeningInput } from "./types";
import { EMPTY_NIHSS } from "./types";

export function nowHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

export function initialInput(): ScreeningInput {
  return {
    age: null,
    sex: "unknown",

    wakeup_status: null,
    lkw_time: null,
    current_time: nowHHMM(),
    wakeup_discovery_lt6h: "unknown",

    pre_mrs: null,

    nihss: { ...EMPTY_NIHSS },

    glucose_mgdl: null,
    inr: null,
    platelets_per_uL: null,
    sbp: null,
    dbp: null,
    thrombolysis_planned: false,

    transferred_from_other_hospital: "unknown",
    has_ct_from_other_hospital: "unknown",

    seizure_at_onset: "unknown",
    seizure_between_onset_and_enrollment: "unknown",
    extreme_vomiting_or_agitation: "unknown",
    pregnancy: "unknown",
    in_hospital_stroke: "unknown",
    contrast_allergy: "unknown",
    terminal_illness_lt1y: "unknown",
    terminal_illness_lt6mo: "unknown",
    cerebral_vasculitis_known: "unknown",
    septic_embolus_or_endocarditis: "unknown",
    coagulopathy_known: "unknown",

    angio_team_immediately_available: "unknown",

    imaging_modality: null,
    imaging_age_minutes: null,
    aspects: null,
    ich_present: "unknown",
    midline_shift_mm: null,
    intracranial_tumor: null,
    occlusion_site: "unknown",
    tandem_occlusion: "unknown",
    multi_territory_occlusion: "unknown",
    chronic_occlusion: "unknown",
    intracranial_dissection: "unknown",
    icad_suspected: "unknown",
    cerebral_vasculitis_imaging: "unknown",
    vascular_access_feasible: "unknown",
    tmax_4s_deficit_in_m2_m3: "unknown",
    core_lt50pct_territory: "unknown",

    attending_decision: null,
    attending_name: "",
    attending_notes: "",
    attending_decision_time: null,
  };
}
