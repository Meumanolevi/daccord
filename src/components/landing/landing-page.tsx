"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { MobileStepDeck } from "@/components/landing/mobile-step-deck";
import { ScrollStageReveal } from "@/components/motion/scroll-stage-reveal";
import { AnimatedButton } from "@/components/ui/animated-button";

const navigation = [
  { label: "Sobre", href: "#metodo" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Produtos", href: "#produto" },
  { label: "Minha análise", href: "/analise" },
];

const sectionSurface = (color: string) =>
  ({ "--section-surface": color }) as CSSProperties;

export function LandingPage() {
  const root = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [productStageOpen, setProductStageOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScrollStage = (event: Event) => {
      const detail = (event as CustomEvent<{ active: boolean; id?: string }>).detail;
      if (detail.id === "product-recommendation") setProductStageOpen(detail.active);
    };

    window.addEventListener("daccord:scroll-stage", handleScrollStage);
    return () => window.removeEventListener("daccord:scroll-stage", handleScrollStage);
  }, []);

  useLayoutEffect(() => {
    if (reduceMotion || !root.current) return;

    const context = gsap.context(() => {
      gsap.from("[data-hero-copy] > *", {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.08,
      });

      gsap.from("[data-hero-image]", {
        opacity: 0,
        xPercent: 5,
        duration: 1,
        ease: "power3.out",
      });
    }, root);

    return () => context.revert();
  }, [reduceMotion]);

  const revealProductStage = () => {
    const section = root.current?.querySelector<HTMLElement>('[data-scroll-stage="product-recommendation"]');
    if (section) section.dataset.stageActive = "true";
    setProductStageOpen(true);
  };

  return (
    <main ref={root} className="landing-shell bg-white">
      <header className="site-header relative bg-white" aria-label="Cabeçalho principal">
        <div className="header-primary mx-auto grid max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-5 md:px-12">
          <p className="header-eyebrow hidden text-[10px] font-medium tracking-[0.1em] text-ink-muted md:block">
            BELEZA + TECNOLOGIA + CUIDADO
          </p>

          <Link href="/" aria-label="D’Accord — página inicial" className="header-wordmark font-sans leading-none font-bold tracking-[-0.055em] text-plum">
            D’ACCORD
          </Link>

          <p className="header-tagline hidden justify-self-end font-elegant text-plum lg:block">
            skincare inteligente para a sua pele.
          </p>

          <button
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            className="col-start-3 flex h-10 w-10 justify-self-end border border-brand-border md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="m-auto flex flex-col gap-1.5">
              <span className={`h-px w-5 bg-plum transition-transform ${menuOpen ? "translate-y-[3.5px] rotate-45" : ""}`} />
              <span className={`h-px w-5 bg-plum transition-transform ${menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>

        <nav className="header-nav mx-auto hidden max-w-[1440px] items-center justify-center px-12 md:flex" aria-label="Navegação principal">
          <ul className="flex items-center gap-7 text-[11px] font-medium tracking-[0.045em] text-plum lg:gap-10">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link className="underline-offset-4 transition-colors hover:text-brand hover:underline" href={item.href}>
                  {item.label.toUpperCase()}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <AnimatePresence>
          {menuOpen ? (
            <motion.nav
              className="absolute inset-x-0 top-full border-t border-brand-border/30 bg-white px-5 py-6 shadow-xl md:hidden"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              aria-label="Navegação móvel"
            >
              <ul className="space-y-1">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      className="block border-b border-plum/10 py-3 text-sm font-semibold tracking-[0.06em]"
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label.toUpperCase()}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          ) : null}
        </AnimatePresence>
        <div className="header-rule bg-brand" />
      </header>

      <section id="inicio" data-snap-section className="hero-panel mx-auto grid max-w-[1440px] bg-white" aria-labelledby="hero-title">
        <div data-hero-copy className="hero-copy flex flex-col bg-brand text-white">
          <h1 id="hero-title" className="hero-title max-w-[450px] font-bold tracking-[-0.045em] text-balance">
            <span>A SUA PELE</span><span>DIZ MUITO.</span><span>A GENTE</span><span>ESCUTA.</span>
          </h1>
          <p className="hero-description max-w-[390px] font-display tracking-[0.025em]">
            Foto, contexto e preferências se encontram para revelar produtos que realmente fazem sentido.
          </p>
          <AnimatedButton href="/analise" variant="secondary" className="hero-action w-fit min-w-[230px]">
            Analisar minha pele
          </AnimatedButton>
          <p className="mt-auto text-xs font-bold tracking-[0.02em]">IA + COSMETICS</p>
        </div>

        <div data-hero-image className="hero-visual relative">
          <div className="hero-background-plate absolute" aria-hidden="true">
            <Image
              src="/images/hero-background-plate-v1.png?v=2"
              alt=""
              fill
              priority
              unoptimized
              sizes="64vw"
              className="object-cover object-right"
            />
          </div>
          <div className="hero-model-layer absolute" aria-hidden="true">
            <Image
              src="/images/hero-model-hd-v13.png?v=4"
              alt=""
              fill
              priority
              unoptimized
              sizes="(max-width: 1439px) 52vw, 760px"
              className="hero-model-image object-contain object-right-bottom"
            />
          </div>
          <motion.aside
            className="hero-insight absolute border border-white/70 bg-white/95 text-plum shadow-[0_20px_50px_rgba(43,25,36,0.16)]"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.55 }}
            aria-label="Prévia ilustrativa do perfil de pele"
          >
            <p className="text-[11px] font-bold text-brand-dark">PRÉVIA DO SEU PERFIL</p>
            <p className="insight-title mt-3 font-display">Barreira sensibilizada</p>
            <p className="insight-copy mt-4 leading-5">Hidratação + proteção<br />compatibilidade 97%</p>
          </motion.aside>
        </div>
      </section>

      <section
        id="metodo"
        data-panel
        data-snap-section
        className="section-transition immersive-panel manifesto-panel mx-auto max-w-[1440px] bg-white"
        style={sectionSurface("#ffffff")}
        aria-labelledby="manifesto-title"
      >
        <div data-panel-content className="manifesto-content flex h-full flex-col">
          <h2 id="manifesto-title" className="manifesto-title max-w-[1000px] font-display tracking-[0.08em] text-balance">
            D’ACCORD É A CURADORIA QUE TRANSFORMA SINAIS DA SUA PELE EM ESCOLHAS CLARAS, SEGURAS E POSSÍVEIS PARA A SUA ROTINA.
          </h2>
          <p className="manifesto-kicker text-sm tracking-[0.04em] text-ink-muted">SEM FÓRMULAS PRONTAS. SEM PROMESSAS VAZIAS.</p>
          <div className="mt-auto flex flex-wrap items-end justify-between gap-8">
            <AnimatedButton href="#como-funciona" variant="secondary" className="min-w-[210px]">
              Conhecer o método
            </AnimatedButton>
            <p className="text-sm font-bold text-brand-dark">01 — MÉTODO</p>
          </div>
        </div>
      </section>

      <section
        id="produto"
        data-panel
        data-spotlight
        data-snap-section
        data-scroll-stage="product-recommendation"
        data-stage-active={productStageOpen}
        className="section-transition immersive-panel spotlight-panel relative mx-auto max-w-[1440px] overflow-hidden bg-plum"
        style={sectionSurface("#2b1924")}
        aria-labelledby="product-title"
      >
        <motion.div
          className="spotlight-visual absolute inset-0"
          animate={reduceMotion ? undefined : {
            x: productStageOpen ? "-10%" : "0%",
            scale: productStageOpen ? 1.035 : 1,
          }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            data-spotlight-image
            src="/images/iris-spotlight.png"
            alt="Frasco do sérum calmante Íris 01 sobre uma superfície rosa escura"
            fill
            quality={90}
            loading="lazy"
            decoding="async"
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-plum/55 via-transparent to-plum/10" aria-hidden="true" />
        </motion.div>
        <div data-panel-content className="absolute inset-0">
          <p className="spotlight-badge absolute bg-brand font-bold text-white">97% COMPATÍVEL</p>
          <motion.h2
            id="product-title"
            className="spotlight-title absolute leading-none font-bold tracking-[-0.065em] text-white"
            animate={reduceMotion ? undefined : { opacity: productStageOpen ? 0.5 : 1, scale: productStageOpen ? 0.84 : 1 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "left bottom" }}
          >
            ÍRIS 01
          </motion.h2>
          <motion.p
            className="spotlight-copy absolute max-w-[360px] text-right leading-5 font-medium text-white"
            animate={{ opacity: productStageOpen ? 0 : 1 }}
            transition={{ duration: 0.35 }}
          >
            SÉRUM CALMANTE · BARREIRA CUTÂNEA<br />SEM FRAGRÂNCIA · TEXTURA LEVE
          </motion.p>

          <ScrollStageReveal active={productStageOpen} className="spotlight-recommendation absolute" direction="right">
            <aside className="spotlight-recommendation__card flex h-full flex-col" aria-label="Exemplo de recomendação personalizada">
              <div className="spotlight-recommendation__header">
                <p>RESULTADO DA SUA ANÁLISE</p>
                <span>97% COMPATÍVEL</span>
              </div>
              <p className="spotlight-recommendation__eyebrow">INDICAÇÃO PRINCIPAL</p>
              <h3 className="spotlight-recommendation__title font-display">ÍRIS 01</h3>
              <p className="spotlight-recommendation__subtitle">Sérum calmante para barreira sensibilizada</p>
              <p className="spotlight-recommendation__reason">
                Sua pele indicou sensibilidade e perda de hidratação. A fórmula combina ativos reparadores e uma textura leve que respeita sua rotina.
              </p>
              <ul className="spotlight-recommendation__tags" aria-label="Motivos da recomendação">
                <li>SEM FRAGRÂNCIA</li>
                <li>TEXTURA LEVE</li>
                <li>BARREIRA + HIDRATAÇÃO</li>
              </ul>
              <div className="spotlight-recommendation__purchase mt-auto">
                <div>
                  <span>A PARTIR DE</span>
                  <strong>R$ 129,90</strong>
                </div>
                <AnimatedButton href="/produtos" className="min-w-[180px]">Conhecer produto</AnimatedButton>
              </div>
              <small>Exemplo ilustrativo de recomendação. O resultado varia conforme a análise.</small>
            </aside>
          </ScrollStageReveal>

          <SectionArrow
            href={productStageOpen ? "#como-funciona" : undefined}
            onClick={productStageOpen ? undefined : revealProductStage}
            label={productStageOpen ? "Continuar para como funciona" : "Revelar recomendação personalizada"}
            caption={productStageOpen ? "CONTINUAR" : "REVELAR ANÁLISE"}
            tone="light"
          />
        </div>
      </section>

      <section
        id="como-funciona"
        data-panel
        data-snap-section
        className="section-transition immersive-panel editorial-panel mx-auto max-w-[1440px] bg-white"
        style={sectionSurface("#ffffff")}
        aria-labelledby="editorial-title"
      >
        <div data-panel-content className="editorial-shell">
          <h2 id="editorial-title" className="editorial-title font-display tracking-[0.03em]">TEXTURA. CONTEXTO. ROTINA.</h2>

          <div className="editorial-desktop-steps">
            <div className="editorial-top">
              <EditorialImage
                src="/images/texture.png"
                alt="Textura cremosa e cápsula de skincare em tons rosados"
                label="01 · TEXTURAS QUE SUA PELE TOLERA"
                note="HIDRATAÇÃO SEM PESO."
              />
              <EditorialImage
                src="/images/application.png"
                alt="Pessoa aplicando suavemente um produto de skincare no rosto"
                label="02 · COMO VOCÊ USA"
                note="SENSAÇÃO, FREQUÊNCIA E PREFERÊNCIAS."
              />
            </div>

            <div className="editorial-bottom">
              <EditorialImage
                src="/images/ritual.png"
                alt="Ritual de skincare com sérum e potes sobre composição editorial rosa"
                label="03 · PRODUTOS QUE CONVERSAM ENTRE SI"
                note="UM RITUAL MENOR, MAIS COERENTE."
                ratio="wide"
              />
              <aside className="editorial-list flex min-h-0 flex-col bg-nude">
                <h3 className="editorial-list-title font-display">
                  <span>OBSERVAR</span>
                  <span>ENTENDER</span>
                  <span>FILTRAR</span>
                  <span>RECOMENDAR.</span>
                </h3>
                <p className="editorial-list-copy max-w-[320px] font-medium text-[#6b2f45]">
                  A IA organiza os sinais. Você continua no centro das escolhas.
                </p>
                <AnimatedButton href="/analise" className="editorial-list-action mt-auto w-fit min-w-[220px]">
                  Ver minha curadoria
                </AnimatedButton>
              </aside>
            </div>
          </div>

          <MobileStepDeck />
        </div>
        <SectionArrow href="#diagnostico" label="Ir para o diagnóstico" caption="CONTINUAR" tone="dark" />
      </section>

      <section
        id="diagnostico"
        data-panel
        data-closing
        data-snap-section
        className="section-transition immersive-panel closing-panel relative mx-auto max-w-[1440px] overflow-hidden bg-nude"
        style={sectionSurface("#d9b7a7")}
        aria-labelledby="closing-title"
      >
        <div data-closing-image className="closing-visual absolute">
          <Image
            src="/images/closing-portrait.png"
            alt="Mulher de perfil em uma composição rosada da D’Accord"
            fill
            quality={90}
            loading="lazy"
            decoding="async"
            sizes="(max-width: 767px) 100vw, 65vw"
            className="object-cover object-center"
          />
        </div>
        <div data-panel-content className="closing-copy relative z-10 flex h-full flex-col">
          <h2 id="closing-title" className="closing-title font-display">
            ANALISE<br />ENTENDA<br />ESCOLHA<br />D’ACCORD.
          </h2>
          <p className="closing-description max-w-[520px] font-medium tracking-[0.08em] text-ink-muted text-balance">
            Uma experiência de poucos minutos para transformar dúvida em um ritual mais coerente com a sua pele.
          </p>
          <AnimatedButton href="/analise" className="closing-action mt-auto w-fit min-w-[250px]">
            Começar diagnóstico
          </AnimatedButton>
        </div>
      </section>

      <footer
        data-snap-section
        className="site-footer bg-white text-plum"
        aria-label="Rodapé"
      >
        <div className="footer-shell mx-auto grid max-w-[1440px]">
          <div>
            <Link href="/" className="footer-wordmark leading-none font-bold tracking-[-0.055em]">D’ACCORD</Link>
            <p className="mt-4 max-w-sm font-elegant text-lg text-ink-muted">Beleza guiada pela sua pele.</p>
          </div>
          <nav aria-label="Links do rodapé" className="footer-nav">
            <p className="mb-4 text-[11px] font-bold tracking-[0.14em] text-brand-dark">NAVEGAÇÃO</p>
            <ul className="space-y-1 text-sm font-medium leading-7">
              <li><Link className="transition-colors hover:text-brand" href="/produtos">PRODUTOS</Link></li>
              <li><Link className="transition-colors hover:text-brand" href="#como-funciona">COMO FUNCIONA</Link></li>
              <li><Link className="transition-colors hover:text-brand" href="/sobre">SOBRE NÓS</Link></li>
              <li><Link className="transition-colors hover:text-brand" href="/privacidade">PRIVACIDADE</Link></li>
              <li><Link className="transition-colors hover:text-brand" href="/contato">AJUDA</Link></li>
            </ul>
          </nav>
          <div className="footer-legal border-t border-plum/15 pt-5 text-xs text-ink-muted">
            <p>© 2026 D’Accord · Projeto acadêmico</p>
            <p className="max-w-md md:text-right">Orientação cosmética. Não substitui avaliação de um profissional dermatologista.</p>
          </div>
        </div>
      </footer>

    </main>
  );
}

function EditorialImage({
  src,
  alt,
  label,
  note,
  ratio = "standard",
}: {
  src: string;
  alt: string;
  label: string;
  note: string;
  ratio?: "standard" | "wide";
}) {
  return (
    <figure className={`editorial-figure editorial-figure-${ratio}`}>
      <div className="editorial-media relative min-h-0 overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          quality={90}
          loading="lazy"
          decoding="async"
          sizes={ratio === "wide" ? "(max-width: 1023px) 100vw, 66vw" : "(max-width: 767px) 100vw, 50vw"}
          className="object-cover transition-transform duration-700 hover:scale-[1.025]"
        />
      </div>
      <figcaption className="editorial-caption">
        <span className="block">{label}</span>
        <span className="block">{note}</span>
      </figcaption>
    </figure>
  );
}

function SectionArrow({
  href,
  label,
  tone,
  onClick,
  caption,
}: {
  href?: string;
  label: string;
  tone: "light" | "dark";
  onClick?: () => void;
  caption?: string;
}) {
  const reduceMotion = useReducedMotion();

  const indicator = (
    <>
      {caption ? <span className="section-arrow-caption">{caption}</span> : null}
      <span className="section-arrow-trail" aria-hidden="true" />
      {[0, 1].map((index) => (
        <motion.span
          key={index}
          className="section-arrow-chevron"
          animate={reduceMotion ? undefined : {
            y: [-9, 3, 15],
            opacity: [0, 1, 0],
            scale: [0.72, 1, 1.18],
          }}
          transition={{
            duration: 1.9,
            delay: index * 0.58,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          aria-hidden="true"
        >
          <Image
            src={tone === "light" ? "/images/arrow-down.svg" : "/images/arrow-down-alt.svg"}
            alt=""
            width={30}
            height={19}
          />
        </motion.span>
      ))}
    </>
  );

  if (href) return (
    <motion.a
      href={href}
      aria-label={label}
      className={`section-arrow section-arrow-${tone}`}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.94 }}
    >
      {indicator}
    </motion.a>
  );

  return (
    <motion.button
      type="button"
      aria-label={label}
      className={`section-arrow section-arrow-${tone}`}
      onClick={onClick}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.94 }}
    >
      {indicator}
    </motion.button>
  );
}
