---
sketch: 022
name: addresses-delivery-preferences
question: "Como cadastrar, escolher e editar endereços sem sugerir que a alteração muda pedidos em andamento?"
winner: "A"
tags: [account, addresses, delivery, cep, coverage, privacy, responsive]
---

# Sketch 022: Endereços e preferências de entrega

## Design Question

Como organizar endereços salvos, validação por CEP, endereço padrão e preferências de recebimento, deixando explícito que pedidos confirmados preservam uma cópia do endereço usado no checkout?

## How to View

Abra `.planning/sketches/022-addresses-delivery-preferences/index.html` diretamente ou use o endereço local informado no checkpoint.

## Variants

- **A: Carteira de endereços** — o endereço padrão recebe destaque editorial; os demais e as preferências aparecem como cartões de apoio.
- **B: CEP primeiro** — cobertura, prazo estimado e preenchimento automático antecedem o cadastro completo.
- **C: Lista + edição contextual** — uma lista compacta controla um formulário persistente de consulta e edição.

## What to Look For

- Se endereço padrão, etiqueta, destinatário e telefone são fáceis de distinguir.
- Se CEP é validado antes de revelar ou preencher o restante do formulário.
- Se dados sensíveis aparecem parcialmente ocultos fora do modo de edição.
- Se instruções de entrega são tratadas como preferência, sem promessa de cumprimento pela transportadora.
- Se definir como padrão é diferente de selecionar um endereço durante o checkout.
- Se editar ou excluir informa claramente o impacto sobre compras futuras.
- Se um pedido em andamento preserva o endereço original e encaminha mudanças urgentes para ajuda.
- Se CEP não atendido, endereço vazio e carregamento têm caminhos recuperáveis.
- Se a página permanece legível e funcional em 375, 768 e 1280 px.

## States Covered

- Endereços salvos.
- CEP fora da área atendida.
- Endereço usado em pedido em andamento.
- Conta sem endereços.
- Carregamento.

## Winner

**A: Carteira de endereços.** O endereço padrão funciona como referência visual principal, enquanto destinos secundários e preferências de recebimento permanecem próximos e fáceis de gerenciar. A edição protege dados sensíveis, valida o CEP e reforça que mudanças valem apenas para compras futuras.
