"use client";
import React, { useEffect, useMemo, useState } from "react";
import { nowHHMM } from "@/lib/initialState";
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
import { useSharedScreening, generateCaseCode } from "@/lib/sync";

type Role = "resident" | "attending" | "neuro";

function readQuery(): { caseCode: string | null; role: Role | null } {
  if (typeof window === "undefined") return { caseCode: null, role: null };
  const p = new URLSearchParams(window.location.search);
  const c = p.get("case");
  const r = p.get("role");
  const role: Role | null =
    r === "resident" || r === "attending" || r === "neuro" ? r : null;
  return { caseCode: c ? c.toUpperCase() : null, role };
}

function setQuery(caseCode: string, role: Role) {
  const p = new URLSearchParams();
  p.set("case", caseCode);
  p.set("role", role);
  const qs = `?${p.toString()}`;
  window.history.replaceState(null, "", qs);
}

export default function Page() {
  const [{ caseCode, role }, setRouting] = useState<{
    caseCode: string | null;
    role: Role | null;
  }>({ caseCode: null, role: null });

  // Read URL params on mount only (static export, no searchParams hook).
  useEffect(() => {
    setRouting(readQuery());
  }, []);

  if (!caseCode || !role) {
    return (
      <Entry
        onCreate={(r) => {
          const code = generateCaseCode();
          setQuery(code, r);
          setRouting({ caseCode: code, role: r });
        }}
        onJoin={(code, r) => {
          setQuery(code, r);
          setRouting({ caseCode: code, role: r });
        }}
      />
    );
  }

  return <Screener caseCode={caseCode} role={role} />;
}

function Screener({ caseCode, role }: { caseCode: string; role: Role }) {
  const { input, setInput, connection } = useSharedScreening(caseCode);

  // Tick current_time every minute (local-only; not synced as a "change").
  useEffect(() => {
    const id = setInterval(
      () => setInput((prev) => ({ ...prev, current_time: nowHHMM() })),
      60_000
    );
    return () => clearInterval(id);
  }, [setInput]);

  const derived = useMemo(() => deriveInputs(input), [input]);

  const results = useMemo(
    () =>
      TRIALS.map((trial) => ({
        trial,
        result: evaluateTrial(trial, input, derived),
      })),
    [input, derived]
  );

  const roleLabel: Record<Role, string> = {
    resident: "Resident",
    attending: "Stroke Attending",
    neuro: "Neurointerventionist",
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
        <div className="flex flex-col items-end gap-1 text-right">
          <div className="text-[11px] opacity-80">{roleLabel[role]}</div>
          <div className="font-mono text-sm bg-white/15 px-2 py-0.5 rounded">
            {caseCode}
          </div>
          <div className="text-[10px] opacity-70">
            {connection.ready
              ? `${connection.peers} peer${connection.peers === 1 ? "" : "s"} connected`
              : "Connecting…"}
          </div>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <div>
          <PreCTForm value={input} onChange={setInput} role={role} />
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
          {role === "resident" && (
            <CopyableSummary input={input} derived={derived} results={results} />
          )}
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

function Entry({
  onCreate,
  onJoin,
}: {
  onCreate: (role: Role) => void;
  onJoin: (code: string, role: Role) => void;
}) {
  const [joinCode, setJoinCode] = useState("");
  const [joinRole, setJoinRole] = useState<Role>("attending");

  const cleanCode = (s: string) =>
    s.toUpperCase().replace(/[^A-Z2-9-]/g, "");

  return (
    <main className="max-w-3xl mx-auto p-4 md:p-8">
      <header className="bg-brand text-white rounded-lg p-5 mb-6">
        <h1 className="text-2xl font-bold">Stroke Trial Screener</h1>
        <p className="text-sm opacity-90 mt-1">
          Bedside eligibility for active acute ischemic stroke trials. No PHI stored.
        </p>
      </header>

      <section className="bg-white border border-gray-200 rounded-lg p-5 mb-4 shadow-sm">
        <h2 className="text-base font-semibold mb-2">Start a new case (resident)</h2>
        <p className="text-xs text-gray-600 mb-3">
          Generates a short case code. Text the code to the stroke attending and the neurointerventionist so they can join.
        </p>
        <button
          onClick={() => onCreate("resident")}
          className="w-full md:w-auto px-4 py-2 bg-brand text-white rounded font-semibold hover:opacity-90"
        >
          New case →
        </button>
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
        <h2 className="text-base font-semibold mb-2">Join an existing case</h2>
        <p className="text-xs text-gray-600 mb-3">
          Enter the case code you received and pick your role.
        </p>
        <div className="grid gap-3 md:grid-cols-[1fr_12rem_auto] items-end">
          <label className="text-xs font-medium text-gray-700">
            Case code
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(cleanCode(e.target.value))}
              placeholder="ABC-123"
              maxLength={7}
              className="mt-1 w-full font-mono uppercase tracking-wider px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand focus:border-brand text-base"
            />
          </label>
          <label className="text-xs font-medium text-gray-700">
            Role
            <select
              value={joinRole}
              onChange={(e) => setJoinRole(e.target.value as Role)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand focus:border-brand text-sm"
            >
              <option value="attending">Stroke Attending</option>
              <option value="neuro">Neurointerventionist</option>
              <option value="resident">Resident (rejoin)</option>
            </select>
          </label>
          <button
            onClick={() => {
              const code = cleanCode(joinCode);
              if (code.length >= 6) onJoin(code.includes("-") ? code : `${code.slice(0, 3)}-${code.slice(3)}`, joinRole);
            }}
            disabled={cleanCode(joinCode).replace(/-/g, "").length !== 6}
            className="px-4 py-2 bg-brand text-white rounded font-semibold hover:opacity-90 disabled:opacity-40"
          >
            Join →
          </button>
        </div>
      </section>

      <footer className="text-center text-[11px] text-gray-500 mt-8">
        Decision-support only — does not replace clinical judgment.
        <br />
        Created by Dr. SK Lee — Montefiore Neurointervention.
      </footer>
    </main>
  );
}
