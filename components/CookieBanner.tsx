"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "./Toast";

/**
 * Consentimento de cookies LGPD (art. 7º, I e art. 8º):
 *  - nada além do essencial roda antes da escolha
 *  - "Só essenciais" tem o mesmo peso visual que "Aceitar"
 *  - escolha granular, registrada com data, e revogável pelo rodapé
 */
export const CONSENT_KEY = "sc-consent-v1";
export type Consent = { analytics: boolean; marketing: boolean; at: string };
const OPEN_EVENT = "sc-open-cookies";

export function getConsent(): Consent | null {
  try { return JSON.parse(localStorage.getItem(CONSENT_KEY) ?? "null"); } catch { return null; }
}

export function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const c = getConsent();
    if (!c) setOpen(true); else { setAnalytics(c.analytics); setMarketing(c.marketing); }
    const reopen = () => { setOpen(true); setCustom(true); };
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  function save(a: boolean, m: boolean) {
    const c: Consent = { analytics: a, marketing: m, at: new Date().toISOString() };
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify(c)); } catch { /* navegação privada */ }
    window.dispatchEvent(new CustomEvent("sc-consent", { detail: c })); // scripts de medição escutam isso
    setOpen(false); setCustom(false);
    toast("Preferências salvas");
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="cookie" role="dialog" aria-label="Preferências de cookies" style={{ animation: "none" }}
          initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ duration: 0.45 }}>
          <b>Sua privacidade importa 🤍</b>
          <p>Uso cookies essenciais para o site funcionar e, só com a sua permissão, cookies de medição para entender quais conteúdos ajudam mais. Você decide e pode mudar quando quiser.</p>
          {custom && (
            <div className="prefs">
              <label><input type="checkbox" checked disabled /> Essenciais (sempre ativos)</label>
              <label><input type="checkbox" checked={analytics} onChange={e => setAnalytics(e.target.checked)} /> Medição de audiência</label>
              <label><input type="checkbox" checked={marketing} onChange={e => setMarketing(e.target.checked)} /> Marketing e parceiros</label>
            </div>
          )}
          <div className="acts">
            <button className="btn" style={{ padding: "11px 18px" }} onClick={() => save(true, true)}>Aceitar todos</button>
            <button className="btn ghost" style={{ padding: "11px 18px" }} onClick={() => save(false, false)}>Só essenciais</button>
            <button className="mini" onClick={() => (custom ? save(analytics, marketing) : setCustom(true))}>{custom ? "Salvar escolhas" : "Personalizar"}</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ReopenCookies() {
  return <button className="linky" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>Preferências de cookies</button>;
}
