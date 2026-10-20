import Image from "next/image";
import { INSTAGRAM, POSTS } from "@/lib/content";
import { Reveal } from "./Reveal";

/** Grid estilo Instagram com zoom no hover. */
export function Feed() {
  return (
    <section id="feed">
      <div className="wrap">
        <Reveal className="sec-head">
          <p className="eyebrow">Feed</p>
          <h2>Rotina, estilo <em>e evolução</em></h2>
        </Reveal>
        <Reveal className="grid">
          {POSTS.map(p => (
            <a className="post" key={p.title} href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
              <Image className="bg" src={p.image} alt={p.alt} fill sizes="(min-width: 820px) 25vw, 50vw" style={{ objectFit: "cover", objectPosition: p.pos }} />
              <span className="lbl">{p.label}</span>
              <span className="over"><b>{p.title}</b></span>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
