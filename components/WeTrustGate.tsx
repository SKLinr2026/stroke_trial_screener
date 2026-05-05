"use client";
import React from "react";
import type { TrialResult } from "@/lib/trials/types";

interface Props {
  result: TrialResult;
}

export function WeTrustGate({ result }: Props) {
  const eligible =
    result.status === "eligible" || result.status === "eligible_with_warnings";
  const ineligible = result.status === "ineligible";
  const pending = result.status === "pending";

  return (
    <section
      className={
        "rounded-lg border-2 p-4 mb-4 " +
        (eligible
          ? "border-emerald-500 bg-emerald-50"
          : ineligible
          ? "border-red-400 bg-red-50"
          : "border-gray-300 bg-gray-50")
      }
    >
      <div className="flex items-center justify-between mb-2">
        <h2
          className={
            "text-base font-bold " +
            (eligible
              ? "text-emerald-800"
              : ineligible
              ? "text-red-800"
              : "text-gray-700")
          }
        >
          ◆ WE-TRUST decision gate (pre-CT)
        </h2>
        <span
          className={
            "px-2 py-0.5 rounded text-[11px] font-bold " +
            (eligible
              ? "bg-emerald-600 text-white"
              : ineligible
              ? "bg-red-600 text-white"
              : "bg-gray-400 text-white")
          }
        >
          {result.status === "eligible_with_warnings"
            ? "ELIGIBLE — review"
            : result.status.toUpperCase()}
        </span>
      </div>

      {eligible && (
        <div className="space-y-1">
          <div className="text-xl font-bold text-emerald-800">
            → DIRECT TO ANGIO SUITE — skip standard CT.
          </div>
          <div className="text-sm text-emerald-900">
            Notify EVT team. CBCT will be obtained in the angio suite.
          </div>
          {result.warnings.length > 0 && (
            <ul className="text-xs text-amber-800 list-disc list-inside mt-1">
              {result.warnings.map((c) => (
                <li key={c.id}>Soft flag: {c.label}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {ineligible && (
        <div className="space-y-1">
          <div className="text-base font-bold text-red-800">
            Proceed with standard CT/CTA — then screen STEP-A below.
          </div>
          <div className="text-xs text-red-900">
            Failing criteria:
          </div>
          <ul className="text-xs text-red-900 list-disc list-inside">
            {result.failing.slice(0, 6).map((c) => (
              <li key={c.id}>{c.label}</li>
            ))}
            {result.failing.length > 6 && (
              <li>+ {result.failing.length - 6} more</li>
            )}
          </ul>
        </div>
      )}

      {pending && (
        <div className="space-y-1">
          <div className="text-sm font-semibold text-gray-700">
            Complete Phase 1 above to evaluate WE-TRUST.
          </div>
          {result.pending.length > 0 && (
            <div className="text-xs text-gray-600">
              Need: {result.pending.map((c) => c.label).join("; ")}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
