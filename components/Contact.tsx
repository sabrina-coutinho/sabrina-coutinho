"use client";
import { useEffect, useRef, useState } from "react";
import { ORCAMENTOS, TIPOS } from "@/lib/sanitize";
import { Reveal } from "./Reveal";
import { copyToClipboard, toast } from "./Toast";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, o: { sitekey: string; action: string; appearance?: string; callback: (t: string) => void; "expired-callback"?: () => void }) => string;
      reset: (id?: string) => void;
    };
  }
}

/* Contatos ofuscados: não existem no HTML servido; são montados no navegador após a hidratação. */
const rev = (s: string) => s.split("").reverse().join("");
function useContacts() {
  const [c, set] = useState<{ mail: string; phone: string; wa: string } | null>(null);
  useEffect(() => {
    const p = ["55", "61", "99651", "1849"];
    set({
      mail: rev("cs" + "anirbasue" + "airosesssa") + "@" + rev("moc.liamg"),
      phone: `(${p[1]}) ${p[2]}-${p[3]}`,
      wa: `https://wa.me/${p.join("")}?text=${encodeURIComponent("Olá, Sabrina! Vim pelo seu site e gostaria de falar sobre uma parceria.")}`,
    });
  }, []);
  return c;
}

type Errors = Partial<Record<string, string>>;

