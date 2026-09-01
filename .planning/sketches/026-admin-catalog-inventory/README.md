---
sketch: 026
name: admin-catalog-inventory
question: "Como administrar produtos, variações, composição, estoque e elegibilidade para AI sem fragmentar o contexto?"
winner: "A"
tags: [admin, catalog, products, variants, ingredients, inventory, ai, responsive]
---

# Sketch 026: Gestão de catálogo e estoque

## Design Question

Como permitir busca, comparação e edição em escala, mantendo dados comerciais, variações, composição, restrições, estoque e uso pela recomendação AI coerentes e auditáveis?

## How to View

Abra `.planning/sketches/026-admin-catalog-inventory/index.html` diretamente ou use o endereço local informado no checkpoint.

## Variants

- **A: Lista com inspetor** — tabela densa para localizar e comparar; painel lateral preserva o contexto durante a edição.
- **B: Qualidade primeiro** — filas agrupam produtos pelos bloqueios que impedem publicação ou recomendação.
- **C: Matriz operacional** — uma grade compara variações, cobertura, composição, publicação e AI por produto.

## What to Look For

- Se busca e filtros tornam catálogos grandes administráveis.
- Se status comercial, estoque e elegibilidade para AI não são confundidos.
- Se ingredientes, alergênicos e restrições têm origem, revisão e consequência claras.
- Se variações compartilham o produto sem esconder preço ou saldo próprios.
- Se ações em lote indicam alcance e exigem confirmação.
- Se salvar, publicar e habilitar recomendações têm validações independentes.
- Se estados sem resultado, erro de sincronização e carregamento permanecem úteis.
- Se a tela continua funcional em 375, 768 e 1280 px.

## States Covered

- Catálogo atual.
- Seleção em lote.
- Erro de sincronização de estoque.
- Nenhum resultado.
- Carregamento.

## Winner

**A: Lista com inspetor.** A tabela oferece comparação rápida e ações em lote, enquanto o inspetor mantém identidade, variações, composição e elegibilidade para AI no contexto do produto selecionado. A edição não apaga filtros nem posição na listagem e se transforma em painel lateral no celular.
