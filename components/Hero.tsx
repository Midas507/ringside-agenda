import { Calendar, Globe } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[#0D0D0D]" />

      {/* DESKTOP : image à droite */}
      <div className="hidden md:block">
        <div className="relative h-[680px]">
          <div className="absolute right-0 top-0 bottom-0 w-1/2">
            <Image
              src="/hero-wrestler.png"
              alt="Catcheurs francophones"
              fill
              className="object-contain object-right opacity-90"
              priority
            />
            <div className="absolute inset-0 heroFade" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center pt-[60px]">
            <div className="max-w-2xl">
              <h1 className="leading-[0.95] uppercase mb-3 heroTitle">
                <span className="block text-white tracking-wide">TOUS LES SHOWS DE CATCH EN</span>
                <span className="block text-[#E8186D] tracking-wide">FRANCE, BELGIQUE</span>
                <span className="block text-[#E8186D] tracking-wide">&amp; SUISSE</span>
              </h1>

              <div className="mb-5">
                <p className="text-white/60 text-sm">Ton agenda complet du catch indépendant.</p>
                <p className="text-white/60 text-sm">Ne rate aucun show près de chez toi !</p>
              </div>

              <p
                className="text-[#E8186D] text-[9px] tracking-widest mb-4 retroGlowText"
                style={{ fontFamily: "var(--font-pixel)" }}
              >
                &gt;&gt; NE RATE AUCUN SHOW &lt;&lt;
              </p>

              <div className="flex items-center gap-5">
                <a href="/calendrier" className="flex flex-col items-center justify-center gap-2.5 w-28 h-28 rounded-md bg-[#0D0D0D] border-2 border-[#E8186D] retroGlowPink cursor-pointer hover:scale-105 transition-transform no-underline">
                  <Calendar className="w-9 h-9 text-[#E8186D] retroIconPink" />
                  <span
                    className="text-[#E8186D] text-[8px] retroGlowTextPink"
                    style={{ fontFamily: "var(--font-pixel)" }}
                  >
                    CALENDRIER
                  </span>
                </a>

                <a href="/carte" className="flex flex-col items-center justify-center gap-2.5 w-28 h-28 rounded-md bg-[#0D0D0D] border-2 border-[#FFB300] retroGlowYellow cursor-pointer hover:scale-105 transition-transform no-underline">
                  <Globe className="w-9 h-9 text-[#FFB300] retroIconYellow" />
                  <span
                    className="text-[#FFB300] text-[8px] retroGlowTextYellow"
                    style={{ fontFamily: "var(--font-pixel)" }}
                  >
                    CARTE
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE : image en haut, texte en bas */}
      <div className="md:hidden relative pt-[60px] pb-8">
        {/* Image en haut */}
        <div className="relative w-full h-[260px] mb-6">
          <Image
            src="/hero-wrestler.png"
            alt="Catcheurs francophones"
            fill
            className="object-cover opacity-90"
            priority
          />
          <div className="absolute inset-0 heroFadeMobile" />
        </div>

        {/* Texte en dessous */}
        <div className="px-6">
          <h1 className="leading-[0.95] uppercase mb-3 heroTitleMobile">
            <span className="block text-white tracking-wide">TOUS LES SHOWS DE CATCH EN</span>
            <span className="block text-[#E8186D] tracking-wide">FRANCE, BELGIQUE</span>
            <span className="block text-[#E8186D] tracking-wide">&amp; SUISSE</span>
          </h1>

          <div className="mb-5">
            <p className="text-white/60 text-sm">Ton agenda complet du catch indépendant.</p>
            <p className="text-white/60 text-sm">Ne rate aucun show près de chez toi !</p>
          </div>

          <p
            className="text-[#E8186D] text-[9px] tracking-widest mb-4 retroGlowText"
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            &gt;&gt; NE RATE AUCUN SHOW &lt;&lt;
          </p>

          <div className="flex items-center gap-4 justify-center">
            <a href="/calendrier" className="flex flex-col items-center justify-center gap-2.5 w-28 h-28 rounded-md bg-[#0D0D0D] border-2 border-[#E8186D] retroGlowPink cursor-pointer hover:scale-105 transition-transform no-underline">
              <Calendar className="w-9 h-9 text-[#E8186D] retroIconPink" />
              <span
                className="text-[#E8186D] text-[8px] retroGlowTextPink"
                style={{ fontFamily: "var(--font-pixel)" }}
              >
                CALENDRIER
              </span>
            </a>

            <a href="/carte" className="flex flex-col items-center justify-center gap-2.5 w-28 h-28 rounded-md bg-[#0D0D0D] border-2 border-[#FFB300] retroGlowYellow cursor-pointer hover:scale-105 transition-transform no-underline">
              <Globe className="w-9 h-9 text-[#FFB300] retroIconYellow" />
              <span
                className="text-[#FFB300] text-[8px] retroGlowTextYellow"
                style={{ fontFamily: "var(--font-pixel)" }}
              >
                CARTE
              </span>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .heroFade {
          background: linear-gradient(to right, #0D0D0D 0%, rgba(13,13,13,0.4) 35%, transparent 70%);
        }
        .heroFadeMobile {
          background: linear-gradient(to bottom, transparent 0%, rgba(13,13,13,0.4) 60%, #0D0D0D 100%);
        }
        .heroTitle span {
          font-family: var(--font-bebas);
          font-size: clamp(32px, 4vw, 56px);
        }
        .heroTitleMobile span {
          font-family: var(--font-bebas);
          font-size: clamp(28px, 8vw, 42px);
        }
        .retroGlowText {
          text-shadow: 0 0 6px rgba(232,24,109,0.8), 0 0 14px rgba(232,24,109,0.5);
        }
        .retroGlowTextPink {
          text-shadow: 0 0 6px rgba(232,24,109,0.8), 0 0 14px rgba(232,24,109,0.5);
        }
        .retroGlowTextYellow {
          text-shadow: 0 0 6px rgba(255,179,0,0.8), 0 0 14px rgba(255,179,0,0.5);
        }
        .retroIconPink {
          filter: drop-shadow(0 0 6px rgba(232,24,109,0.8));
        }
        .retroIconYellow {
          filter: drop-shadow(0 0 6px rgba(255,179,0,0.8));
        }
        .retroGlowPink {
          box-shadow: 0 0 10px rgba(232,24,109,0.6), inset 0 0 10px rgba(232,24,109,0.15);
        }
        .retroGlowYellow {
          box-shadow: 0 0 10px rgba(255,179,0,0.6), inset 0 0 10px rgba(255,179,0,0.15);
        }
      `}</style>
    </section>
  );
}
