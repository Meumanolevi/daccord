---
sketch: 027
name: admin-order-operations
question: "Como operar pedidos distinguindo pagamento, separação, entrega, cancelamento e devolução sem reduzir tudo a um único status?"
winner: "A"
tags: [admin, orders, payment, fulfillment, delivery, cancellation, returns, responsive]
---

# Sketch 027: Operação de pedidos

## Design Question

Como localizar pedidos, reconhecer a próxima ação, entender responsabilidades e executar recuperações sensíveis sem confundir o estado financeiro com o logístico?

## How to View

Abra `.planning/sketches/027-admin-order-operations/index.html` diretamente ou use o endereço local informado no checkpoint.

## Variants

- **A: Fila com inspetor** — pedidos ordenados pela próxima ação; detalhes e comandos ficam em um inspetor contextual.
- **B: Trilhas independentes** — cada pedido compara pagamento, separação e entrega lado a lado.
- **C: Etapas operacionais** — pedidos são distribuídos em colunas conforme a responsabilidade atual.

## What to Look For

- Se pagamento, separação e entrega permanecem estados independentes.
- Se a próxima ação, seu responsável e o prazo ficam evidentes.
- Se dados pessoais e financeiros aparecem apenas quando necessários.
- Se cancelamento, estorno, reenvio e devolução explicam impacto e alcance antes da confirmação.
- Se ações sensíveis exigem motivo e geram auditoria.
- Se busca e filtros suportam número do pedido, cliente, pagamento e transportadora.
- Se estados de indisponibilidade, fila vazia e carregamento são recuperáveis.
- Se a operação continua funcional em 375, 768 e 1280 px.

## States Covered

- Pedidos atuais.
- Instabilidade da transportadora.
- Instabilidade de pagamentos.
- Fila sem pendências.
- Carregamento.

## Winner

**A: Fila com inspetor.** A fila torna a próxima ação, o responsável e o prazo reconhecíveis antes da abertura do pedido. O inspetor preserva pagamento, separação, entrega e histórico como contextos independentes, mantendo recuperações sensíveis próximas sem reduzir toda a operação a um único status.
