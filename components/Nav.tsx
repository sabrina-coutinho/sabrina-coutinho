"use client";
import { useEffect, useState } from "react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="wrap">
        <a className="mono-mark" href="#topo" aria-label="Sabrina Coutinho, início">Sc.</a>
        <nav className="nav-links" aria-label="Seções">
          <a href="#cupons">Cupons</a><a href="#sobre">Sobre</a><a href="#feed">Feed</a><a href="#contato">Parcerias</a>
        </nav>
        <a className="btn" href="#contato">Mídia Kit <span className="arrow" aria-hidden="true">→</span></a>
      </div>
    </header>
  );
}

export function Marquee() {
  const items = ["Treinos", "Estilo", "Maternidade", "Receitas", "Viagens", "Rotina", "Evolução"];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">{[...items, ...items].map((t, i) => <span key={i}>{t}</span>)}</div>
    </div>
  );
}
