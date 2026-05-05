import type { DerivedInput, ScreeningInput } from "../types";
import type {
  Criterion,
  TrialArm,
  TrialDef,
  TrialOverallStatus,
  TrialResult,
} from "./types";

interface Bucket {
  failing: Criterion[];
  pending: Criterion[];
  warnings: Criterion[];
}

function bucketize(
  criteria: Criterion[],
  input: ScreeningInput,
  derived: DerivedInput,
  invert: boolean // for exclusion: a "pass" of expression means EXCLUDED
): Bucket {
  const failing: Criterion[] = [];
  const pending: Criterion[] = [];
  const warnings: Criterion[] = [];
  for (const c of criteria) {
    const s = c.evaluate(input, derived);
    if (s === "unknown") {
      pending.push(c);
      continue;
    }
    const bad = invert ? s === "pass" : s === "fail";
    if (bad) {
      if (c.warning) warnings.push(c);
      else failing.push(c);
    }
  }
  return { failing, pending, warnings };
}

function evaluateArm(
  arm: TrialArm,
  input: ScreeningInput,
  derived: DerivedInput
): { status: TrialOverallStatus; failing: Criterion[]; pending: Criterion[] } {
  const b = bucketize(arm.inclusion, input, derived, false);
  if (b.failing.length > 0) return { status: "ineligible", failing: b.failing, pending: b.pending };
  if (b.pending.length > 0) return { status: "pending", failing: [], pending: b.pending };
  return { status: "eligible", failing: [], pending: [] };
}

export function evaluateTrial(
  trial: TrialDef,
  input: ScreeningInput,
  derived: DerivedInput
): TrialResult {
  const inc = bucketize(trial.inclusion, input, derived, false);
  const exc = bucketize(trial.exclusion, input, derived, true);

  const allFailing = [...inc.failing, ...exc.failing];
  const allPending = [...inc.pending, ...exc.pending];
  const warnings = [...exc.warnings];

  if (allFailing.length > 0) {
    return {
      trial_id: trial.id,
      status: "ineligible",
      failing: allFailing,
      pending: [],
      warnings,
    };
  }

  // Sub-arms: one must fully pass; otherwise pending if any arm is pending,
  // else ineligible (with each arm's failures aggregated).
  if (trial.arms && trial.arms.length > 0) {
    const armResults = trial.arms.map((a) => ({
      arm_id: a.id,
      arm_name: a.name,
      ...evaluateArm(a, input, derived),
    }));
    const eligibleArm = armResults.find((a) => a.status === "eligible");
    if (eligibleArm && allPending.length === 0) {
      return {
        trial_id: trial.id,
        status: warnings.length > 0 ? "eligible_with_warnings" : "eligible",
        matched_arm_id: eligibleArm.arm_id,
        matched_arm_name: eligibleArm.arm_name,
        failing: [],
        pending: [],
        warnings,
        arm_results: armResults,
      };
    }
    if (eligibleArm && allPending.length > 0) {
      return {
        trial_id: trial.id,
        status: "pending",
        failing: [],
        pending: allPending,
        warnings,
        arm_results: armResults,
      };
    }
    const anyPendingArm = armResults.some((a) => a.status === "pending");
    if (anyPendingArm || allPending.length > 0) {
      const armPending = armResults.flatMap((a) => a.pending);
      return {
        trial_id: trial.id,
        status: "pending",
        failing: [],
        pending: [...allPending, ...armPending],
        warnings,
        arm_results: armResults,
      };
    }
    // No arm passes, none pending → ineligible
    const armFailing = armResults.flatMap((a) => a.failing);
    return {
      trial_id: trial.id,
      status: "ineligible",
      failing: armFailing,
      pending: [],
      warnings,
      arm_results: armResults,
    };
  }

  if (allPending.length > 0) {
    return {
      trial_id: trial.id,
      status: "pending",
      failing: [],
      pending: allPending,
      warnings,
    };
  }

  return {
    trial_id: trial.id,
    status: warnings.length > 0 ? "eligible_with_warnings" : "eligible",
    failing: [],
    pending: [],
    warnings,
  };
}
