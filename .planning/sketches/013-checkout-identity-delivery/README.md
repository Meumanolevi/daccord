---
sketch: 013
name: checkout-identity-delivery
question: "Como identificar o comprador e coletar entrega com pouco atrito e validação clara?"
winner: "C"
tags: [checkout, identity, guest, address, shipping, validation, responsive]
---

# Sketch 013: Identificação e entrega

## Design Question

Como levar o cliente da sacola compacta até um contato válido, um endereço verificável e uma modalidade de entrega selecionada sem exigir cadastro antecipado, esconder custos ou perder o contexto financeiro do pedido?

## How to View

Abra `.planning/sketches/013-checkout-identity-delivery/index.html` diretamente ou use o endereço local informado no checkpoint.

## Variants

- **A: Etapas guiadas** — identificação e entrega ocupam passos explícitos, com resumo do pedido sempre visível.
- **B: Checkout em uma página** — contato, endereço e frete ficam disponíveis em uma leitura contínua, com login como atalho discreto.
- **C: CEP primeiro** — a região de entrega é validada antes dos demais campos e libera o endereço por revelação progressiva.

## What to Look For

- Se a diferença entre entrar e comprar como convidado é compreensível sem interromper a compra.
- Se os dados mínimos de contato têm propósito claro e validação recuperável.
- Se CEP, endereço, complemento e referência são coletados sem excesso de campos.
- Se prazo, custo e modalidade de entrega aparecem antes do avanço ao pagamento.
- Se cliente autenticado consegue reutilizar um endereço salvo sem perder a possibilidade de edição.
- Se falhas de CEP, endereço não localizado, região indisponível e conexão instável preservam os dados digitados.
- Se o resumo financeiro continua coerente em 360, 768 e 1440 px.

## Requirements Covered

- `COM-04` — identificação por conta ou compra como convidado, com dados mínimos de contato.
- `COM-05` — endereço, validação de CEP, modalidades, prazo e custo de entrega.
- Estado transversal de conexão instável — preservação local do formulário e retomada sem duplicidade.

## Winner

**C: CEP primeiro.** A cobertura e as modalidades de entrega são verificadas antes dos dados completos; o endereço, o contato e o resumo financeiro aparecem por revelação progressiva somente após um CEP válido.
