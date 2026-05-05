"use client";
import React from "react";
import { NIHSS_ITEMS, nihssTotal, nihssComplete } from "@/lib/nihss";
import type { NIHSSItems } from "@/lib/types";

interface Props {
  value: NIHSSItems;
  onChange: (next: NIHSSItems) => void;
}

export function NIHSSForm({ value, onChange }: Props) {
  const total = nihssTotal(value);
  const complete = nihssComplete(value);

  const setItem = (key: keyof NIHSSItems, v: number | null) => {
    onChange({ ...value, [key]: v });
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <header className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
        <h2 className="text-base font-bold text-brand">NIHSS — Detailed Exam</h2>
        <div className="text-right">
          <div className="text-xs text-gray-500">
            {complete ? "Complete" : "In progress"}
          </div>
          <div
            className={
              "text-2xl font-bold " +
              (total === null ? "text-gray-400" : "text-brand")
            }
          >
            {total ?? "—"}{" "}
            <span className="text-xs font-medium text-gray-500">/ 42</span>
          </div>
        </div>
      </header>

      <p className="text-xs text-gray-600 mb-3">
        Detailed NIHSS required for WE-TRUST. Score each item; total auto-updates.
        Untestable counts as 0 per protocol.
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        {NIHSS_ITEMS.map((item) => {
          const v = value[item.key];
          return (
            <div
              key={item.key}
              className="border border-gray-200 rounded-md p-2.5 bg-gray-50"
            >
              <div className="flex items-baseline gap-2 mb-1.5">
                <span className="font-bold text-brand text-sm">{item.number}</span>
                <span className="text-sm font-semibold text-gray-800">
                  {item.title}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {item.options.map((o) => {
                  const active = v === o.value;
                  return (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => setItem(item.key, o.value)}
                      className={
                        "px-2.5 py-1 text-xs rounded border transition-colors " +
                        (active
                          ? "bg-brand text-white border-brand"
                          : "bg-white text-gray-700 border-gray-300 hover:border-brand hover:text-brand")
                      }
                      title={o.label}
                    >
                      {o.label.split(" — ")[0]}
                    </button>
                  );
                })}
                {item.allowUntestable && (
                  <button
                    type="button"
                    onClick={() => setItem(item.key, 0)}
                    className={
                      "px-2.5 py-1 text-xs rounded border transition-colors " +
                      "bg-white text-gray-500 border-gray-300 hover:border-gray-500 italic"
                    }
                    title="Untestable (scored 0)"
                  >
                    UN
                  </button>
                )}
              </div>
              {v !== null && v !== undefined && (
                <div className="text-[11px] text-gray-600 mt-1.5 italic">
                  {item.options.find((o) => o.value === v)?.label}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
