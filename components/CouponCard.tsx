"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { CATEGORY_LABEL, type Coupon } from "@/lib/content";
import { copyToClipboard, toast } from "./Toast";

const SPARKS = Array.from({ length: 10 }, (_, i) => (Math.PI * 2 * i) / 10);

/**
 * Cupom em formato de ticket com picote.
 * Clique → copia o código, botão vira "Copiado!" com check desenhado, faíscas e toast.
 */
export function CouponCard({ coupon, index = 0 }: { coupon: Coupon; index?: number }) {
  const [copied, setCopied] = useState(false);
  const [burst, setBurst] = useState(0);
  const codeRef = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2600);
    return () => clearTimeout(t);
  }, [copied, burst]);

  async function onCopy() {
    const ok = await copyToClipboard(coupon.code);
    if (!ok && codeRef.current) {
      // Fallback: seleciona o código para o usuário copiar manualmente
      const r = document.createRange(); r.selectNodeContents(codeRef.current);
      const s = window.getSelection(); s?.removeAllRanges(); s?.addRange(r);
    }
    setCopied(true); setBurst(b => b + 1);
    toast(ok ? `Cupom ${coupon.code} copiado com sucesso!` : "Cupom selecionado: use Copiar");
  }

  return (
    <motion.article
      layout
      className="ticket"
      initial={reduce ? false : { opacity: 0, y: 28, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
      transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1], delay: (index % 3) * 0.06 }}
      whileHover={reduce ? undefined : { y: -6, rotate: -0.4 }}
    >
      <div className="ticket-body">
        <div className="ticket-top"><span className="cat">{CATEGORY_LABEL[coupon.cat]}</span></div>
        <h3>{coupon.partner}</h3>
        <p>{coupon.desc}</p>
        <p className="benefit">{coupon.benefit}<small>{coupon.unit}</small></p>
      </div>

      <div className="ticket-stub">
        <span className="code" ref={codeRef}>{coupon.code}</span>
        <motion.button
          type="button"
          className={`copy${copied ? " done" : ""}`}
          onClick={onCopy}
          whileTap={{ scale: 0.95 }}
          aria-label={`Copiar cupom ${coupon.code}`}
          style={{ animation: "none" }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span key="ok" style={{ display: "inline-flex", gap: 8, alignItems: "center" }}
                initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.2 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <motion.path d="M5 12l5 5L20 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.05 }} />
                </svg>
                Copiado!
              </motion.span>
            ) : (
              <motion.span key="idle" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.2 }}>
                Copiar cupom
              </motion.span>
            )}
          </AnimatePresence>

          {!reduce && copied && (
            <span className="burst" aria-hidden="true" key={burst}>
              {SPARKS.map((a, i) => (
                <motion.i key={i} style={{ animation: "none" }}
                  initial={{ x: "-50%", y: "-50%", opacity: 1, scale: 1 }}
                  animate={{ x: `calc(-50% + ${Math.cos(a) * 42}px)`, y: `calc(-50% + ${Math.sin(a) * 42}px)`, opacity: 0, scale: 0.2 }}
                  transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }} />
              ))}
            </span>
          )}
        </motion.button>
      </div>
    </motion.article>
  );
}
