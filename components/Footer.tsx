import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  HelpCircle,
} from "lucide-react";
import { LogoMark } from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#252525] relative overflow-hidden">
      {/* Fioriture décorative bas droite */}
      <div className="absolute pointer-events-none" style={{
        zIndex: 0,
        bottom: "-20px",
        right: "200px",
        width: "700px",
        height: "450px",
      }}>
        <img
          src="/paint-splash.png"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            opacity: 0.9,
            mixBlendMode: "screen",
          }}
        />
      </div>
      <div className="max-w-7xl mx-auto px-6 py-14 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-10">
          <div className="lg:col-span-1">
            <div className="mb-4">
              <LogoMark size={36} />
            </div>
            <p className="text-white/30 text-sm leading-relaxed mb-4">
              Le calendrier référence du catch indépendant francophone.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.facebook.com/ringsideagenda" target="_blank" rel="noopener noreferrer">
                <Facebook className="w-4 h-4 text-white/30 hover:text-[#E8186D] cursor-pointer transition-colors" />
              </a>
              <a href="https://www.instagram.com/ringsideagenda" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-4 h-4 text-white/30 hover:text-[#E8186D] cursor-pointer transition-colors" />
              </a>
              <a href="https://x.com/ringsideagenda" target="_blank" rel="noopener noreferrer">
                <Twitter className="w-4 h-4 text-white/30 hover:text-[#E8186D] cursor-pointer transition-colors" />
              </a>
              <a href="https://www.youtube.com/@ringsideagenda" target="_blank" rel="noopener noreferrer">
                <Youtube className="w-4 h-4 text-white/30 hover:text-[#E8186D] cursor-pointer transition-colors" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white/30 text-[11px] font-bold uppercase tracking-widest mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li><a href="/" className="hover:text-white cursor-pointer transition-colors no-underline">Accueil</a></li>
              <li><a href="/calendrier" className="hover:text-white cursor-pointer transition-colors no-underline">Calendrier</a></li>
              <li><a href="/carte" className="hover:text-white cursor-pointer transition-colors no-underline">Carte</a></li>
              <li><a href="/federations" className="hover:text-white cursor-pointer transition-colors no-underline">Promotions</a></li>
              <li><a href="/a-propos" className="hover:text-white cursor-pointer transition-colors no-underline">À propos</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white/30 text-[11px] font-bold uppercase tracking-widest mb-4">
              Contribuer
            </h3>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li>
                <a href="/proposer-un-show" className="hover:text-[#E8186D] cursor-pointer transition-colors no-underline">
                  📣 Proposer un show
                </a>
              </li>
              <li>
                <a href="/suggestion" className="hover:text-[#FFB300] cursor-pointer transition-colors no-underline">
                  💡 Idée / Suggestion
                </a>
              </li>
              <li>
                <a href="mailto:ringsideagenda@gmail.com?subject=Ajout d'un show" className="hover:text-white cursor-pointer transition-colors no-underline">
                  Ajouter un show
                </a>
              </li>
              <li>
                <a href="/faq-promoteurs" className="hover:text-white cursor-pointer transition-colors no-underline">
                  FAQ Promoteurs
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white/30 text-[11px] font-bold uppercase tracking-widest mb-4">
              Infos
            </h3>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li>
                <a href="/contact" className="hover:text-white cursor-pointer transition-colors no-underline">
                  Contact
                </a>
              </li>
              <li>
                <a href="/mentions-legales" className="hover:text-white cursor-pointer transition-colors no-underline">
                  Mentions légales
                </a>
              </li>
              <li>
                <a href="/confidentialite" className="hover:text-white cursor-pointer transition-colors no-underline">
                  Confidentialité
                </a>
              </li>
              <li>
                <a href="/admin" className="text-white/20 hover:text-[#E8186D] cursor-pointer transition-colors no-underline text-xs">
                  Admin
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white/30 text-[11px] font-bold uppercase tracking-widest mb-4">
              Suivez-nous
            </h3>
            <div className="flex flex-wrap gap-2 mb-5">
              <a
                href="https://www.facebook.com/ringsideagenda"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#FFB300] hover:bg-[#E8186D] text-black hover:text-white text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-sm transition-colors no-underline"
              >
                <Facebook className="w-3.5 h-3.5" /> Facebook
              </a>
              <a
                href="https://www.instagram.com/ringsideagenda"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#FFB300] hover:bg-[#E8186D] text-black hover:text-white text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-sm transition-colors no-underline"
              >
                <Instagram className="w-3.5 h-3.5" /> Instagram
              </a>
              <a
                href="https://x.com/ringsideagenda"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#FFB300] hover:bg-[#E8186D] text-black hover:text-white text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-sm transition-colors no-underline"
              >
                <Twitter className="w-3.5 h-3.5" /> X
              </a>
            </div>

            <a
              href="mailto:ringsideagenda@gmail.com?subject=Une question"
              className="inline-flex items-center gap-2 border border-[#FFB300] text-[#FFB300] hover:bg-[#FFB300] hover:text-black text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-sm transition-colors no-underline"
            >
              <HelpCircle className="w-3.5 h-3.5" /> Une question ?
            </a>
          </div>
        </div>

        <div className="border-t border-[#252525] pt-6 text-center text-white/20 text-sm">
          © 2026 Ringside Agenda – Tous droits réservés
        </div>
      </div>
    </footer>
  );
}
