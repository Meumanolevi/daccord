---
sketch: 021
name: orders-tracking
question: "Como acompanhar um pedido ativo e consultar o histórico sem confundir pagamento, separação e entrega?"
winner: "B"
tags: [account, orders, tracking, payment, delivery, history, responsive]
---

# Sketch 021: Pedidos e acompanhamento

## Design Question

Como destacar o próximo acontecimento de um pedido, separar claramente status financeiro e logístico e ainda oferecer histórico, detalhes, comprovante, ajuda e recompra sem transformar a conta em um painel operacional?

## How to View

Abra `.planning/sketches/021-orders-tracking/index.html` diretamente ou use o endereço local informado no checkpoint.

## Variants

- **A: Acompanhamento imediato** — o pedido em andamento domina a página com previsão e linha do tempo; o histórico é secundário.
- **B: Central por status** — filtros e cartões organizam todos os pedidos, com alertas recuperáveis no topo.
- **C: Lista + detalhe** — uma lista cronológica compacta controla um painel persistente de detalhes e rastreio.

## What to Look For

- Se pagamento, preparação e transporte são estados diferentes e compreensíveis.
- Se previsão de entrega, último evento e próxima ação aparecem sem depender de jargão logístico.
- Se falhas de pagamento e entrega oferecem caminhos de recuperação sem criar um novo pedido.
- Se itens, valores, endereço, comprovante e código de rastreio aparecem no nível de detalhe adequado.
- Se ajuda recebe o número do pedido automaticamente.
- Se recompra informa indisponibilidades e alterações de preço antes de adicionar itens à sacola.
- Se dados sensíveis do endereço ficam parcialmente ocultos no histórico.
- Se a página permanece legível e funcional em 375, 768 e 1280 px.

## States Covered

- Pedido em transporte.
- Pagamento pendente com retomada.
- Exceção de entrega recuperável.
- Conta sem pedidos.
- Carregamento.

## Winner

**B: Central por status.** Filtros e cartões tornam pedidos em andamento, entregues e pendentes igualmente consultáveis, sem misturar pagamento e logística. Cada cartão expõe o próximo acontecimento ou a ação necessária, enquanto rastreio, comprovante, ajuda e recompra permanecem contextuais ao pedido correto.
