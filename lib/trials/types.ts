import type { DerivedInput, ScreeningInput } from "../types";

export type CriterionStatus = "pass" | "fail" | "unknown";

export interface Criterion {
  id: string;
  label: string;
  evaluate: (input: ScreeningInput, derived: DerivedInput) => CriterionStatus;
  /** If true, a fail produces a soft warning instead of ineligibility. */
  warning?: boolean;
}

export interface TrialArm {
  id: string;
  name: string;
  inclusion: Criterion[];
}

export type TrialPhase = "pre_ct" | "post_imaging";

export interface TrialDef {
  id: string;
  display_name: string;
  short_name: string;
  phase: TrialPhase;
  priority: number;
  description?: string;
  /** Banner shown when a trial evaluates as eligible. */
  when_eligible_message?: string;
  /** Common inclusion (all must pass). */
  inclusion: Criterion[];
  /** Common exclusion (any pass = ineligible). */
  exclusion: Criterion[];
  /** Optional sub-arms; if present, exactly one arm must fully PASS for eligibility. */
  arms?: TrialArm[];
}

export type TrialOverallStatus =
  | "eligible"
  | "eligible_with_warnings"
  | "ineligible"
  | "pending";

export interface TrialResult {
  trial_id: string;
  status: TrialOverallStatus;
  matched_arm_id?: string;
  matched_arm_name?: string;
  failing: Criterion[];
  pending: Criterion[];
  warnings: Criterion[];
  // Per-arm breakdown when sub-arms exist
  arm_results?: { arm_id: string; arm_name: string; status: TrialOverallStatus; failing: Criterion[]; pending: Criterion[] }[];
}
