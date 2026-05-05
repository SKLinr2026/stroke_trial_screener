"use client";
import React from "react";
import type { TrialDef, TrialResult } from "@/lib/trials/types";

interface Props {
  results: { trial: TrialDef; result: TrialResult }[];
}

const STATUS_STYLES: Record<
  TrialResult["status"],
  { badge: string; ring: string; label: string }
> = {
  eligible: {
    badge: "bg-emerald-600 text-white",
    ring: "ring-emerald-300",
    label: "ELIGIBLE",
  },
  eligible_with_warnings: {
    badge: "bg-amber-500 text-white",
    ring: "ring-amber-300",
    label: "ELIGIBLE — review",
  },
  ineligible: {
    badge: "bg-red-600 text-white",
    ring: "ring-red-300",
    label: "INELIGIBLE",
  },
  pending: {
    badge: "bg-gray-400 text-white",
    ring: "ring-gray-200",
    label: "PENDING",
  },
};

export function EligibilityPanel({ results }: Props) {
  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4 sticky top-4">
      <h2 className="text-base font-bold text-brand mb-3">Live Eligibility</h2>
      <div className="space-y-3">
        {results.map(({ trial, result }) => {
          const s = STATUS_STYLES[result.status];
          const dtas =
            trial.id === "we-trust" &&
            (result.status === "eligible" ||
              result.status === "eligible_with_warnings");
          return (
            <div
              key={trial.id}
              className={`border rounded-md p-3 ring-2 ${s.ring} bg-white`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div>
                  <div className="text-sm font-bold text-gray-800">
                    {trial.short_name}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {trial.phase === "pre_ct" ? "Pre-CT" : "Post-imaging"}
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${s.badge}`}
                >
                  {s.label}
                </span>
              </div>

              {dtas && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded px-2 py-1.5 mb-2">
                  → DIRECT TO ANGIO SUITE — skip CT. Notify EVT team.
                </div>
              )}

              {result.matched_arm_name && (
                <div className="text-xs text-emerald-700 font-semibold mb-1">
                  Matched arm: {result.matched_arm_name}
                </div>
              )}

              {result.failing.length > 0 && (
                <div className="mb-1">
                  <div className="text-[11px] font-bold text-red-700 mb-0.5">
                    Fails ({result.failing.length}):
                  </div>
                  <ul className="text-[11px] text-red-700 list-disc list-inside space-y-0.5">
                    {result.failing.map((c) => (
                      <li key={c.id}>{c.label}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.warnings.length > 0 && (
                <div className="mb-1">
                  <div className="text-[11px] font-bold text-amber-700 mb-0.5">
                    Warnings ({result.warnings.length}):
                  </div>
                  <ul className="text-[11px] text-amber-700 list-disc list-inside space-y-0.5">
                    {result.warnings.map((c) => (
                      <li key={c.id}>{c.label}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.pending.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-gray-600 mb-0.5">
                    Need ({result.pending.length}):
                  </div>
                  <ul className="text-[11px] text-gray-600 list-disc list-inside space-y-0.5">
                    {result.pending.slice(0, 5).map((c) => (
                      <li key={c.id}>{c.label}</li>
                    ))}
                    {result.pending.length > 5 && (
                      <li>+ {result.pending.length - 5} more…</li>
                    )}
                  </ul>
                </div>
              )}

              {trial.arms && result.arm_results && (
                <div className="mt-2 pt-2 border-t border-gray-100 grid grid-cols-2 gap-1">
                  {result.arm_results.map((a) => {
                    const as = STATUS_STYLES[a.status];
                    return (
                      <div
                        key={a.arm_id}
                        className="text-[11px] flex items-center gap-1.5"
                      >
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold ${as.badge}`}
                        >
                          {a.status === "eligible" ? "✓" : a.status === "ineligible" ? "✗" : "…"}
                        </span>
                        <span className="text-gray-700">{a.arm_name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
