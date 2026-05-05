import React from "react";

interface FieldProps {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Field({ label, hint, required, children, className = "" }: FieldProps) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-600 ml-0.5">*</span>}
      </span>
      {children}
      {hint && <span className="block text-xs text-gray-500 mt-1">{hint}</span>}
    </label>
  );
}

export function inputClass(extra = "") {
  return (
    "w-full px-3 py-2 border border-gray-300 rounded-md text-sm " +
    "focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand " +
    extra
  );
}
