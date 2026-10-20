"use client";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import { useState } from "react";
import { CATEGORIES, COUPONS, type CouponCategory } from "@/lib/content";
import { CouponCard } from "./CouponCard";
import { Reveal } from "./Reveal";

export function Coupons() {
  const [filter, setFilter] = useState<CouponCategory | "todos">("todos");
  const list = COUPONS.filter(c => filter === "todos" || c.cat === filter);

  return (
    <section id="cupons">
      <div className="wrap">
        <Reveal className="sec-head">
          <p className="eyebrow">Cupons & parcerias</p>
          <h2>O que eu uso, <em>com desconto</em> pra você</h2>
          <p className="lede">Só indico marca que entrou na minha rotina de verdade. Toque no cupom, ele vai direto pra sua área de transferência.</p>
        </Reveal>

        <div className="filters" role="group" aria-label="Filtrar cupons por categoria">
          {CATEGORIES.map(c => (
            <button key={c.id} className="chip" aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>{c.label}</button>
          ))}
        </div>

        <LayoutGroup>
          <div className="coupons">
            <AnimatePresence mode="popLayout">
              {list.map((c, i) => <CouponCard key={c.id} coupon={c} index={i} />)}
            </AnimatePresence>
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
}
