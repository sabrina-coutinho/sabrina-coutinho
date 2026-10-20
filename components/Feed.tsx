"use client";
import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { INSTAGRAM, POSTS, REELS } from "@/lib/content";
import { Reveal } from "./Reveal";

/** Carrossel de Reels (scroll-snap nativo + autoplay pausável) e grid estilo Instagram. */
export function Feed() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(false);
  const reduce = useReducedMotion();

  const step = () => (ref.current?.firstElementChild?.getBoundingClientRect().width ?? 280) + 16;
  const go = useCallback((dir: number) => {
    const el = ref.current; if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const target = el.scrollLeft + dir * step();
    el.scrollTo({ left: target > max + 4 ? 0 : target < -4 ? max : target, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (reduce || hover) return;
    const t = setInterval(() => !document.hidden && go(1), 4200);
    return () => clearInterval(t);
  }, [go, hover, reduce]);

  return (
    <section id="feed">
      <div className="wrap">
        <Reveal className="sec-head feed-head">
          <div style={{ display: "grid", gap: 14 }}>
            <p className="eyebrow">Feed & Reels</p>
            <h2>Rotina, estilo <em>e evolução</em></h2>
          </div>
          <div className="slider-ctrl">
            <div className="dots" aria-hidden="true">{REELS.map((_, i) => <i key={i} className={i === active ? "on" : ""} />)}</div>
            <button className="round" onClick={() => go(-1)} aria-label="Reel anterior">←</button>
            <button className="round" onClick={() => go(1)} aria-label="Próximo reel">→</button>
          </div>
        </Reveal>

        <Reveal className="slider-wrap">
          <div className="slider" ref={ref} tabIndex={0} aria-label="Reels em destaque"
            onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}
            onKeyDown={e => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); }}
            onScroll={e => setActive(Math.min(REELS.length - 1, Math.round(e.currentTarget.scrollLeft / step())))}>
            {REELS.map(r => (
              <article className="reel" key={r.title}>
                <div className={`bg ${r.tone}`}><span className="glyph">{r.glyph}</span></div>
                <span className="play" aria-hidden="true">▶</span>
                <div className="meta"><small>{r.tag}</small><b>{r.title}</b></div>
              </article>
            ))}
          </div>
        </Reveal>

        <Reveal className="grid">
          {POSTS.map(p => (
            <a className="post" key={p.title} href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
              <div className={`bg ${p.tone}`}><span className="glyph">{p.glyph}</span></div>
              <span className="lbl">{p.label}</span>
              <span className="over"><b>{p.title}</b></span>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
