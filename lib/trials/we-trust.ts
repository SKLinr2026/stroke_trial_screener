import type { TrialDef } from "./types";
import { numStatus, ynStatus } from "./helpers";

export const WE_TRUST: TrialDef = {
  id: "we-trust",
  display_name: "WE-TRUST (Direct-to-Angio Workflow)",
  short_name: "WE-TRUST",
  phase: "pre_ct",
  priority: 1,
  description:
    "Workflow trial comparing Direct-to-Angio Suite (DTAS) using cone-beam CT vs conventional CT/MRI triage. Screen FIRST before standard CT.",
  when_eligible_message:
    "Direct to Angio Suite — skip standard CT triage. Notify EVT team.",

  inclusion: [
    {
      id: "age",
      label: "Age ≥ 18",
      evaluate: (i) => numStatus(i.age, (n) => n >= 18),
    },
    {
      id: "nihss_min",
      label: "NIHSS ≥ 10 (full exam required)",
      evaluate: (_, d) => {
        if (!d.nihss_complete) return "unknown";
        return d.nihss_total !== null && d.nihss_total >= 10 ? "pass" : "fail";
      },
    },
    {
      id: "pre_mrs",
      label: "Premorbid mRS 0–2",
      evaluate: (i) => numStatus(i.pre_mrs, (n) => n <= 2),
    },
    {
      id: "time_window",
      label: "Time window: LKWT < 6h (witnessed) or < 12h (wake-up)",
      evaluate: (i, d) => {
        if (i.wakeup_status === null) return "unknown";
        if (d.lkw_to_now_hours === null) return "unknown";
        if (i.wakeup_status === "witnessed") {
          return d.lkw_to_now_hours < 6 ? "pass" : "fail";
        }
        // wake-up: LKWT < 12h AND discovery < 6h before arrival
        if (d.lkw_to_now_hours >= 12) return "fail";
        if (i.wakeup_discovery_lt6h === "unknown") return "unknown";
        return i.wakeup_discovery_lt6h === "yes" ? "pass" : "fail";
      },
    },
    {
      id: "angio_team_available",
      label: "Angio suite + EVT team immediately available",
      evaluate: (i) => ynStatus(i.angio_team_immediately_available),
    },
  ],

  exclusion: [
    {
      id: "transfer_with_ct",
      label: "Transfer from outside hospital with head CT already obtained",
      evaluate: (i) => {
        if (i.transferred_from_other_hospital === "unknown") return "unknown";
        if (i.transferred_from_other_hospital === "no") return "fail"; // not a transfer → no exclusion
        // transferred = yes → ask about CT
        if (i.has_ct_from_other_hospital === "unknown") return "unknown";
        return i.has_ct_from_other_hospital === "yes" ? "pass" : "fail";
      },
    },
    {
      id: "coagulopathy_or_inr",
      label: "Known coagulopathy / hemorrhagic diathesis",
      evaluate: (i) => ynStatus(i.coagulopathy_known),
    },
    {
      id: "inr_high",
      label: "INR > 3.0",
      evaluate: (i) => {
        if (i.inr === null || Number.isNaN(i.inr)) return "unknown";
        return i.inr > 3.0 ? "pass" : "fail";
      },
    },
    {
      id: "platelets_low",
      label: "Platelets < 30,000/μL",
      evaluate: (i) => {
        if (i.platelets_per_uL === null) return "unknown";
        return i.platelets_per_uL < 30000 ? "pass" : "fail";
      },
    },
    {
      id: "glucose_low",
      label: "Glucose < 50 mg/dL",
      evaluate: (i) => {
        if (i.glucose_mgdl === null) return "unknown";
        return i.glucose_mgdl < 50 ? "pass" : "fail";
      },
    },
    {
      id: "coma",
      label: "Coma (NIHSS LOC item 1a > 1)",
      evaluate: (i) => {
        const v = i.nihss.loc_1a;
        if (v === null || v === undefined) return "unknown";
        return v > 1 ? "pass" : "fail";
      },
    },
    {
      id: "seizure_at_onset",
      label: "Seizure at onset precluding NIHSS",
      evaluate: (i) => ynStatus(i.seizure_at_onset),
    },
    {
      id: "vomiting_or_agitation",
      label: "Extreme vomiting or agitation",
      evaluate: (i) => ynStatus(i.extreme_vomiting_or_agitation),
    },
    {
      id: "pregnancy",
      label: "Pregnancy",
      evaluate: (i) => ynStatus(i.pregnancy),
    },
    {
      id: "in_hospital_stroke",
      label: "In-hospital stroke acquisition",
      evaluate: (i) => ynStatus(i.in_hospital_stroke),
    },
    {
      id: "contrast_allergy",
      label: "Contrast allergy (severe / anaphylactic)",
      evaluate: (i) => ynStatus(i.contrast_allergy),
    },
    {
      id: "terminal_lt1y",
      label: "Terminal illness < 1 year",
      evaluate: (i) => ynStatus(i.terminal_illness_lt1y),
    },
    {
      id: "vasculitis_known",
      label: "Known cerebral vasculitis",
      evaluate: (i) => ynStatus(i.cerebral_vasculitis_known),
    },
    {
      id: "bp_high_with_lytics",
      label: "BP > 185/110 (only if thrombolysis planned)",
      evaluate: (i) => {
        if (!i.thrombolysis_planned) return "fail"; // not applicable → not excluded
        if (i.sbp === null && i.dbp === null) return "unknown";
        const sbpHigh = i.sbp !== null && i.sbp > 185;
        const dbpHigh = i.dbp !== null && i.dbp > 110;
        return sbpHigh || dbpHigh ? "pass" : "fail";
      },
    },
  ],
};
