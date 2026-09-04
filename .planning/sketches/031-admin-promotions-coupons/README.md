---
sketch: 031
name: admin-promotions-coupons
question: "Como criar e operar promoções e cupons preservando elegibilidade, limites, vigência e impacto financeiro?"
winner: "A"
tags: [admin, promotions, coupons, eligibility, limits, finance, scheduling, responsive]
---

# Sketch 031: Promoções e cupons

## Design Question

Como permitir que a equipe crie, simule, aprove e acompanhe promoções sem gerar sobreposição de benefícios, uso indevido ou impacto financeiro invisível?

## How to View

Abra `.planning/sketches/031-admin-promotions-coupons/index.html` diretamente ou use o endereço local informado no checkpoint.

## Variants

- **A: Campanhas com simulador** — lista operacional e inspetor lateral unem regras, desempenho, orçamento e simulação de carrinho.
- **B: Criação guiada** — constrói uma promoção por objetivo, benefício, elegibilidade, limites e revisão antes da ativação.
- **C: Calendário financeiro** — posiciona campanhas no tempo e evidencia concorrência, teto de desconto e impacto previsto.

## What to Look For

- Se benefício, elegibilidade, exclusões, cumulatividade e limites ficam compreensíveis antes da ativação.
- Se a simulação explica por que um cupom foi aplicado ou bloqueado.
- Se vigência, fuso horário, orçamento e número máximo de usos permanecem visíveis.
- Se conflitos entre campanhas aparecem antes da publicação.
- Se impacto financeiro projetado e realizado não é confundido com receita.
- Se pausar, encerrar, duplicar ou editar uma campanha ativa exige contexto e registro.
- Se a experiência continua utilizável em 375, 768 e 1280 px.

## States Covered

- Operação atual.
- Conflito de regras.
- Limite financeiro atingido.
- Nenhum resultado.
- Carregamento.

## Winner

**A — Campanhas com simulador.** A equipe parte de uma lista operacional comparável e abre cada campanha em um inspetor que reúne benefício, elegibilidade, cumulatividade, uso, orçamento e vigência. O simulador reproduz as regras do checkout antes da publicação e explica de forma acionável por que o benefício foi aplicado ou bloqueado.
