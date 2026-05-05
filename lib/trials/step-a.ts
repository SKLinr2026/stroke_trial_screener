import type { TrialDef } from "./types";
import { numStatus, ynStatus } from "./helpers";

export const STEP_A: TrialDef = {
  id: "step-a",
  display_name: "STEP Trial — Domain A (EVT Indication Expansion)",
  short_name: "STEP-A",
  phase: "post_imaging",
  priority: 2,
  description:
    "Comparison of EVT vs medical management in (1) LVO with mild deficits and (2) medium/distal vessel occlusions.",
  when_eligible_message: "STEP-A eligible — contact study coordinator.",

  inclusion: [
    {
      id: "age",
      label: "Age ≥ 18",
      evaluate: (i) => numStatus(i.age, (n) => n >= 18),
    },
    {
      id: "pre_mrs",
      label: "Premorbid mRS 0–2",
      evaluate: (i) => numStatus(i.pre_mrs, (n) => n <= 2),
    },
    {
      id: "lkw_24h",
      label: "Within 24 h of LKW",
      evaluate: (_, d) => {
        if (d.lkw_to_now_hours === null) return "unknown";
        return d.lkw_to_now_hours <= 24 ? "pass" : "fail";
      },
    },
    {
      id: "aspects",
      label: "ASPECTS ≥ 6 (CT) or ≥ 7 (MRI)",
      evaluate: (i) => {
        if (i.aspects === null) return "unknown";
        if (i.imaging_modality === null) return "unknown";
        const min = i.imaging_modality === "MRI" ? 7 : 6;
        return i.aspects >= min ? "pass" : "fail";
      },
    },
    {
      id: "imaging_recency",
      label: "Qualifying imaging ≤ 120 min old (else repeat)",
      warning: true,
      evaluate: (i) => {
        if (i.imaging_age_minutes === null) return "unknown";
        return i.imaging_age_minutes > 120 ? "fail" : "pass";
      },
    },
  ],

  arms: [
    {
      id: "lvo_mild",
      name: "LVO with Mild Deficits",
      inclusion: [
        {
          id: "nihss_lvo_mild",
          label: "NIHSS 0–5 with focal deficit",
          evaluate: (_, d) => {
            if (d.nihss_total === null) return "unknown";
            return d.nihss_total >= 0 && d.nihss_total <= 5 ? "pass" : "fail";
          },
        },
        {
          id: "occlusion_lvo",
          label: "ICA or M1 occlusion",
          evaluate: (i) => {
            if (i.occlusion_site === "unknown") return "unknown";
            return i.occlusion_site === "ICA" || i.occlusion_site === "M1"
              ? "pass"
              : "fail";
          },
        },
      ],
    },
    {
      id: "medium_distal",
      name: "Medium / Distal Vessel Occlusion",
      inclusion: [
        {
          id: "occlusion_or_perfusion",
          label:
            "M2 (non-dominant or co-dominant) or M3 occlusion, OR Tmax > 4 s perfusion deficit",
          evaluate: (i) => {
            if (
              i.occlusion_site === "unknown" &&
              i.tmax_4s_deficit_in_m2_m3 === "unknown"
            )
              return "unknown";
            const occ =
              i.occlusion_site === "M2_nondominant_or_codominant" ||
              i.occlusion_site === "M3";
            const perf = i.tmax_4s_deficit_in_m2_m3 === "yes";
            return occ || perf ? "pass" : "fail";
          },
        },
        {
          id: "nihss_md",
          label: "NIHSS ≥ 8",
          evaluate: (_, d) => {
            if (d.nihss_total === null) return "unknown";
            return d.nihss_total >= 8 ? "pass" : "fail";
          },
        },
        {
          id: "core_check_late",
          label: "If onset > 6 h: core < 50 % of territory",
          evaluate: (i, d) => {
            if (d.lkw_to_now_hours === null) return "unknown";
            if (d.lkw_to_now_hours <= 6) return "pass"; // not applicable
            if (i.core_lt50pct_territory === "unknown") return "unknown";
            return i.core_lt50pct_territory === "yes" ? "pass" : "fail";
          },
        },
      ],
    },
  ],

  exclusion: [
    {
      id: "platelets_low",
      label: "Platelets < 100,000/μL",
      evaluate: (i) => {
        if (i.platelets_per_uL === null) return "unknown";
        return i.platelets_per_uL < 100000 ? "pass" : "fail";
      },
    },
    {
      id: "ich",
      label: "Acute intracranial hemorrhage",
      evaluate: (i) => ynStatus(i.ich_present),
    },
    {
      id: "midline_shift",
      label: "Midline shift > 5 mm",
      evaluate: (i) => {
        if (i.midline_shift_mm === null) return "unknown";
        return i.midline_shift_mm > 5 ? "pass" : "fail";
      },
    },
    {
      id: "tandem",
      label: "Tandem occlusion",
      evaluate: (i) => ynStatus(i.tandem_occlusion),
    },
    {
      id: "multi_territory",
      label: "Multiple vascular territory occlusions",
      evaluate: (i) => ynStatus(i.multi_territory_occlusion),
    },
    {
      id: "chronic_occ",
      label: "Chronic intracranial occlusion",
      evaluate: (i) => ynStatus(i.chronic_occlusion),
    },
    {
      id: "dissection",
      label: "Intracranial dissection",
      evaluate: (i) => ynStatus(i.intracranial_dissection),
    },
    {
      id: "icad",
      label: "Suspected intracranial atherosclerotic disease",
      evaluate: (i) => ynStatus(i.icad_suspected),
    },
    {
      id: "vasculitis_imaging",
      label: "Cerebral vasculitis",
      evaluate: (i) => ynStatus(i.cerebral_vasculitis_imaging),
    },
    {
      id: "anaphylactic_contrast",
      label: "Anaphylactic contrast allergy precluding EVT",
      evaluate: (i) => ynStatus(i.contrast_allergy_anaphylactic),
    },
    {
      id: "tumor",
      label:
        "Intracranial tumor (except small meningioma ≤ 3 cm, asymptomatic)",
      evaluate: (i) => {
        if (i.intracranial_tumor === null) return "unknown";
        return i.intracranial_tumor === "other" ? "pass" : "fail";
      },
    },
    {
      id: "seizure",
      label: "Seizure at onset or between onset and enrollment",
      evaluate: (i) => {
        const a = i.seizure_at_onset;
        const b = i.seizure_between_onset_and_enrollment;
        if (a === "yes" || b === "yes") return "pass";
        if (a === "unknown" || b === "unknown") return "unknown";
        return "fail";
      },
    },
    {
      id: "septic_embolus",
      label: "Suspected septic embolus / bacterial endocarditis",
      evaluate: (i) => ynStatus(i.septic_embolus_or_endocarditis),
    },
    {
      id: "pregnancy",
      label: "Pregnancy",
      evaluate: (i) => ynStatus(i.pregnancy),
    },
    {
      id: "terminal_lt6mo",
      label: "Terminal illness < 6 months",
      evaluate: (i) => ynStatus(i.terminal_illness_lt6mo),
    },
    {
      id: "vascular_access",
      label: "Unfavorable vascular anatomy precluding access",
      evaluate: (i) => {
        if (i.vascular_access_feasible === "unknown") return "unknown";
        return i.vascular_access_feasible === "no" ? "pass" : "fail";
      },
    },
    {
      id: "preexisting_neuro_psych",
      label:
        "Pre-existing neuro/psych disease confounding evaluation (investigator judgement)",
      warning: true,
      evaluate: (i) => ynStatus(i.preexisting_neuro_psych_confounding),
    },
  ],
};
