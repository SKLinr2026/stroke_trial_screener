import type { TrialDef } from "./types";
import { WE_TRUST } from "./we-trust";
import { STEP_A } from "./step-a";

export const TRIALS: TrialDef[] = [WE_TRUST, STEP_A].sort(
  (a, b) => a.priority - b.priority
);

export { WE_TRUST, STEP_A };