export function Contact() {
  const contacts = useContacts();
  const [csrf, setCsrf] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [sending, setSending] = useState(false);
  const started = useRef(Date.now());
  const widget = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string>();

  // Token CSRF
  useEffect(() => {
    fetch("/api/csrf", { credentials: "same-origin" }).then(r => r.json()).then(d => setCsrf(d.token)).catch(() => {});
  }, []);

  // Turnstile (renderização explícita, modo invisível/gerenciado)
  useEffect(() => {
    const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!sitekey) { setToken("dev-token-sem-turnstile"); return; }
    const t = setInterval(() => {
      if (window.turnstile && widget.current && !widgetId.current) {
        widgetId.current = window.turnstile.render(widget.current, {
          sitekey, action: "contato", appearance: "interaction-only",
          callback: setToken, "expired-callback": () => setToken(""),
        });
        clearInterval(t);
      }
    }, 200);
    return () => clearInterval(t);
  }, []);

  async function copy(text: string, label: string) {
    toast((await copyToClipboard(text)) ? `${label} copiado com sucesso!` : "Selecione o texto e use Copiar");
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = {
      nome: String(fd.get("nome") ?? ""),
      marca: String(fd.get("marca") ?? ""),
      email: String(fd.get("email") ?? ""),
      telefone: String(fd.get("telefone") ?? ""),
      tipo: String(fd.get("tipo") ?? ""),
      orcamento: String(fd.get("orcamento") ?? ""),
      mensagem: String(fd.get("mensagem") ?? ""),
      consentimento: fd.get("consentimento") === "on",
      website: String(fd.get("website") ?? ""),
      startedAt: started.current,
      turnstileToken: token,
    };
    if (!body.consentimento) { setStatus({ ok: false, msg: "Marque o consentimento da LGPD para continuar." }); return; }
    if (!token) { setStatus({ ok: false, msg: "Aguarde a verificação anti-spam e tente de novo." }); return; }

    setSending(true); setStatus(null); setErrors({});
    try {
      const res = await fetch("/api/contact", {
        method: "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": csrf },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus({ ok: true, msg: "Proposta enviada! A assessoria responde em até 2 dias úteis." });
        toast("Proposta enviada com sucesso!");
        (e.target as HTMLFormElement).reset();
      } else {
        setErrors(data.fields ?? {});
        setStatus({ ok: false, msg: data.error ?? "Não foi possível enviar. Tente de novo." });
      }
    } catch {
      setStatus({ ok: false, msg: "Sem conexão. Verifique a internet e tente de novo." });
    } finally {
      setSending(false);
      window.turnstile?.reset(widgetId.current);
    }
  }

  const field = (name: string) => ({ className: `field${errors[name] ? " bad" : ""}` });
  const err = (name: string) => <span className="err">{errors[name] ?? ""}</span>;

  return (
    <section id="contato" style={{ background: "var(--surface)" }}>
      <div className="wrap contact-grid">
        <Reveal className="kit">
          <p className="eyebrow">Parcerias & mídia kit</p>
          <h2>Vamos criar <em>juntos</em>?</h2>
          <p className="lede">Conteúdo autêntico para marcas de fitness, moda, beleza, gastronomia e lifestyle, com uma audiência de Brasília que acompanha a minha rotina de perto.</p>
          <div className="kit-stats">
            <div><b>6.280+</b><small>Seguidores</small></div>
            <div><b>BSB</b><small>Público local</small></div>
            <div><b>5</b><small>Pilares</small></div>
          </div>
          <div className="direct">
            <div className="direct-row">
              <span className="val"><small>WhatsApp da assessoria</small>{contacts?.phone ?? "carregando…"}</span>
              <span style={{ display: "flex", gap: 8 }}>
                <a className="mini" href={contacts?.wa ?? "#"} target="_blank" rel="noopener noreferrer">Abrir WhatsApp</a>
                <button className="mini" type="button" onClick={() => contacts && copy(contacts.phone, "Telefone")}>Copiar</button>
              </span>
            </div>
            <div className="direct-row">
              <span className="val"><small>E-mail comercial</small>{contacts?.mail ?? "carregando…"}</span>
              <button className="mini" type="button" onClick={() => contacts && copy(contacts.mail, "E-mail")}>Copiar e-mail</button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form className="card" onSubmit={onSubmit} noValidate>
            <div className="row2">
              <div {...field("nome")}><label htmlFor="f-nome">Seu nome</label><input id="f-nome" name="nome" autoComplete="name" maxLength={80} required placeholder="Ex.: Mariana Lopes" />{err("nome")}</div>
              <div {...field("marca")}><label htmlFor="f-marca">Marca / empresa</label><input id="f-marca" name="marca" autoComplete="organization" maxLength={80} required placeholder="Ex.: Studio Bem-Estar" />{err("marca")}</div>
            </div>
            <div className="row2">
              <div {...field("email")}><label htmlFor="f-email">E-mail</label><input id="f-email" name="email" type="email" autoComplete="email" maxLength={120} required placeholder="voce@marca.com.br" />{err("email")}</div>
              <div {...field("telefone")}><label htmlFor="f-tel">WhatsApp (opcional)</label><input id="f-tel" name="telefone" type="tel" autoComplete="tel" maxLength={20} placeholder="(61) 90000-0000" />{err("telefone")}</div>
            </div>
            <div className="row2">
              <div {...field("tipo")}><label htmlFor="f-tipo">Tipo de parceria</label>
                <select id="f-tipo" name="tipo" required defaultValue=""><option value="" disabled>Selecione</option>{TIPOS.map(t => <option key={t}>{t}</option>)}</select>{err("tipo")}</div>
              <div {...field("orcamento")}><label htmlFor="f-orc">Orçamento estimado</label>
                <select id="f-orc" name="orcamento" defaultValue="">{ORCAMENTOS.map(o => <option key={o} value={o}>{o || "Prefiro conversar"}</option>)}</select>{err("orcamento")}</div>
            </div>
            <div {...field("mensagem")}><label htmlFor="f-msg">Conte sobre a proposta</label><textarea id="f-msg" name="mensagem" maxLength={1500} required placeholder="Produto, objetivo da campanha, prazos e entregáveis." />{err("mensagem")}</div>
            <div className="hp" aria-hidden="true"><label htmlFor="f-site">Não preencha</label><input id="f-site" name="website" tabIndex={-1} autoComplete="off" /></div>
            <label className="consent"><input type="checkbox" id="f-lgpd" name="consentimento" />
              <span>Concordo que meus dados sejam usados apenas para responder a esta proposta, conforme a <a href="/privacidade" style={{ color: "var(--olive)" }}>Política de Privacidade</a>.</span></label>
            <div ref={widget} />
            <div className="form-foot">
              <p className="status" role="status" style={status && !status.ok ? { color: "#A3442F" } : undefined}>{status?.msg}</p>
              <button className="btn olive" type="submit" disabled={sending}>{sending ? "Enviando…" : "Enviar proposta"} <span className="arrow" aria-hidden="true">→</span></button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
