import { INSTAGRAM, LINKTREE } from "@/lib/content";
import { ReopenCookies } from "./CookieBanner";

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <p className="foot-name">Sabrina<br /><em>Coutinho</em></p>
            <div className="socials">
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
              </a>
              <a href="#contato" aria-label="WhatsApp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 12a8 8 0 0 1-11.8 7L4 20l1.1-4A8 8 0 1 1 20 12Z" /><path d="M9 9.5c.3 2.2 2.3 4.3 4.5 4.6l1-1.1 1.8.8" /></svg>
              </a>
              <a href={LINKTREE} target="_blank" rel="noopener noreferrer" aria-label="Linktree">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" /><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" /></svg>
              </a>
            </div>
          </div>
          <div>
            <span className="eyebrow">Navegue</span>
            <ul><li><a href="#cupons">Cupons exclusivos</a></li><li><a href="#sobre">Sobre a Sabrina</a></li><li><a href="#feed">Feed</a></li><li><a href="#contato">Parcerias & mídia kit</a></li></ul>
          </div>
          <div>
            <span className="eyebrow">Privacidade</span>
            <ul>
              <li><a href="/privacidade">Política de Privacidade</a></li>
              <li><a href="/termos">Termos de Uso</a></li>
              <li><ReopenCookies /></li>
              <li>Brasília - DF</li>
            </ul>
          </div>
        </div>
        <div className="legal">
          <span>© {new Date().getFullYear()} Sabrina Coutinho. Todos os direitos reservados. Fotos e conteúdo protegidos por direitos autorais.</span>
          <span>Dados tratados conforme a LGPD (Lei 13.709/2018)</span>
        </div>
      </div>
    </footer>
  );
}
