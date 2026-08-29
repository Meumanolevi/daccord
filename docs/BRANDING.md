# D’Accord — guia de branding

Fonte visual: arquivo Figma **D’Accord — Landing Page e Telas Principais**, página `Screens`, frame `25:56` — “V2 · 01 · Landing Page — Modelo adaptado”.

## Ideia central

**Beleza guiada pela sua pele.** A marca combina cuidado, curadoria e tecnologia para transformar sinais da pele em escolhas de skincare claras e possíveis. O texto deve soar confiante, acolhedor e direto, sem promessas médicas ou resultados absolutos.

## Paleta oficial

| Token | Valor | Uso |
| --- | --- | --- |
| `--color-plum` | `#2B1924` | texto principal e fundos de alto contraste |
| `--color-ink-muted` | `#6F6068` | texto secundário |
| `--color-brand` | `#9D286F` | CTAs e grandes áreas de marca |
| `--color-brand-dark` | `#941564` | texto e detalhes de marca |
| `--color-brand-border` | `#B4568C` | contornos e estados de foco |
| `--color-nude` | `#D9B7A7` | blocos editoriais e fechamento |
| `--color-canvas` | `#FFF0F5` | fundo suave |
| `--color-surface` | `#FFFFFF` | superfícies e contraste |

## Tipografia

- **DM Sans:** wordmark, navegação, corpo, botões e dados funcionais.
- **Staatliches:** títulos editoriais e frases-manifesto.
- **Belleza:** assinatura delicada e descriptor da marca.

As fontes são empacotadas localmente via Fontsource para evitar bloqueio de renderização e melhorar estabilidade visual e Core Web Vitals.

## Direção de arte

- composição editorial com contraste alto entre magenta, branco, nude e ameixa;
- fotografia macro de pele, texturas e cosméticos;
- títulos condensados, em caixa alta, com ritmo gráfico;
- formas ortogonais, linhas firmes e cantos retos em todos os componentes;
- cantos arredondados não fazem parte do padrão da marca e só devem ser usados quando solicitados explicitamente;
- microinterações suaves, respeitando `prefers-reduced-motion`.

## Regra de geometria

O raio padrão da interface é `0`. Botões, cards, campos, selos, imagens, modais e indicadores devem permanecer sem arredondamento. Os tokens `--daccord-radius-lg` e `--daccord-radius-full` existem apenas para compatibilidade estrutural e ambos assumem o valor `0`.

## Voz e SEO

Termos estratégicos devem aparecer de forma natural: skincare inteligente, análise de pele, rotina de skincare personalizada, curadoria de cosméticos, pele sensível, barreira cutânea e produtos compatíveis. A experiência oferece orientação cosmética e não substitui avaliação dermatológica.
