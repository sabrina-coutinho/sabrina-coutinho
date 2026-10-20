"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const EVENT = "sc-toast";

/** Dispara um toast de qualquer componente: toast("Copiado com sucesso!") */
export function toast(message: string) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: message }));
}

export function Toaster() {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const on = (e: Event) => {
      setMsg((e as CustomEvent<string>).detail);
      clearTimeout(t);
      t = setTimeout(() => setMsg(null), 2200);
    };
    window.addEventListener(EVENT, on);
    return () => { window.removeEventListener(EVENT, on); clearTimeout(t); };
  }, []);

  return (
    <div role="status" aria-live="polite" style={{ position: "fixed", left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 80 }}>
      <AnimatePresence>
        {msg && (
          <motion.div
            key={msg}
            className="toast show"
            style={{ transition: "none" }}
            initial={{ y: 80, opacity: 0, x: "-50%" }}
            animate={{ y: 0, opacity: 1, x: "-50%" }}
            exit={{ y: 80, opacity: 0, x: "-50%" }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
          >
            <span className="badge" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5L20 7" /></svg>
            </span>
            <span>{msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
}
