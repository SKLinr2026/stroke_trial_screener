import type { CriterionStatus } from "./types";
import type { YesNoUnknown } from "../types";

/** For exclusion criteria where "yes" means the patient HAS the condition (= excluded). */
export function ynStatus(v: YesNoUnknown): CriterionStatus {
  if (v === "yes") return "pass"; // pass = the criterion's condition is true
  if (v === "no") return "fail";
  return "unknown";
}

/** numeric not-yet-entered → unknown. */
export function numStatus(
  v: number | null | undefined,
  predicate: (n: number) => boolean
): CriterionStatus {
  if (v === null || v === undefined || Number.isNaN(v)) return "unknown";
  return predicate(v) ? "pass" : "fail";
}
