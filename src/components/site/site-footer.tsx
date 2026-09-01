import Link from "next/link";
import styles from "./site-footer.module.css";

const footerGroups = [
  {
    label: "Descobrir",
    links: [
      { href: "/produtos", label: "Produtos" },
      { href: "/analise", label: "Análise de pele" },
      { href: "/recomendacoes", label: "Minha curadoria" },
    ],
  },
  {
    label: "D’Accord",
    links: [
      { href: "/sobre", label: "Sobre nós" },
      { href: "/contato", label: "Ajuda e contato" },
      { href: "/privacidade", label: "Privacidade" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className={styles.footer} aria-label="Rodapé">
      <div className={styles.grid}>
        <div className={styles.brand}>
          <Link href="/" aria-label="D’Accord — página inicial">D’ACCORD</Link>
          <p>Beleza guiada pela sua pele.</p>
        </div>

        {footerGroups.map((group) => (
          <nav key={group.label} aria-label={group.label} className={styles.group}>
            <p>{group.label}</p>
            <ul>
              {group.links.map((link) => (
                <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
              ))}
            </ul>
          </nav>
        ))}

        <div className={styles.notice}>
          <p>Orientação cosmética com limites claros.</p>
          <span>A D’Accord não realiza diagnóstico e não substitui avaliação dermatológica.</span>
        </div>
      </div>
      <div className={styles.legal}>
        <span>© 2026 D’Accord · Projeto acadêmico</span>
        <span>Privacidade desde a primeira escolha.</span>
      </div>
    </footer>
  );
}
