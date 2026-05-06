"use client";
import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { initialInput } from "./initialState";
import type { ScreeningInput } from "./types";

const SCREENING_KEY = "screening";

const DEFAULT_SIGNALING = [
  "wss://signaling.yjs.dev",
  "wss://y-webrtc-eu.fly.dev",
];

export type ConnectionState = {
  peers: number;
  ready: boolean;
};

/**
 * Binds a ScreeningInput to a Yjs doc shared via WebRTC.
 * `roomCode` becomes the y-webrtc room name. Peers with the same code share state.
 * Pass `roomCode = null` to operate offline (purely local state).
 */
export function useSharedScreening(roomCode: string | null): {
  input: ScreeningInput;
  setInput: (next: ScreeningInput | ((prev: ScreeningInput) => ScreeningInput)) => void;
  connection: ConnectionState;
  /** Clears the shared doc (purge). Triggers a wipe broadcast to all peers. */
  purge: () => void;
  /** Disconnects the WebRTC provider for this client (does not affect peers). */
  disconnect: () => void;
} {
  const [input, setLocalInput] = useState<ScreeningInput>(() => initialInput());
  const [connection, setConnection] = useState<ConnectionState>({ peers: 0, ready: false });
  const docRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebrtcProvider | null>(null);

  useEffect(() => {
    if (!roomCode) {
      setConnection({ peers: 0, ready: true });
      return;
    }

    const doc = new Y.Doc();
    docRef.current = doc;
    const provider = new WebrtcProvider(roomCode, doc, {
      signaling: DEFAULT_SIGNALING,
    });
    providerRef.current = provider;

    const ymap = doc.getMap<unknown>(SCREENING_KEY);

    const sync = () => {
      const snapshot = ymap.toJSON() as Partial<ScreeningInput>;
      // Merge with initial defaults so missing keys don't collapse the form.
      setLocalInput({ ...initialInput(), ...snapshot } as ScreeningInput);
    };

    ymap.observeDeep(sync);

    // If we're the first peer, seed the doc with our initial state.
    const seedIfEmpty = () => {
      if (ymap.size === 0) {
        doc.transact(() => {
          for (const [k, v] of Object.entries(initialInput())) {
            ymap.set(k, v);
          }
        });
      }
    };
    seedIfEmpty();
    sync();

    const updatePeers = () => {
      const peers = provider.awareness.getStates().size;
      setConnection({ peers: Math.max(0, peers - 1), ready: true });
    };
    provider.awareness.on("change", updatePeers);
    updatePeers();

    return () => {
      ymap.unobserveDeep(sync);
      provider.awareness.off("change", updatePeers);
      provider.destroy();
      doc.destroy();
      docRef.current = null;
      providerRef.current = null;
    };
  }, [roomCode]);

  const setInput = (
    next: ScreeningInput | ((prev: ScreeningInput) => ScreeningInput)
  ) => {
    if (!docRef.current || !roomCode) {
      // Offline — local state only.
      setLocalInput((prev) => (typeof next === "function" ? (next as (p: ScreeningInput) => ScreeningInput)(prev) : next));
      return;
    }
    const doc = docRef.current;
    const ymap = doc.getMap<unknown>(SCREENING_KEY);
    const prev = { ...initialInput(), ...(ymap.toJSON() as Partial<ScreeningInput>) } as ScreeningInput;
    const resolved = typeof next === "function" ? (next as (p: ScreeningInput) => ScreeningInput)(prev) : next;
    doc.transact(() => {
      for (const [k, v] of Object.entries(resolved)) {
        const cur = ymap.get(k);
        if (JSON.stringify(cur) !== JSON.stringify(v)) {
          ymap.set(k, v);
        }
      }
    });
  };

  const purge = () => {
    if (!docRef.current) return;
    const ymap = docRef.current.getMap<unknown>(SCREENING_KEY);
    docRef.current.transact(() => {
      for (const k of Array.from(ymap.keys())) ymap.delete(k);
      for (const [k, v] of Object.entries(initialInput())) ymap.set(k, v);
    });
    providerRef.current?.disconnect();
  };

  const disconnect = () => {
    providerRef.current?.disconnect();
  };

  return { input, setInput, connection, purge, disconnect };
}

/** Generate a 6-char case code, no ambiguous chars (no 0/O, 1/I/L). */
export function generateCaseCode(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let code = "";
  const buf = new Uint32Array(6);
  crypto.getRandomValues(buf);
  for (let i = 0; i < 6; i++) {
    code += alphabet[buf[i] % alphabet.length];
  }
  return `${code.slice(0, 3)}-${code.slice(3)}`;
}
