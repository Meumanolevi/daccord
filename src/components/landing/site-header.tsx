"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const utilityLinks = [
  { label: "Sobre a D’Accord", href: "/sobre" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Precisa de ajuda?", href: "/contato" },
];

const filterLinks = [
  { label: "Produtos", href: "/produtos" },
  { label: "Pele seca", href: "/produtos?tipo=seca" },
  { label: "Pele oleosa", href: "/produtos?tipo=oleosa" },
  { label: "Sensibilidade", href: "/produtos?necessidade=sensibilidade" },
  { label: "Hidratação", href: "/produtos?necessidade=hidratacao" },
  { label: "Textura leve", href: "/produtos?textura=leve" },
  { label: "Sem fragrância", href: "/produtos?preferencia=sem-fragrancia" },
  { label: "Proteção solar", href: "/produtos?categoria=protecao-solar" },
];

type SiteHeaderProps = {
  isAuthenticated?: boolean;
};

export function SiteHeader({ isAuthenticated = false }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const savedLargeText = window.localStorage.getItem("daccord-large-text") === "true";
    const savedHighContrast = window.localStorage.getItem("daccord-high-contrast") === "true";

    const frame = window.requestAnimationFrame(() => {
      setLargeText(savedLargeText);
      setHighContrast(savedHighContrast);
      document.documentElement.classList.toggle("daccord-large-text", savedLargeText);
      document.documentElement.classList.toggle("daccord-high-contrast", savedHighContrast);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const toggleLargeText = () => {
    const nextValue = !largeText;
    setLargeText(nextValue);
    document.documentElement.classList.toggle("daccord-large-text", nextValue);
    window.localStorage.setItem("daccord-large-text", String(nextValue));
  };

  const toggleHighContrast = () => {
    const nextValue = !highContrast;
    setHighContrast(nextValue);
    document.documentElement.classList.toggle("daccord-high-contrast", nextValue);
    window.localStorage.setItem("daccord-high-contrast", String(nextValue));
  };

  return (
    <header className={`site-header relative bg-white ${isAuthenticated ? "site-header--authenticated" : ""}`} aria-label="Cabeçalho principal">
      {!isAuthenticated ? (
        <aside className="header-login-notice" aria-label="Aviso de acesso à conta">
          <p>
            <Link href="/entrar">Faça login</Link>
            <span className="header-login-notice__desktop"> para salvar sua análise e acompanhar recomendações feitas para a sua pele.</span>
            <span className="header-login-notice__mobile"> para salvar sua análise e recomendações.</span>
          </p>
        </aside>
      ) : null}

      <div className="header-utility">
        <div className="header-utility__content">
          <div className="header-utility__group">
            <div className="header-accessibility">
              <button
                type="button"
                aria-expanded={accessibilityOpen}
                aria-controls="accessibility-controls"
                onClick={() => setAccessibilityOpen((open) => !open)}
              >
                <HeaderIcon name="accessibility" />
                Acessibilidade
                <HeaderIcon name="chevron" />
              </button>

              <AnimatePresence>
                {accessibilityOpen ? (
                  <motion.div
                    id="accessibility-controls"
                    className="header-accessibility__panel"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                  >
                    <AccessibilityControls
                      largeText={largeText}
                      highContrast={highContrast}
                      onLargeText={toggleLargeText}
                      onHighContrast={toggleHighContrast}
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <nav aria-label="Atalhos institucionais">
              <ul>
                {utilityLinks.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <nav aria-label="Atalhos pessoais">
            <ul>
              <li><Link href="/privacidade">Privacidade</Link></li>
              <li><Link href="/analise">Minha análise</Link></li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="header-main">
        <form action="/produtos" className="header-search" role="search">
          <input name="busca" type="search" aria-label="Buscar produtos" placeholder="O que sua pele precisa hoje?" />
          <button type="submit" aria-label="Buscar">
            <HeaderIcon name="search" />
          </button>
        </form>

        <button
          type="button"
          aria-label="Buscar produtos"
          className="header-mobile-action header-mobile-search"
          onClick={() => setMenuOpen(true)}
        >
          <HeaderIcon name="search" />
        </button>

        <Link
          href="/"
          aria-label="D’Accord — página inicial"
          className="header-wordmark font-sans leading-none font-bold tracking-[-0.055em] text-plum"
        >
          D’ACCORD
        </Link>

        <div className="header-actions">
          <Link href="/analise" className="header-action-link header-action-link--analysis">
            <HeaderIcon name="sparkles" />
            <span>Analisar pele</span>
          </Link>
          <Link href="/recomendacoes" className="header-action-link">
            <HeaderIcon name="heart" />
            <span>Minha curadoria</span>
          </Link>
          <Link href={isAuthenticated ? "/analise" : "/entrar"} className="header-action-link">
            <HeaderIcon name="user" />
            <span>{isAuthenticated ? "Minha conta" : "Entrar"}</span>
          </Link>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-header-menu"
          className="header-mobile-action header-menu-button"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true">
            <i className={menuOpen ? "is-open" : ""} />
            <i className={menuOpen ? "is-open" : ""} />
          </span>
        </button>
      </div>

      <nav className="header-filters" aria-label="Filtros rápidos de produtos">
        <ul>
          {filterLinks.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-header-menu"
            className="header-mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <form action="/produtos" className="header-mobile-menu__search" role="search">
              <input name="busca" type="search" aria-label="Buscar produtos" placeholder="O que sua pele precisa hoje?" />
              <button type="submit" aria-label="Buscar"><HeaderIcon name="search" /></button>
            </form>

            <nav aria-label="Navegação móvel">
              <ul className="header-mobile-menu__links">
                {[...utilityLinks, { label: "Produtos", href: "/produtos" }, { label: "Minha análise", href: "/analise" }].map((item) => (
                  <li key={`${item.href}-${item.label}`}>
                    <Link href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="header-mobile-menu__accessibility">
              <p>Acessibilidade</p>
              <AccessibilityControls
                largeText={largeText}
                highContrast={highContrast}
                onLargeText={toggleLargeText}
                onHighContrast={toggleHighContrast}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="header-rule bg-brand" />
    </header>
  );
}

function AccessibilityControls({
  largeText,
  highContrast,
  onLargeText,
  onHighContrast,
}: {
  largeText: boolean;
  highContrast: boolean;
  onLargeText: () => void;
  onHighContrast: () => void;
}) {
  return (
    <div className="accessibility-controls">
      <button type="button" aria-pressed={largeText} onClick={onLargeText}>
        <span aria-hidden="true">A+</span>
        Texto maior
      </button>
      <button type="button" aria-pressed={highContrast} onClick={onHighContrast}>
        <span className="contrast-symbol" aria-hidden="true" />
        Alto contraste
      </button>
    </div>
  );
}

function HeaderIcon({ name }: { name: "accessibility" | "chevron" | "heart" | "search" | "sparkles" | "user" }) {
  const paths = {
    accessibility: <><circle cx="12" cy="4" r="2" /><path d="M5 8h14M12 6v6m0 0-4 8m4-8 4 8" /></>,
    chevron: <path d="m8 10 4 4 4-4" />,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    sparkles: <><path d="m12 3 1.2 3.3L16.5 7.5l-3.3 1.2L12 12l-1.2-3.3-3.3-1.2 3.3-1.2L12 3Z" /><path d="m18.5 13 .7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z" /><path d="m5 14 1 2.5 2.5 1L6 18.5 5 21l-1-2.5-2.5-1 2.5-1L5 14Z" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  };

  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}
