---
sketch: 014
name: checkout-payment-review
question: "Como coletar pagamento e revisar o pedido sem duplicidade ou surpresa financeira?"
winner: "A"
tags: [checkout, payment, card, pix, review, psp, recovery, responsive]
---

# Sketch 014: Pagamento e revisão

## Design Question

Como permitir que o cliente escolha o método de pagamento, confira todos os dados relevantes e confirme uma única vez, deixando claro o valor final, a tokenização no provedor e as correções necessárias antes de criar o pedido?

## How to View

Abra `.planning/sketches/014-checkout-payment-review/index.html` diretamente ou use o endereço local informado no checkpoint.

## Variants

- **A: Pagamento em foco** — método e dados de pagamento dominam a área principal, com revisão persistente ao lado.
- **B: Revisão antes de pagar** — contato, entrega, itens e total são confirmados antes da abertura do método de pagamento.
- **C: Confirmação consolidada** — revisão e pagamento coexistem em um único quadro final, com barra de confirmação orientada ao total.

## What to Look For

- Se cartão e Pix são distinguíveis sem sugerir benefícios comerciais ainda não aprovados.
- Se os dados do cartão deixam claro que são tokenizados e não armazenados pela D’Accord.
- Se contato, endereço, modalidade de entrega, itens e total podem ser revisados e editados.
- Se alteração de preço ou entrega interrompe a confirmação com uma ação recuperável.
- Se cartão inválido, recusa, timeout e processamento evitam novas tentativas duplicadas.
- Se o aceite final é compreensível e está próximo do valor e do CTA.
- Se a experiência permanece utilizável em 360, 768 e 1440 px.

## Requirements Covered

- `COM-06` — cartão, Pix, tokenização no PSP, parcelas e erros recuperáveis.
- `COM-07` — revisão de itens, entrega, pagamento mascarado, consentimentos e confirmação.
- Prevenção de duplicidade — CTA bloqueado durante processamento e retomada explícita em falha.

## Winner

**A: Pagamento em foco.** O método e os dados de pagamento ocupam a área principal, enquanto contato, entrega, produtos e total permanecem em uma revisão lateral persistente antes da confirmação única.
