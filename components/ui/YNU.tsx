import React from "react";
import type { YesNoUnknown } from "@/lib/types";

interface YNUProps {
  value: YesNoUnknown;
  onChange: (v: YesNoUnknown) => void;
  name: string;
}

const opts: { v: YesNoUnknown; label: string }[] = [
  { v: "yes", label: "Yes" },
  { v: "no", label: "No" },
  { v: "unknown", label: "?" },
];

export function YNU({ value, onChange, name }: YNUProps) {
  return (
    <div className="inline-flex rounded-md border border-gray-300 overflow-hidden text-sm">
      {opts.map((o, idx) => {
        const active = value === o.v;
        return (
          <button
            key={o.v}
            type="button"
            onClick={() => onChange(o.v)}
            className={
              "px-3 py-1.5 transition-colors " +
              (active
                ? o.v === "yes"
                  ? "bg-red-600 text-white"
                  : o.v === "no"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-400 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50") +
              (idx > 0 ? " border-l border-gray-300" : "")
            }
            aria-label={`${name} ${o.label}`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
