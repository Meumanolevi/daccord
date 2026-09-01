---
sketch: 011
name: analysis-result
question: "Como explicar sinais, confiança, limites e rotina recomendada sem sugerir diagnóstico?"
winner: "A"
tags: [analysis-result, explainability, recommendation, routine, confidence, safety, responsive]
---

# Sketch 011: Resultado e recomendação

## Design Question

Como transformar sinais cosméticos visíveis, respostas declaradas e regras de segurança em uma recomendação compreensível, explicável e comercialmente útil, sem expor dados brutos do provedor, converter baixa confiança em certeza ou sugerir diagnóstico?

## How to View

Abra `.planning/sketches/011-analysis-result/index.html` diretamente ou use o endereço local informado no checkpoint.

## Variants

- **A: Resultado em camadas** — começa por uma síntese visual e permite avançar para sinais, motivos e rotina sem sobrecarregar a primeira leitura.
- **B: Rotina primeiro** — organiza manhã e noite como ação principal, mantendo confiança, limites e justificativas próximos de cada produto.
- **C: Mapa da decisão** — mostra a cadeia sinais + respostas → regras aplicadas → produtos elegíveis, priorizando transparência.

## What to Look For

- Se sinais visíveis são claramente diferentes de condições ou diagnósticos.
- Se confiança, baixa confiança e resultado somente pelo questionário são compreensíveis.
- Se cada produto possui ao menos dois motivos rastreáveis e alternativas seguras.
- Se exclusões por alergia ou regra aparecem sem expor dados sensíveis desnecessários.
- Se manhã/noite, ordem de uso e teste de contato são acionáveis sem linguagem de prescrição.
- Se falha do provedor, expiração, exclusão e salvamento do histórico possuem saídas claras.
- Se indicadores e silhuetas de produto substituem retratos repetidos de forma visualmente interessante.

## Requirements Covered

- `CORE-08` — processamento, timeout, retomada e falha do provedor.
- `CORE-09` e `CORE-10` — resumo, confiança, sinais, limites e detalhes.
- `CORE-11` e `CORE-12` — rotina, ordem, justificativas, alternativas e exclusões.
- `RF-007` a `RF-014`, `RF-016` e `RF-018`.
- `RN-08` a `RN-22`.

## Winner

**A: Resultado em camadas** — aprovada por começar com uma síntese visual acolhedora e permitir aprofundamento progressivo em sinais, confiança, limites, motivos, alternativas e rotina.
