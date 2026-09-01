---
sketch: 015
name: order-confirmation-recovery
question: "Como confirmar o pedido e recuperar pagamento pendente ou falho com segurança?"
winner: "B"
tags: [confirmation, receipt, order-status, pix, payment-failure, recovery, responsive]
---

# Sketch 015: Confirmação e recuperação

## Design Question

Como entregar um recibo confiável, próximos passos claros e recuperação segura para Pix pendente, cartão em análise ou pagamento falho, sem fazer o cliente repetir a compra ou confundir pedido criado com pagamento confirmado?

## How to View

Abra `.planning/sketches/015-order-confirmation-recovery/index.html` diretamente ou use o endereço local informado no checkpoint.

## Variants

- **A: Recibo editorial** — confirmação e número do pedido dominam a página, com resumo e ações de pós-compra ao lado.
- **B: Acompanhamento imediato** — a linha do tempo do pedido se torna o elemento principal desde a confirmação.
- **C: Central de status** — sucesso, pendência e falha compartilham uma central operacional com a ação de recuperação prioritária.

## What to Look For

- Se número, valor, contato, entrega e pagamento ficam registrados como recibo verificável.
- Se a diferença entre pedido criado, pagamento pendente e pagamento aprovado é inequívoca.
- Se Pix apresenta tempo restante, cópia do código e consulta do mesmo pedido.
- Se falha ou timeout permite tentar novamente sem criar duplicidade.
- Se expiração orienta retorno seguro à sacola e nova tentativa consciente.
- Se falha no envio do e-mail não invalida um pedido confirmado.
- Se acompanhamento, suporte e compra como convidado têm saídas úteis em 360, 768 e 1440 px.

## Requirements Covered

- `COM-08` — confirmação, número do pedido, resumo, acompanhamento e próximos passos.
- `COM-09` — pagamento pendente ou falho, nova tentativa, troca de método e prevenção de duplicidade.
- Estado transversal de sucesso — recibo e identificador persistentes.

## Winner

**B: Acompanhamento imediato.** A linha do tempo ocupa o primeiro plano desde a confirmação, mantendo estado atual, recibo, resumo, suporte e recuperação vinculados ao mesmo identificador de pedido.
