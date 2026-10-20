"use client";
import { COUPONS, PARTNERS } from "@/lib/content";
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

        <Reveal className="partners-head">
          <p className="eyebrow">Também indico</p>
          <h3>Marcas e profissionais <em>que eu confio</em></h3>
        </Reveal>
        <div className="partners">
          {PARTNERS.map(p => {
            const inner = (
              <>
                <span className="avatar" aria-hidden="true"><span>{p.name.charAt(0)}</span></span>
                <span className="pinfo"><span className="cat">{p.label}</span><b>{p.name}</b><small>{p.handle ? `@${p.handle}` : p.desc}</small></span>
                {p.handle && <span className="go" aria-hidden="true">↗</span>}
              </>
            );
            return p.handle
              ? <a key={p.name} className="partner" href={`https://www.instagram.com/${encodeURIComponent(p.handle)}/`} target="_blank" rel="noopener noreferrer" title={p.desc}>{inner}</a>
              : <div key={p.name} className="partner">{inner}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
