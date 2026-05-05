import type { NIHSSItems } from "./types";

export interface NIHSSItemDef {
  key: keyof NIHSSItems;
  number: string;
  title: string;
  options: { value: number; label: string }[];
  allowUntestable?: boolean;
}

export const NIHSS_ITEMS: NIHSSItemDef[] = [
  {
    key: "loc_1a",
    number: "1a",
    title: "Level of consciousness",
    options: [
      { value: 0, label: "0 — Alert; keenly responsive" },
      { value: 1, label: "1 — Not alert, arousable by minor stimulation" },
      { value: 2, label: "2 — Not alert, requires repeated/strong stimulation" },
      { value: 3, label: "3 — Unresponsive or only reflex motor/autonomic" },
    ],
  },
  {
    key: "loc_1b",
    number: "1b",
    title: "LOC questions (month, age)",
    options: [
      { value: 0, label: "0 — Both correct" },
      { value: 1, label: "1 — One correct" },
      { value: 2, label: "2 — Neither correct" },
    ],
  },
  {
    key: "loc_1c",
    number: "1c",
    title: "LOC commands (open/close eyes, grip/release)",
    options: [
      { value: 0, label: "0 — Both tasks correct" },
      { value: 1, label: "1 — One correct" },
      { value: 2, label: "2 — Neither correct" },
    ],
  },
  {
    key: "gaze_2",
    number: "2",
    title: "Best gaze",
    options: [
      { value: 0, label: "0 — Normal" },
      { value: 1, label: "1 — Partial gaze palsy" },
      { value: 2, label: "2 — Forced deviation / total gaze paresis" },
    ],
  },
  {
    key: "visual_3",
    number: "3",
    title: "Visual fields",
    options: [
      { value: 0, label: "0 — No visual loss" },
      { value: 1, label: "1 — Partial hemianopia" },
      { value: 2, label: "2 — Complete hemianopia" },
      { value: 3, label: "3 — Bilateral hemianopia (blind, cortical blindness)" },
    ],
  },
  {
    key: "facial_4",
    number: "4",
    title: "Facial palsy",
    options: [
      { value: 0, label: "0 — Normal symmetric movement" },
      { value: 1, label: "1 — Minor paralysis (flat NLF, asymmetric smile)" },
      { value: 2, label: "2 — Partial paralysis (lower face)" },
      { value: 3, label: "3 — Complete paralysis (upper + lower)" },
    ],
  },
  {
    key: "motor_arm_l_5a",
    number: "5a",
    title: "Motor arm — Left",
    options: [
      { value: 0, label: "0 — No drift, holds 90°/45° for 10 sec" },
      { value: 1, label: "1 — Drift, doesn't hit bed" },
      { value: 2, label: "2 — Some effort against gravity" },
      { value: 3, label: "3 — No effort against gravity" },
      { value: 4, label: "4 — No movement" },
    ],
    allowUntestable: true,
  },
  {
    key: "motor_arm_r_5b",
    number: "5b",
    title: "Motor arm — Right",
    options: [
      { value: 0, label: "0 — No drift" },
      { value: 1, label: "1 — Drift" },
      { value: 2, label: "2 — Some effort against gravity" },
      { value: 3, label: "3 — No effort against gravity" },
      { value: 4, label: "4 — No movement" },
    ],
    allowUntestable: true,
  },
  {
    key: "motor_leg_l_6a",
    number: "6a",
    title: "Motor leg — Left",
    options: [
      { value: 0, label: "0 — No drift, holds 30° for 5 sec" },
      { value: 1, label: "1 — Drift" },
      { value: 2, label: "2 — Some effort against gravity" },
      { value: 3, label: "3 — No effort against gravity" },
      { value: 4, label: "4 — No movement" },
    ],
    allowUntestable: true,
  },
  {
    key: "motor_leg_r_6b",
    number: "6b",
    title: "Motor leg — Right",
    options: [
      { value: 0, label: "0 — No drift" },
      { value: 1, label: "1 — Drift" },
      { value: 2, label: "2 — Some effort against gravity" },
      { value: 3, label: "3 — No effort against gravity" },
      { value: 4, label: "4 — No movement" },
    ],
    allowUntestable: true,
  },
  {
    key: "ataxia_7",
    number: "7",
    title: "Limb ataxia",
    options: [
      { value: 0, label: "0 — Absent" },
      { value: 1, label: "1 — Present in one limb" },
      { value: 2, label: "2 — Present in two limbs" },
    ],
    allowUntestable: true,
  },
  {
    key: "sensory_8",
    number: "8",
    title: "Sensory",
    options: [
      { value: 0, label: "0 — Normal, no sensory loss" },
      { value: 1, label: "1 — Mild–moderate loss" },
      { value: 2, label: "2 — Severe to total loss" },
    ],
  },
  {
    key: "language_9",
    number: "9",
    title: "Best language",
    options: [
      { value: 0, label: "0 — No aphasia" },
      { value: 1, label: "1 — Mild–moderate aphasia" },
      { value: 2, label: "2 — Severe aphasia" },
      { value: 3, label: "3 — Mute, global aphasia" },
    ],
  },
  {
    key: "dysarthria_10",
    number: "10",
    title: "Dysarthria",
    options: [
      { value: 0, label: "0 — Normal" },
      { value: 1, label: "1 — Mild–moderate slurring" },
      { value: 2, label: "2 — Severe / unintelligible / mute" },
    ],
    allowUntestable: true,
  },
  {
    key: "extinction_11",
    number: "11",
    title: "Extinction / inattention",
    options: [
      { value: 0, label: "0 — No abnormality" },
      { value: 1, label: "1 — Inattention to one modality" },
      { value: 2, label: "2 — Profound hemi-inattention to >1 modality" },
    ],
  },
];

export function nihssTotal(items: NIHSSItems): number | null {
  let total = 0;
  let anyAnswered = false;
  for (const def of NIHSS_ITEMS) {
    const v = items[def.key];
    if (v === null || v === undefined) continue;
    anyAnswered = true;
    total += v;
  }
  return anyAnswered ? total : null;
}

export function nihssComplete(items: NIHSSItems): boolean {
  return NIHSS_ITEMS.every((def) => {
    const v = items[def.key];
    return v !== null && v !== undefined;
  });
}
