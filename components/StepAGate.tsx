"use client";
import React from "react";
import type { TrialResult } from "@/lib/trials/types";

interface Props {
  result: TrialResult;
}

export function StepAGate({ result }: Props) {
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
          ◆ STEP Domain A eligibility
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
          {result.matched_arm_name && (
            <div className="text-base font-bold text-emerald-800">
              Eligible — {result.matched_arm_name}
            </div>
          )}
          <div className="text-sm text-emerald-900">
            Contact study coordinator to proceed with enrollment.
          </div>
          {result.warnings.length > 0 && (
            <ul className="text-xs text-amber-800 list-disc list-inside mt-1">
              {result.warnings.map((c) => (
                <li key={c.id}>Soft flag: {c.label}</li>
              ))}
            </ul>
          )}
          {result.arm_results && (
            <div className="mt-2 pt-2 border-t border-emerald-200 grid grid-cols-2 gap-1">
              {result.arm_results.map((a) => (
                <div key={a.arm_id} className="text-xs flex items-center gap-1.5">
                  <span
                    className={
                      "px-1.5 py-0.5 rounded font-bold " +
                      (a.status === "eligible"
                        ? "bg-emerald-600 text-white"
                        : a.status === "ineligible"
                        ? "bg-red-600 text-white"
                        : "bg-gray-400 text-white")
                    }
                  >
                    {a.status === "eligible" ? "✓" : a.status === "ineligible" ? "✗" : "…"}
                  </span>
                  <span className="text-gray-700">{a.arm_name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {ineligible && (
        <div className="space-y-1">
          <div className="text-base font-bold text-red-800">
            Not eligible for STEP Domain A.
          </div>
          <ul className="text-xs text-red-900 list-disc list-inside">
            {result.failing.slice(0, 8).map((c) => (
              <li key={c.id}>{c.label}</li>
            ))}
            {result.failing.length > 8 && (
              <li>+ {result.failing.length - 8} more</li>
            )}
          </ul>
          {result.arm_results && (
            <div className="mt-2 pt-2 border-t border-red-200 grid grid-cols-2 gap-1">
              {result.arm_results.map((a) => (
                <div key={a.arm_id} className="text-xs flex items-center gap-1.5">
                  <span
                    className={
                      "px-1.5 py-0.5 rounded font-bold " +
                      (a.status === "eligible"
                        ? "bg-emerald-600 text-white"
                        : a.status === "ineligible"
                        ? "bg-red-600 text-white"
                        : "bg-gray-400 text-white")
                    }
                  >
                    {a.status === "eligible" ? "✓" : a.status === "ineligible" ? "✗" : "…"}
                  </span>
                  <span className="text-gray-700">{a.arm_name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {pending && (
        <div className="space-y-1">
          <div className="text-sm font-semibold text-gray-700">
            Complete imaging fields above to evaluate STEP Domain A.
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
