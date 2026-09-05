---
sketch: 035
name: admin-settings-integrations
question: "Como configurar a operação da loja e suas integrações com clareza sobre o que está vigente, o que está em rascunho e o impacto de aplicar uma mudança?"
winner: "A"
tags: [admin, settings, integrations, configuration, drafts, publication, audit, responsive]
---

# Sketch 035: Configurações administrativas

## Design Question

Como configurar a operação da loja e suas integrações com clareza sobre o que está vigente, o que está em rascunho e o impacto de aplicar uma mudança?

## Scope

Sprint 6 · ADM-20 · `/admin/configuracoes`.

Exploração visual de preferências de loja, entregas, pagamentos, fluxo de análise cosmética e comunicação. Não implementa backend, credenciais, provedores, alterações de modelo nem regras clínicas. Os valores e conexões são ilustrativos; as preferências detalhadas são propostas para avaliação.

## How to View

Abra `index.html` diretamente no navegador. Os fragmentos `#a`, `#b` e `#c` selecionam a alternativa. Não exige servidor ou build. As fontes vêm dos pacotes Fontsource já instalados em `node_modules`; logo e tema usam os arquivos locais do projeto.

## Variants

- **A: Configurações por área** — navegação por domínio, formulário central e resumo do rascunho. Prioriza a edição cotidiana e a localização de preferências.
- **B: Integrações e operação** — visão de conexões, situação de cada serviço e inspetor contextual. Prioriza saúde operacional, teste e recuperação.
- **C: Revisão e publicação** — comparação entre vigente e rascunho, impacto, motivo e confirmação. Prioriza a aplicação consciente e o histórico de versões.

As alternativas compartilham os dados em memória para permitir a comparação do mesmo cenário. Trocar de alternativa não descarta o rascunho.

## What to Look For

- Facilidade de localizar uma preferência sem confundir configuração comercial e credencial técnica.
- Distinção entre editar, salvar rascunho e aplicar uma versão.
- Clareza da diferença antes/depois e do impacto apenas em novas operações.
- Conexões e falhas visíveis sem depender apenas de cor.
- Preferências de AI limitadas à continuidade do fluxo cosmético, sem promessas médicas.
- Uso de DM Sans e Staatliches, paleta D’Accord, sidebar administrativa e superfícies leves com raios discretos.
- Leitura e operação nas larguras de 375, 768 e 1280 px.

## Interactions

- Busca de áreas e integrações, seleção contextual e estado sem resultados.
- Edição de campos, seletores e switches; validação ao sair do campo e salvar.
- Salvamento de rascunho na sessão sem mudar os valores vigentes.
- Descarte com confirmação explícita.
- Teste simulado com carregamento, sucesso ou falha selecionável.
- Revisão dos campos alterados, motivo obrigatório e confirmação de impacto.
- Aplicação local que cria uma versão demonstrativa e limpa as pendências.
- Histórico consultivo, diálogo de rastreabilidade e navegação de alternativas.
- Ferramentas recolhíveis: viewport, contraste, inspeção de estilos e reinício.

## States Covered

- Operação atual com duas alterações de exemplo (horário de preparação e alternativa ao processamento de foto).
- Falha de conexão da análise por foto.
- Somente leitura, com edição e publicação desabilitadas.
- Carregamento.
- Busca sem resultados, campo inválido e rascunho sem alterações.
- Confirmação de descarte, revisão final e nova versão aplicada na demonstração.

## Data and Safety Boundaries

Não realiza chamadas de rede, não guarda segredos e não envia comunicações. Recarregar a página restaura o cenário inicial; “Salvar” mantém dados apenas na sessão aberta. O histórico e os testes são simulações, não evidências de integrações implementadas. Auditoria real e autorização de backend pertencem à implementação futura.

## Winner

**A — Configurações por área**, aprovada em 05/09/2026. A navegação por domínio mantém o formulário e o resumo do rascunho no mesmo contexto. As alternativas B e C permanecem acessíveis.

O usuário também aprovou o visual do Sketch 035 como padrão para os wireframes anteriores, com melhoria dos ícones da sidebar. A padronização está documentada em `../VISUAL-STANDARD.md`; o layout aprovado de cada tela é preservado.

## Verification

Verificado em 05/09/2026 no Edge headless: 26 verificações de interação passaram, incluindo validação, salvar sem publicar, confirmação, descarte, histórico, somente leitura e recuperação de conexão simulada. As alternativas A/B/C foram conferidas em 375, 768, 1280 e 1440 px, sem transbordamento horizontal detectado. Fontes e logo locais carregaram sem falhas; nenhuma exceção JavaScript foi registrada. Capturas de desktop e celular também foram inspecionadas visualmente. Esses testes validam apenas o protótipo, não integrações de produção.
