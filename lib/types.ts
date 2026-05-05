export type Sex = "M" | "F" | "unknown";

export type WakeupStatus = "witnessed" | "wakeup";

export type ImagingModality = "CT" | "MRI";

export type YesNoUnknown = "yes" | "no" | "unknown";

export type OcclusionSite =
  | "none"
  | "ICA"
  | "M1"
  | "M2_dominant"
  | "M2_nondominant_or_codominant"
  | "M3"
  | "distal_other"
  | "unknown";

export type TumorStatus =
  | "none"
  | "small_meningioma_asymptomatic"
  | "other";

export interface NIHSSItems {
  loc_1a: number | null;       // 0-3
  loc_1b: number | null;       // 0-2
  loc_1c: number | null;       // 0-2
  gaze_2: number | null;       // 0-2
  visual_3: number | null;     // 0-3
  facial_4: number | null;     // 0-3
  motor_arm_l_5a: number | null; // 0-4 (UN scored 0)
  motor_arm_r_5b: number | null;
  motor_leg_l_6a: number | null;
  motor_leg_r_6b: number | null;
  ataxia_7: number | null;     // 0-2
  sensory_8: number | null;    // 0-2
  language_9: number | null;   // 0-3
  dysarthria_10: number | null;// 0-2
  extinction_11: number | null;// 0-2
}

export const EMPTY_NIHSS: NIHSSItems = {
  loc_1a: null,
  loc_1b: null,
  loc_1c: null,
  gaze_2: null,
  visual_3: null,
  facial_4: null,
  motor_arm_l_5a: null,
  motor_arm_r_5b: null,
  motor_leg_l_6a: null,
  motor_leg_r_6b: null,
  ataxia_7: null,
  sensory_8: null,
  language_9: null,
  dysarthria_10: null,
  extinction_11: null,
};

export interface ScreeningInput {
  // Demographics
  age: number | null;
  sex: Sex;

  // Timing
  wakeup_status: WakeupStatus | null;
  lkw_time: string | null;           // HH:MM — single LKWT field for all onset types
  current_time: string;              // HH:MM (auto, recomputed each render)
  wakeup_discovery_lt6h: YesNoUnknown; // wake-up only: discovery < 6h before ED arrival (no separate time field)

  // Premorbid
  pre_mrs: number | null; // 0-5

  // NIHSS
  nihss: NIHSSItems;

  // Bedside labs / vitals
  glucose_mgdl: number | null;
  inr: number | null;
  platelets_per_uL: number | null;
  sbp: number | null;
  dbp: number | null;
  thrombolysis_planned: boolean;

  // History flags (yes/no/unknown — unknown blocks until answered)
  seizure_at_onset: YesNoUnknown;
  seizure_between_onset_and_enrollment: YesNoUnknown;
  extreme_vomiting_or_agitation: YesNoUnknown;
  pregnancy: YesNoUnknown;
  in_hospital_stroke: YesNoUnknown;
  contrast_allergy_lifethreatening: YesNoUnknown;
  contrast_allergy_anaphylactic: YesNoUnknown;
  terminal_illness_lt1y: YesNoUnknown;
  terminal_illness_lt6mo: YesNoUnknown;
  cerebral_vasculitis_known: YesNoUnknown;
  unstable_emergent_lifesupport: YesNoUnknown;
  cannot_followup_90d: YesNoUnknown;
  confounding_trial_enrolled: YesNoUnknown;
  septic_embolus_or_endocarditis: YesNoUnknown;
  coagulopathy_known: YesNoUnknown;
  preexisting_neuro_psych_confounding: YesNoUnknown; // soft warning

  // Workflow
  angio_team_immediately_available: YesNoUnknown;

  // Imaging (post-CT)
  imaging_modality: ImagingModality | null;
  imaging_age_minutes: number | null;
  aspects: number | null; // 0-10
  ich_present: YesNoUnknown;
  midline_shift_mm: number | null;
  intracranial_tumor: TumorStatus | null;
  occlusion_site: OcclusionSite;
  tandem_occlusion: YesNoUnknown;
  multi_territory_occlusion: YesNoUnknown;
  chronic_occlusion: YesNoUnknown;
  intracranial_dissection: YesNoUnknown;
  icad_suspected: YesNoUnknown;
  cerebral_vasculitis_imaging: YesNoUnknown;
  vascular_access_feasible: YesNoUnknown;
  tmax_4s_deficit_in_m2_m3: YesNoUnknown;
  core_lt50pct_territory: YesNoUnknown;

  // Transfer screening (WE-TRUST pre-check)
  transferred_from_other_hospital: YesNoUnknown;
  has_ct_from_other_hospital: YesNoUnknown;

  // Attending decision
  attending_decision: "go" | "no-go" | null;
  attending_name: string;
  attending_notes: string;
  attending_decision_time: string | null; // HH:MM, auto-set on click
}

export interface DerivedInput {
  nihss_total: number | null;
  nihss_complete: boolean;
  lkw_to_now_hours: number | null;
}
