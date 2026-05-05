"use client";
import React from "react";
import type { ScreeningInput } from "@/lib/types";
import { nowHHMM } from "@/lib/initialState";
import { inputClass } from "./ui/Field";

interface Props {
  value: ScreeningInput;
  onChange: (next: ScreeningInput) => void;
}

export function AttendingDecision({ value, onChange }: Props) {
  const set = <K extends keyof ScreeningInput>(k: K, v: ScreeningInput[K]) =>
    onChange({ ...value, [k]: v });

  const decide = (d: "go" | "no-go") => {
    onChange({
      ...value,
      attending_decision: d,
      attending_decision_time: nowHHMM(),
    });
  };

  const isGo = value.attending_decision === "go";
  const isNoGo = value.attending_decision === "no-go";

  return (
    <section className="bg-white rounded-lg border-2 border-brand p-4 mb-4">
      <h2 className="text-base font-bold text-brand mb-3">
        Attending Decision
      </h2>

      <div className="flex gap-3 mb-4">
        <button
          type="button"
          onClick={() => decide("go")}
          className={
            "flex-1 py-4 rounded-lg text-lg font-bold border-2 transition-colors " +
            (isGo
              ? "bg-emerald-600 border-emerald-600 text-white"
              : "bg-white border-gray-300 text-gray-600 hover:border-emerald-500 hover:text-emerald-700")
          }
        >
          ✓ GO
        </button>
        <button
          type="button"
          onClick={() => decide("no-go")}
          className={
            "flex-1 py-4 rounded-lg text-lg font-bold border-2 transition-colors " +
            (isNoGo
              ? "bg-red-600 border-red-600 text-white"
              : "bg-white border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-700")
          }
        >
          ✗ NO-GO
        </button>
      </div>

      {value.attending_decision && (
        <div
          className={
            "rounded p-2 text-xs font-semibold mb-3 " +
            (isGo
              ? "bg-emerald-50 text-emerald-800"
              : "bg-red-50 text-red-800")
          }
        >
          Decision recorded at {value.attending_decision_time} —{" "}
          {isGo ? "Proceeding with EVT." : "Not proceeding. Document reason below."}
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <label className="block">
          <span className="block text-sm font-semibold text-gray-700 mb-1">
            Attending name
          </span>
          <input
            type="text"
            placeholder="Dr. ..."
            value={value.attending_name}
            onChange={(e) => set("attending_name", e.target.value)}
            className={inputClass()}
          />
        </label>
        <label className="block md:col-span-2">
          <span className="block text-sm font-semibold text-gray-700 mb-1">
            Notes / reason
          </span>
          <textarea
            rows={3}
            placeholder={
              isNoGo
                ? "Reason for no-go (e.g. large core on imaging, patient/family declined, too unstable…)"
                : "Optional notes for go decision, trial enrollment plan, coordinator contacted, etc."
            }
            value={value.attending_notes}
            onChange={(e) => set("attending_notes", e.target.value)}
            className={inputClass("resize-none")}
          />
        </label>
      </div>
    </section>
  );
}
