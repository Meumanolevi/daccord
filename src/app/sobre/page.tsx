import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import styles from "./sobre.module.css";

export const metadata: Metadata = {
  title: "Sobre a D’Accord",
  description: "Conheça a proposta D’Accord: tecnologia, cuidado e curadoria para escolhas de skincare mais claras.",
  alternates: { canonical: "/sobre" },
};

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <SiteHeader />
      <main>
        <section className={styles.hero} aria-labelledby="about-title">
          <div className={styles.heroCopy}>
            <p>Beleza + tecnologia + cuidado</p>
            <h1 id="about-title">Beleza guiada pela sua pele.</h1>
            <span>A D’Accord nasce para reduzir tentativa e erro. Reunimos contexto, preferências e curadoria para transformar dúvidas em escolhas de skincare mais claras — sem promessas vazias.</span>
            <div className={styles.heroActions}>
              <Link href="/analise">Conhecer minha pele</Link>
              <a href="#como-funciona">Entender o método</a>
            </div>
          </div>
          <figure className={styles.heroVisual}>
            <Image src="/images/application.png" alt="Pessoa aplicando suavemente um produto de skincare no rosto" fill priority sizes="(max-width: 767px) 100vw, 48vw" />
            <figcaption><b>01</b><span>OBSERVAR ANTES DE RECOMENDAR</span></figcaption>
          </figure>
        </section>

        <section className={styles.intro}>
          <p>Nossa abordagem</p>
          <h2>Uma curadoria que explica o caminho, reconhece limites e deixa você no centro das escolhas.</h2>
          <span>Questionário, fotografia opcional e regras de compatibilidade trabalham juntos. Cada fonte preserva sua origem, e toda recomendação pode ser entendida e revisada.</span>
        </section>

        <section id="como-funciona" className={styles.method} aria-labelledby="method-title">
          <header>
            <div><p>Como funciona</p><h2 id="method-title">Quatro acordos orientam o sistema.</h2></div>
            <span>Não buscamos uma pele ideal. Buscamos escolhas possíveis para a pele, a rotina e as preferências de cada pessoa.</span>
          </header>
          <div className={styles.methodGrid}>
            <article><b>01</b><h3>Escutar o contexto</h3><p>O questionário reúne objetivos, sensibilidades, restrições e preferências sem presumir que toda pessoa deseja usar fotografia.</p></article>
            <article><b>02</b><h3>Separar as evidências</h3><p>Respostas declaradas, qualidade da captura e sinais cosméticos permanecem identificados. Uma fonte não apaga a outra.</p></article>
            <article><b>03</b><h3>Filtrar antes de ranquear</h3><p>Alergias e incompatibilidades bloqueiam produtos antes da ordenação. Estoque e composição também fazem parte da elegibilidade.</p></article>
            <article><b>04</b><h3>Explicar e permitir revisão</h3><p>A curadoria mostra motivos, alternativas e limites. Quando falta confiança, o sistema pede outra etapa ou encaminha para ajuda humana.</p></article>
          </div>
        </section>

        <section className={styles.visualStory} aria-label="Referências do método D’Accord">
          <figure className={styles.storyLarge}>
            <div><Image src="/images/texture.png" alt="Textura cosmética em composição rosada" fill sizes="(max-width: 767px) 100vw, 58vw" /></div>
            <figcaption><b>TEXTURA</b><span>Sensação e tolerância também fazem parte da escolha.</span></figcaption>
          </figure>
          <figure>
            <div><Image src="/images/ritual.png" alt="Produtos organizados em um ritual de skincare" fill sizes="(max-width: 767px) 100vw, 42vw" /></div>
            <figcaption><b>ROTINA</b><span>Menos etapas, mais coerência entre produtos.</span></figcaption>
          </figure>
        </section>

        <section className={styles.commitments} aria-labelledby="commitments-title">
          <header><p>Compromissos D’Accord</p><h2 id="commitments-title">Tecnologia com responsabilidade prática.</h2></header>
          <div className={styles.accordions}>
            <details open><summary><span>01</span> Orientação cosmética, não diagnóstico</summary><p>A experiência não identifica doenças, não prescreve tratamentos e não substitui dermatologistas. Sinais fora do escopo interrompem a recomendação automática.</p></details>
            <details><summary><span>02</span> Privacidade por escolha</summary><p>Fotografia é opcional, consentimentos são separados por finalidade e dados sensíveis não aparecem continuamente para a operação.</p></details>
            <details><summary><span>03</span> Catálogo verificável</summary><p>Composição, restrições, disponibilidade e elegibilidade são versionadas. Uma alteração relevante suspende recomendações até nova validação.</p></details>
            <details><summary><span>04</span> Incerteza visível</summary><p>Quando a captura ou as evidências são insuficientes, o sistema não força uma resposta. Ele explica o limite e oferece um próximo passo seguro.</p></details>
          </div>
        </section>

        <section className={styles.closing}>
          <div><p>Seu próximo passo</p><h2>Conhecer. Entender. Escolher D’Accord.</h2></div>
          <Link href="/analise">Começar análise</Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
