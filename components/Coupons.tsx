"use client";
import { COUPONS } from "@/lib/content";
import { CouponCard } from "./CouponCard";
import { Reveal } from "./Reveal";

export function Coupons() {
  return (
    <section id="cupons">
      <div className="wrap">
        <Reveal className="sec-head">
          <p className="eyebrow">Cupons & parcerias</p>
          <h2>O que eu uso, <em>com desconto</em> pra você</h2>
          <p className="lede">Só indico marca que entrou na minha rotina de verdade. Toque em copiar e mande a mensagem pro parceiro: o desconto é seu.</p>
        </Reveal>
        <div className="coupons">
          {COUPONS.map((c, i) => <CouponCard key={c.id} coupon={c} index={i} />)}
        </div>
        <p className="note">Os descontos são oferecidos pelos parceiros e podem mudar. Confirme as condições direto com cada um.</p>
      </div>
    </section>
  );
}
