"use client";
import React from "react";
import type {
  OcclusionSite,
  ScreeningInput,
  TumorStatus,
  YesNoUnknown,
} from "@/lib/types";
import { Field, inputClass } from "./ui/Field";
import { YNU } from "./ui/YNU";

interface Props {
  value: ScreeningInput;
  onChange: (next: ScreeningInput) => void;
}

const OCCLUSION_OPTIONS: { v: OcclusionSite; label: string }[] = [
  { v: "unknown", label: "—" },
  { v: "none", label: "No occlusion" },
  { v: "ICA", label: "ICA" },
  { v: "M1", label: "M1" },
  { v: "M2_dominant", label: "M2 (dominant)" },
  { v: "M2_nondominant_or_codominant", label: "M2 (non-dominant or co-dominant)" },
  { v: "M3", label: "M3" },
  { v: "distal_other", label: "Other distal (A/P branches)" },
];

export function PostImagingForm({ value, onChange }: Props) {
  const set = <K extends keyof ScreeningInput>(k: K, v: ScreeningInput[K]) =>
    onChange({ ...value, [k]: v });

  const setYNU = (k: keyof ScreeningInput) => (v: YesNoUnknown) =>
    onChange({ ...value, [k]: v } as ScreeningInput);

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <h2 className="text-base font-bold text-brand mb-1">
        Phase 2 — Post-CT / CTA
      </h2>
      <p className="text-xs text-gray-600 mb-3">
        STEP-A criteria evaluated once imaging is in.
      </p>

      <div className="grid gap-3 md:grid-cols-3 mb-3">
        <Field label="Imaging modality">
          <select
            value={value.imaging_modality ?? ""}
            onChange={(e) =>
              set(
                "imaging_modality",
                (e.target.value || null) as ScreeningInput["imaging_modality"]
              )
            }
            className={inputClass()}
          >
            <option value="">—</option>
            <option value="CT">CT</option>
            <option value="MRI">MRI</option>
          </select>
        </Field>
        <Field label="Imaging age (min)" hint="Repeat if > 120 min before puncture">
          <input
            type="number"
            value={value.imaging_age_minutes ?? ""}
            onChange={(e) =>
              set(
                "imaging_age_minutes",
                e.target.value === "" ? null : Number(e.target.value)
              )
            }
            className={inputClass()}
          />
        </Field>
        <Field label="ASPECTS (0–10)">
          <input
            type="number"
            min={0}
            max={10}
            value={value.aspects ?? ""}
            onChange={(e) =>
              set("aspects", e.target.value === "" ? null : Number(e.target.value))
            }
            className={inputClass()}
          />
        </Field>

        <Field label="Occlusion site" className="md:col-span-2">
          <select
            value={value.occlusion_site}
            onChange={(e) =>
              set("occlusion_site", e.target.value as OcclusionSite)
            }
            className={inputClass()}
          >
            {OCCLUSION_OPTIONS.map((o) => (
              <option key={o.v} value={o.v}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Midline shift (mm)">
          <input
            type="number"
            step="0.5"
            value={value.midline_shift_mm ?? ""}
            onChange={(e) =>
              set(
                "midline_shift_mm",
                e.target.value === "" ? null : Number(e.target.value)
              )
            }
            className={inputClass()}
          />
        </Field>

        <Field label="Intracranial tumor">
          <select
            value={value.intracranial_tumor ?? ""}
            onChange={(e) =>
              set(
                "intracranial_tumor",
                (e.target.value || null) as TumorStatus | null
              )
            }
            className={inputClass()}
          >
            <option value="">—</option>
            <option value="none">None</option>
            <option value="small_meningioma_asymptomatic">
              Small meningioma ≤ 3 cm, asymptomatic
            </option>
            <option value="other">Other tumor</option>
          </select>
        </Field>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          CTA / Imaging findings
        </h3>
        <div className="grid gap-2 md:grid-cols-2">
          {([
            ["ich_present", "Acute ICH on imaging"],
            ["tandem_occlusion", "Tandem occlusion"],
            ["multi_territory_occlusion", "Multiple territory occlusion"],
            ["chronic_occlusion", "Chronic intracranial occlusion"],
            ["intracranial_dissection", "Intracranial dissection"],
            ["icad_suspected", "Suspected ICAD"],
            ["cerebral_vasculitis_imaging", "Cerebral vasculitis on imaging"],
            ["vascular_access_feasible", "Vascular access feasible (anatomy OK)"],
            ["tmax_4s_deficit_in_m2_m3", "Tmax > 4s perfusion deficit in M2/M3 territory"],
            ["core_lt50pct_territory", "Core < 50% of territory (if onset > 6 h)"],
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
