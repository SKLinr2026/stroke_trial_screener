"use client";
import React, { useEffect, useMemo, useState } from "react";
import { initialInput, nowHHMM } from "@/lib/initialState";
import { deriveInputs } from "@/lib/derive";
import { TRIALS } from "@/lib/trials";
import { evaluateTrial } from "@/lib/trials/evaluate";
import { NIHSSForm } from "@/components/NIHSSForm";
import { PreCTForm } from "@/components/PreCTForm";
import { PostImagingForm } from "@/components/PostImagingForm";
import { EligibilityPanel } from "@/components/EligibilityPanel";
import { CopyableSummary } from "@/components/CopyableSummary";
import { WeTrustGate } from "@/components/WeTrustGate";
import { StepAGate } from "@/components/StepAGate";
import { AttendingDecision } from "@/components/AttendingDecision";

export default function Page() {
  const [input, setInput] = useState(initialInput);

  // Tick current_time every minute so time-window criteria stay live.
  useEffect(() => {
    const id = setInterval(
      () => setInput((prev) => ({ ...prev, current_time: nowHHMM() })),
      60_000
    );
    return () => clearInterval(id);
  }, []);

  const derived = useMemo(() => deriveInputs(input), [input]);

  const results = useMemo(
    () =>
      TRIALS.map((trial) => ({
        trial,
        result: evaluateTrial(trial, input, derived),
      })),
    [input, derived]
  );

  const reset = () => {
    if (confirm("Clear all entries and start a new screening?")) {
      setInput(initialInput());
    }
  };

  return (
    <main className="max-w-7xl mx-auto p-3 md:p-6">
      <header className="bg-brand text-white rounded-lg p-4 mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Stroke Trial Screener</h1>
          <p className="text-xs md:text-sm opacity-90">
            Bedside eligibility for active acute ischemic stroke trials. No PHI stored.
          </p>
        </div>
        <button
          onClick={reset}
          className="text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded font-semibold no-print"
        >
          New screening
        </button>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <div>
          <PreCTForm value={input} onChange={setInput} />
          <NIHSSForm
            value={input.nihss}
            onChange={(nihss) => setInput({ ...input, nihss })}
          />
          {(() => {
            const we = results.find((r) => r.trial.id === "we-trust");
            return we ? <WeTrustGate result={we.result} /> : null;
          })()}
          <PostImagingForm value={input} onChange={setInput} />
          {(() => {
            const stepA = results.find((r) => r.trial.id === "step-a");
            return stepA ? <StepAGate result={stepA.result} /> : null;
          })()}
          <AttendingDecision value={input} onChange={setInput} />
          <CopyableSummary input={input} derived={derived} results={results} />
        </div>
        <div>
          <EligibilityPanel results={results} />
        </div>
      </div>

      <footer className="text-center text-[11px] text-gray-500 mt-6 mb-4">
        Decision-support only — does not replace clinical judgment or formal trial eligibility review.
        <br />
        Created by Dr. SK Lee — Montefiore Neurointervention.
      </footer>
    </main>
  );
}
