"use client";
import React from "react";
import type { ScreeningInput, YesNoUnknown } from "@/lib/types";
import { Field, inputClass } from "./ui/Field";
import { YNU } from "./ui/YNU";

export type Role = "resident" | "attending" | "neuro";

interface Props {
  value: ScreeningInput;
  onChange: (next: ScreeningInput) => void;
  role?: Role;
}

export function PreCTForm({ value, onChange, role = "resident" }: Props) {
  const set = <K extends keyof ScreeningInput>(k: K, v: ScreeningInput[K]) =>
    onChange({ ...value, [k]: v });

  const setYNU = (k: keyof ScreeningInput) => (v: YesNoUnknown) =>
    onChange({ ...value, [k]: v } as ScreeningInput);

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <h2 className="text-base font-bold text-brand mb-1">
        Phase 1 — Pre-CT (Stroke Alert / ED arrival)
      </h2>
      <p className="text-xs text-gray-600 mb-3">
        Screen WE-TRUST first. If eligible → DTAS, skip CT.
      </p>

      {/* WE-TRUST transfer pre-screen — asked first */}
      <div className="border border-brand/30 rounded-md bg-brand/5 p-3 mb-4 space-y-3">
        <div className="text-xs font-bold text-brand uppercase tracking-wide mb-1">
          WE-TRUST pre-screen
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-gray-800">
            1. Transferred from another hospital?
          </span>
          <YNU
            value={value.transferred_from_other_hospital}
            onChange={setYNU("transferred_from_other_hospital")}
            name="Transferred from another hospital"
          />
        </div>
        {value.transferred_from_other_hospital === "yes" && (
          <div className="pl-4 border-l-2 border-brand/30 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-gray-800">
                2. Does the patient have a head CT from the outside hospital?
                <span className="block text-xs font-normal text-gray-500 mt-0.5">
                  Yes → not eligible for WE-TRUST &nbsp;|&nbsp; No → proceed to main criteria
                </span>
              </span>
              <YNU
                value={value.has_ct_from_other_hospital}
                onChange={setYNU("has_ct_from_other_hospital")}
                name="Has CT from other hospital"
              />
            </div>
            {value.has_ct_from_other_hospital === "yes" && (
              <div className="flex items-center gap-2 bg-red-100 border border-red-400 rounded px-3 py-2">
                <span className="text-red-700 font-bold text-lg leading-none">✗</span>
                <span className="text-sm font-bold text-red-800">
                  WE-TRUST NOT ELIGIBLE — patient has outside hospital CT.
                  Proceed with standard workflow and screen STEP-A below.
                </span>
              </div>
            )}
            {value.has_ct_from_other_hospital === "no" && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-400 rounded px-3 py-2">
                <span className="text-emerald-700 font-bold text-lg leading-none">✓</span>
                <span className="text-sm font-semibold text-emerald-800">
                  No outside CT — eligible to proceed to main WE-TRUST criteria below.
                </span>
              </div>
            )}
          </div>
        )}

        <div className="pt-2 border-t border-brand/20">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-gray-800">
              3. Angio suite + EVT team immediately available?
              <span className="block text-xs font-normal text-gray-500 mt-0.5">
                Weekdays 8 AM–5 PM: team is on standby — call not needed.
                Off-hours: call NIR attending to confirm.
              </span>
            </span>
            <YNU
              value={value.angio_team_immediately_available}
              onChange={setYNU("angio_team_immediately_available")}
              name="Angio team immediately available"
            />
          </div>
          {value.angio_team_immediately_available === "no" && (
            <div className="mt-2 flex items-center gap-2 bg-red-100 border border-red-400 rounded px-3 py-2">
              <span className="text-red-700 font-bold text-lg leading-none">✗</span>
              <span className="text-sm font-bold text-red-800">
                WE-TRUST NOT ELIGIBLE — angio suite / EVT team not immediately available.
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3 mb-4">
        <Field label="Age" required>
          <input
            type="number"
            min={0}
            max={120}
            value={value.age ?? ""}
            onChange={(e) =>
              set("age", e.target.value === "" ? null : Number(e.target.value))
            }
            className={inputClass()}
          />
        </Field>
        <Field label="Sex">
          <select
            value={value.sex}
            onChange={(e) => set("sex", e.target.value as ScreeningInput["sex"])}
            className={inputClass()}
          >
            <option value="unknown">—</option>
            <option value="M">M</option>
            <option value="F">F</option>
          </select>
        </Field>
        <Field label="Premorbid mRS" required>
          <select
            value={value.pre_mrs ?? ""}
            onChange={(e) =>
              set(
                "pre_mrs",
                e.target.value === "" ? null : Number(e.target.value)
              )
            }
            className={inputClass()}
          >
            <option value="">—</option>
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="border-t border-gray-100 pt-3 mb-3">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Onset / Timing</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <Field label="Onset category" required>
            <select
              value={value.wakeup_status ?? ""}
              onChange={(e) =>
                set(
                  "wakeup_status",
                  (e.target.value || null) as ScreeningInput["wakeup_status"]
                )
              }
              className={inputClass()}
            >
              <option value="">—</option>
              <option value="witnessed">Witnessed onset</option>
              <option value="wakeup">Wake-up stroke</option>
            </select>
          </Field>
          <Field label="LKWT (HH:MM)" required hint="Last Known Well Time">
            <input
              type="time"
              value={value.lkw_time ?? ""}
              onChange={(e) => set("lkw_time", e.target.value || null)}
              className={inputClass()}
            />
          </Field>
          <Field label="Current time (auto)">
            <input
              type="time"
              value={value.current_time}
              onChange={(e) => set("current_time", e.target.value)}
              className={inputClass()}
            />
          </Field>
        </div>
        {value.wakeup_status === "wakeup" && (
          <div className="mt-3 flex items-center justify-between gap-2 px-2 py-1.5 bg-gray-50 rounded border border-gray-100">
            <span className="text-xs text-gray-700 flex-1">
              Symptom discovery &lt; 6h before ED arrival? (WE-TRUST wake-up requirement)
            </span>
            <YNU
              value={value.wakeup_discovery_lt6h}
              onChange={setYNU("wakeup_discovery_lt6h")}
              name="Discovery less than 6h before arrival"
            />
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 pt-3 mb-3">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Bedside vitals</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="SBP / DBP">
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="SBP"
                value={value.sbp ?? ""}
                onChange={(e) =>
                  set("sbp", e.target.value === "" ? null : Number(e.target.value))
                }
                className={inputClass()}
              />
              <input
                type="number"
                placeholder="DBP"
                value={value.dbp ?? ""}
                onChange={(e) =>
                  set("dbp", e.target.value === "" ? null : Number(e.target.value))
                }
                className={inputClass()}
              />
            </div>
          </Field>
        </div>
      </div>

      {/* IV thrombolysis decision — attending only */}
      {role === "attending" && (
        <div className="border-t border-gray-100 pt-3 mb-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Stroke attending decision
          </h3>
          <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-300 rounded">
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-amber-900">
              <input
                type="checkbox"
                checked={value.thrombolysis_planned}
                onChange={(e) => set("thrombolysis_planned", e.target.checked)}
                className="w-4 h-4"
              />
              IV thrombolysis planned
            </label>
            <span className="text-xs text-amber-800 flex-1">
              When checked: resident is prompted to draw glucose, platelets, INR.
              BP &gt; 185/110 also becomes an exclusion.
            </span>
          </div>
        </div>
      )}

      {/* Labs (Glucose / Platelets / INR) — visible to everyone *only* when attending has triggered thrombolysis */}
      {value.thrombolysis_planned && (
        <div className="border-t border-gray-100 pt-3 mb-3">
          {role === "resident" && (
            <div className="mb-3 flex items-start gap-2 bg-red-100 border-2 border-red-500 rounded-md px-3 py-2">
              <span className="text-red-700 font-bold text-xl leading-none">⚠</span>
              <div className="flex-1">
                <div className="text-sm font-bold text-red-800">
                  Stroke attending has requested IV thrombolysis.
                </div>
                <div className="text-xs text-red-700 mt-0.5">
                  Please draw and enter <strong>glucose</strong>, <strong>platelets</strong>, and <strong>INR</strong> below.
                </div>
              </div>
            </div>
          )}
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Labs (for thrombolysis safety)
          </h3>
          <div className="grid gap-3 md:grid-cols-3">
            <Field label="Glucose (mg/dL)" required>
              <input
                type="number"
                value={value.glucose_mgdl ?? ""}
                onChange={(e) =>
                  set(
                    "glucose_mgdl",
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
                className={inputClass()}
              />
            </Field>
            <Field label="Platelets (/μL)" required>
              <input
                type="number"
                value={value.platelets_per_uL ?? ""}
                onChange={(e) =>
                  set(
                    "platelets_per_uL",
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
                className={inputClass()}
              />
            </Field>
            <Field label="INR" required>
              <input
                type="number"
                step="0.1"
                value={value.inr ?? ""}
                onChange={(e) =>
                  set("inr", e.target.value === "" ? null : Number(e.target.value))
                }
                className={inputClass()}
              />
            </Field>
          </div>
        </div>
      )}

      <div className="border-t border-gray-100 pt-3">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">History / Status</h3>
        <div className="grid gap-2 md:grid-cols-2">
          {([
            ["seizure_at_onset", "Seizure at onset (precluding NIHSS)"],
            ["seizure_between_onset_and_enrollment", "Seizure between onset and enrollment"],
            ["extreme_vomiting_or_agitation", "Extreme vomiting / agitation"],
            ["pregnancy", "Pregnancy"],
            ["in_hospital_stroke", "In-hospital stroke"],
            ["contrast_allergy", "Contrast allergy"],
            ["terminal_illness_lt1y", "Terminal illness < 1 year"],
            ["terminal_illness_lt6mo", "Terminal illness < 6 months"],
            ["cerebral_vasculitis_known", "Known Cerebral vasculitis"],
            ["coagulopathy_known", "Known coagulopathy / hemorrhagic diathesis"],
            ["septic_embolus_or_endocarditis", "Suspected septic embolus / endocarditis"],
          ] as [keyof ScreeningInput, string][]).map(([key, label]) => (
            <div
              key={key}
              className="flex items-center justify-between gap-2 px-2 py-1.5 bg-gray-50 rounded border border-gray-100"
            >
              <span className="text-xs text-gray-700 flex-1">{label}</span>
              <YNU
                value={value[key] as YesNoUnknown}
                onChange={setYNU(key)}
                name={label}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
