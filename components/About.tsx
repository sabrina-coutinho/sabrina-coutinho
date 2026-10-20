"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { PILLARS } from "@/lib/content";
import { Reveal } from "./Reveal";

export function About() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="sobre" style={{ background: "var(--surface)" }}>
      <div className="wrap about-grid">
        <Reveal className="about-text">
          <p className="eyebrow">Quem sou eu</p>
          <h2>Prazer, <em>Sabrina</em></h2>
          <p className="pull">Mãe primeiro. Atleta em construção. Estilo no meio do caminho.</p>
          <p>Sou de Brasília e divido aqui a vida como ela é: acordar cedo pra treinar antes da casa acordar, encaixar a corrida entre a escola e o trabalho, montar um look que funcione do treino ao almoço e cozinhar algo gostoso que também alimente.</p>
          <p>Virei atleta híbrida aos poucos, misturando força e corrida, e ainda estou no processo. Por isso mostro a evolução sem filtro de perfeição: os dias bons, os cansados e o que eu aprendi no meio.</p>
          <p>Se você também está tentando equilibrar maternidade, treino e vaidade, aqui é o seu lugar.</p>
          <span className="signature">Sabrina</span>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="eyebrow" style={{ marginBottom: 18 }}>Meus destaques · toque para abrir</p>
          <div className="rings">
            {PILLARS.map((p, i) => (
              <motion.button key={p.title} className="ring" aria-expanded={open === i}
                onClick={() => setOpen(open === i ? null : i)}
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}>
                <span className="halo"><span>{p.emoji}</span></span>
                <b>{p.title}</b>
                <small>{p.text}</small>
              </motion.button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
