---
sketch: 034
name: admin-audit-traceability
question: "Como investigar eventos administrativos e produzir evidências confiáveis sem tornar o histórico editável ou expor dados desnecessários?"
winner: "D"
tags: [admin, audit, events, traceability, correlation, evidence, integrity, privacy, responsive]
---

# Sketch 034: Auditoria e rastreabilidade

## Design Question

Como investigar eventos administrativos e produzir evidências confiáveis sem tornar o histórico editável ou expor dados desnecessários?

## How to View

Abra `.planning/sketches/034-admin-audit-traceability/index.html` diretamente ou use o endereço local informado no checkpoint.

## Variants

- **A: Eventos com inspetor** — lista cronológica filtrável e detalhes imutáveis com ator, motivo, entidade, diferença e correlação.
- **B: Investigação correlacionada** — parte de um pedido, análise, usuário ou solicitação e recompõe a sequência entre serviços.
- **C: Pacotes de evidência** — organiza consultas salvas, cobertura, retenção e exportações verificáveis para revisão.
- **D: Linha + inspetor** — sintetiza a sequência correlacionada da B com o log preciso e o detalhamento imutável da A.

## What to Look For

- Se é possível responder quem fez, o quê, quando, por quê e com qual resultado.
- Se horário, fuso, ator, papel e identificador de correlação permanecem inequívocos.
- Se estados anteriores e posteriores mostram apenas os campos necessários.
- Se dados sensíveis continuam mascarados conforme o papel do revisor.
- Se falhas de integridade e limites de retenção aparecem antes de uma conclusão.
- Se exportações registram finalidade, filtros, hash e responsável.
- Se a experiência continua utilizável em 375, 768 e 1280 px.

## States Covered

- Operação atual.
- Alerta de integridade.
- Limite de retenção.
- Nenhum resultado.
- Carregamento.

## Winner

**D — Linha + inspetor.** Síntese B + A aprovada: a investigação começa pela entidade e sua sequência correlacionada; o log e o inspetor detalham cada evento no mesmo espaço. A seleção permanece sincronizada entre linha, log e detalhe, com ator, horário, origem, alterações, dados minimizados e integridade visíveis.
