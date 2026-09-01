---
sketch: 029
name: admin-ai-review-governance
question: "Como revisar exceções individuais e governar a qualidade da AI sem transformar sinais cosméticos em diagnóstico ou expor fotografias continuamente?"
winner: "A"
tags: [admin, ai, analysis, human-review, governance, safety, privacy, audit, responsive]
---

# Sketch 029: Revisão humana e governança da AI

## Design Question

Como organizar a fila de análises, a decisão humana e a saúde do sistema com evidências suficientes, responsabilidades claras e proteção dos dados sensíveis?

## How to View

Abra `.planning/sketches/029-admin-ai-review-governance/index.html` diretamente ou use o endereço local informado no checkpoint.

## Variants

- **A: Fila de risco com inspetor** — prioriza exceções por motivo, impacto e SLA, preservando o contexto durante a revisão.
- **B: Mesa de decisão guiada** — conduz a pessoa revisora por contexto, evidências, elegibilidade de produtos e decisão final.
- **C: Centro de governança** — acompanha versões, qualidade, divergências entre grupos e mudanças de regras.

## What to Look For

- Se a AI aparece como apoio à triagem e recomendação cosmética, nunca como diagnóstico.
- Se a revisão explica por que o caso foi encaminhado e quais sinais possuem incerteza.
- Se questionário, captura, regras de segurança e catálogo mantêm origens separadas.
- Se fotografias ficam ocultas até existir necessidade operacional auditável.
- Se aprovar, solicitar nova captura, limitar a recomendação ou escalar exige justificativa.
- Se métricas agregadas não substituem a inspeção de casos e recortes de qualidade.
- Se alterações de modelo ou regras possuem versão, revisão, publicação gradual e reversão.
- Se a experiência permanece funcional em 375, 768 e 1280 px.

## States Covered

- Operação atual.
- Prioridade crítica.
- Qualidade degradada.
- Fila vazia.
- Carregamento.

## Winner

**A — Fila de risco com inspetor.** A revisão começa pelas exceções ordenadas por risco, SLA e possibilidade de recuperação. O inspetor preserva o contexto, explica o motivo do encaminhamento e mantém identidade e captura protegidas. Fotografias só aparecem mediante acesso auditado, e toda decisão exige motivo, justificativa e confirmação dos limites cosméticos.
