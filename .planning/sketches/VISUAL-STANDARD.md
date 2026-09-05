# D’Accord — padrão visual dos wireframes

Referência aprovada: **Sketch 035 A — Configurações por área**, em 05/09/2026.

## Abrangência

Aplicado aos sketches 001–035 e suas alternativas, sem substituir as composições escolhidas. A loja mantém header centralizado e linguagem editorial; conta e ADM mantêm os respectivos modelos de navegação. O padrão vale para os protótipos HTML, não altera as páginas implementadas em `src` e não implementa serviços reais.

Esta aprovação atualiza, para os wireframes, as antigas restrições de cantos inteiramente retos. As decisões históricas no manifesto ficam preservadas como registro.

## Linguagem visual

- **Fontes:** DM Sans para texto funcional, Staatliches para títulos e Belleza nas assinaturas editoriais. Fontes locais dos mesmos pacotes usados no projeto; não depender de fontes substitutas do sistema.
- **Paleta:** ameixa `#2B1924`, magenta `#9D286F`, branco e nude `#D9B7A7`. Fundos operacionais claros, estados semânticos acompanhados de texto.
- **Geometria:** controles com raios de 5–6 px, superfícies com 8 px. Avatares, switches e indicadores podem permanecer circulares. A composição editorial não se transforma em cartões arredondados indiscriminadamente.
- **Superfícies:** sombras discretas e divisórias suaves. Evitar contornos escuros concorrendo com conteúdo; preservar limites necessários em campos, estados e componentes de contraste.
- **Tipografia funcional:** rótulos pequenos dos protótipos antigos elevados a 10 px; ações principais e textos de apoio com 12 px. Escala editorial, títulos e hierarquia local são preservados. Esses valores descrevem a apresentação dos wireframes, não uma especificação de acessibilidade para a aplicação final.
- **Sidebar:** ícones SVG de 20 px, viewBox 24, traço 1,7, extremidades arredondadas e sem preenchimento. Estado ativo por fundo e marcador lateral; ícones herdam a cor do contexto.

## Arquivos compartilhados

- `themes/default.css`: tokens de marca, tipografia, raios e sombras.
- `themes/visual-standard.css`: fontes locais e acabamento comum; carregado depois do CSS específico de cada sketch.
- `themes/sidebar-icons.js`: biblioteca SVG local para navegação. Preserva botões, textos, estados, permissões e eventos existentes. Reaplica os ícones quando um sketch recria a sidebar dinamicamente.

Cada `index.html` inclui os arquivos compartilhados e identifica seu escopo por `data-visual-standard="035-a"`, `data-wf-sketch` e `data-wf-shell`. O prefixo `wf` evita colisões com seletores de templates dos protótipos existentes.

## Guardrails de manutenção

Não alterar vencedor, conteúdo, lógica, sequência da jornada ou layout para obter uniformidade estética. Não substituir fotografias por repetição de assets. Novos ícones devem usar a biblioteca local, com nome acessível no controle e SVG decorativo oculto de leitores de tela. Fontes e ícones não exigem conexão externa.

Mudanças comuns devem ser feitas no padrão compartilhado; exceções responsivas devem ser explícitas e limitadas ao sketch afetado.

## Verificação da padronização

Em 05/09/2026, a navegação entre as 110 alternativas foi exercitada no Edge headless em 375, 768 e 1440 px (330 combinações). Nenhuma exceção JavaScript nem transbordamento horizontal da página foi registrado. A checagem geométrica restante apontou somente a linha pontilhada decorativa do Sketch 015 B em duas larguras, já presente antes da padronização; não se trata de texto ou controle cortado.

Capturas representativas da loja, conta e ADM foram inspecionadas visualmente. As grades de produto e sacola, listas administrativas e resumos receberam ajustes responsivos localizados para comportar os rótulos maiores. Os scripts inline dos sketches 001–034 foram comparados com o Git e permaneceram idênticos; a hidratação dos ícones é compartilhada e aditiva.

No Sketch 035, 26 verificações funcionais adicionais passaram: validação, rascunho, revisão, confirmação, descarte, histórico, somente leitura, falha/recuperação simulada, fontes e arquivos locais. Todas as verificações se referem aos protótipos, sem integração real com serviços externos.
