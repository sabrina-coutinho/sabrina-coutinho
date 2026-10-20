"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { INSTAGRAM } from "@/lib/content";

const WORDS = ["mãe", "fitness", "moda", "lifestyle", "evolução"];
const ease = [0.2, 0.7, 0.2, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI(n => (n + 1) % WORDS.length), 2400);
    return () => clearInterval(t);
  }, [reduce]);

  const item = (d: number) => ({
    initial: reduce ? false : { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease, delay: d },
  });

  return (
    <section className="hero" id="topo">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <motion.p className="eyebrow" {...item(0)}>Brasília — DF · Criadora de conteúdo</motion.p>
          <motion.h1 {...item(0.08)}><span>Sabrina</span><span className="l2">Coutinho</span></motion.h1>
          <motion.a className="handle" href={INSTAGRAM} target="_blank" rel="noopener noreferrer" {...item(0.16)}>
            <i className="dot" aria-hidden="true" />@sabrinaa.coutinho
          </motion.a>
          <motion.p className="rotator" {...item(0.24)}>
            Mostrando minha rotina de{" "}
            <span style={{ display: "inline-grid", minWidth: "6.5ch" }}>
              <AnimatePresence mode="wait">
                <motion.span key={WORDS[i]} className="word" style={{ transition: "none" }}
                  initial={{ opacity: 0, y: 12, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -12, filter: "blur(4px)" }} transition={{ duration: 0.35 }}>
                  {WORDS[i]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.p>
          <motion.p className="subline" {...item(0.3)}>
            <span>Mãe • Fitness • Moda • Lifestyle</span><span>Atleta Híbrida em Construção</span><span>Brasília - DF</span>
          </motion.p>
          <motion.div className="hero-ctas" {...item(0.36)}>
            <a className="btn" href="#contato">Trabalhe Comigo / Mídia Kit <span className="arrow" aria-hidden="true">→</span></a>
            <a className="btn ghost" href="#cupons">Ver Cupons Exclusivos</a>
          </motion.div>
          <motion.div className="hero-meta" {...item(0.42)}>
            <div><b>6.280+</b><small>seguidores</small></div>
            <div><b>5</b><small>pilares de conteúdo</small></div>
            <div><b>DF</b><small>base em Brasília</small></div>
          </motion.div>
        </div>

        <motion.figure className="portrait" style={{ margin: 0, animation: "none" }}
          initial={reduce ? false : { opacity: 0, y: 30, scale: 0.96, clipPath: "inset(18% 0 0 0 round 999px 999px 18px 18px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, clipPath: "inset(0% 0 0 0 round 0px 0px 0px 0px)" }}
          transition={{ duration: 1.2, ease, delay: 0.15 }}>
          <div className="arch">
            <Image src="/fotos/sabrina-hero.jpg" alt="Sabrina Coutinho sorrindo, segurando uma taça de drink" fill priority sizes="(min-width: 900px) 420px, 90vw" style={{ objectFit: "cover", objectPosition: "50% 22%" }} />
          </div>
          <div className="seal" aria-hidden="true">
            <svg viewBox="0 0 132 132"><defs><path id="circ" d="M66,66 m-50,0 a50,50 0 1,1 100,0 a50,50 0 1,1 -100,0" /></defs>
              <text><textPath href="#circ">Atleta híbrida em construção • força • corrida • </textPath></text></svg>
            <span className="core">em<br />obra</span>
          </div>
          <span className="tag-float">Mãe 🤍 · rotina real</span>
        </motion.figure>
      </div>
    </section>
  );
}
