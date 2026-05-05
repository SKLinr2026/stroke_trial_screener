import type { DerivedInput, ScreeningInput } from "./types";
import { nihssComplete, nihssTotal } from "./nihss";

function parseHHMM(hhmm: string | null | undefined): number | null {
  if (!hhmm) return null;
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

function hoursBetween(fromMin: number, toMin: number): number {
  let diff = toMin - fromMin;
  if (diff < 0) diff += 24 * 60;
  return diff / 60;
}

export function deriveInputs(input: ScreeningInput): DerivedInput {
  const total = nihssTotal(input.nihss);
  const complete = nihssComplete(input.nihss);

  const nowMin = parseHHMM(input.current_time);
  const lkwMin = parseHHMM(input.lkw_time);

  const lkwToNow =
    lkwMin !== null && nowMin !== null
      ? hoursBetween(lkwMin, nowMin)
      : null;

  return {
    nihss_total: total,
    nihss_complete: complete,
    lkw_to_now_hours: lkwToNow,
  };
}
