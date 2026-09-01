---
sketch: 025
name: admin-operational-dashboard
question: "Como transformar indicadores, filas, alertas e SLAs em uma visão diária acionável sem criar um mosaico de números?"
winner: "A"
tags: [admin, dashboard, operations, queues, alerts, sla, responsive]
---

# Sketch 025: Dashboard operacional do ADM

## Design Question

Como ajudar a equipe a entender o que exige atenção agora, o impacto de cada exceção e a saúde geral da operação, mantendo ações, contexto e responsáveis próximos?

## How to View

Abra `.planning/sketches/025-admin-operational-dashboard/index.html` diretamente ou use o endereço local informado no checkpoint.

## Variants

- **A: Exceções primeiro** — uma fila priorizada abre a página; indicadores e tendências apoiam a decisão.
- **B: Saúde da operação** — cada domínio recebe um estado, um SLA e uma tendência em um mapa comparável.
- **C: Ritmo do dia** — a operação é organizada como uma linha do tempo do turno, com próximos eventos e ações sugeridas.

## What to Look For

- Se a primeira ação do operador fica evidente sem depender apenas de cor.
- Se cada alerta informa impacto, idade, responsável e próximo passo.
- Se indicadores distinguem volume, qualidade, receita e risco.
- Se o dashboard permite alternar período e prioridade sem perder contexto.
- Se dados sensíveis permanecem resumidos ou anonimizados.
- Se estados de pico, incidente crítico, fila vazia e carregamento continuam úteis.
- Se a tela permanece legível e funcional em 375, 768 e 1280 px.

## States Covered

- Operação normal.
- Pico de demanda.
- Incidente crítico.
- Fila concluída.
- Carregamento.

## Winner

**A: Exceções primeiro.** A fila priorizada torna imediata a principal responsabilidade do operador: identificar o que exige decisão humana e agir antes do vencimento do SLA. Impacto, idade, responsável e próximo passo permanecem próximos, enquanto pulso, receita e qualidade oferecem contexto sem competir com a ação.
