---
sketch: 019
name: analysis-library-comparison
question: "Como consultar e comparar análises anteriores sem sugerir evolução clínica ou esconder diferenças de captura?"
winner: "A"
tags: [account, analysis, history, comparison, confidence, privacy, responsive]
---

# Sketch 019: Biblioteca e comparação de análises

## Design Question

Como organizar resultados concluídos, processamentos e análises indisponíveis, permitir a comparação de duas datas e explicar limites de iluminação, enquadramento, confiança e contexto antes de indicar qualquer mudança observada?

## How to View

Abra `.planning/sketches/019-analysis-library-comparison/index.html` diretamente ou use o endereço local informado no checkpoint.

## Variants

- **A: Biblioteca editorial** — análise mais recente domina a página e o arquivo aparece como coleção visual secundária.
- **B: Linha do tempo comparável** — todas as análises formam uma sequência versionada com seleção direta de duas datas.
- **C: Comparação em foco** — duas análises ocupam o espaço principal, enquanto o histórico funciona como seletor lateral.

## What to Look For

- Se data, tipo de análise, qualidade de captura e confiança são visíveis antes dos sinais.
- Se processamento, falha de qualidade e resultado removido têm estados diferentes.
- Se a comparação limita a seleção a duas análises e evita rankings de “melhora” ou “piora”.
- Se diferenças de iluminação, câmera e questionário aparecem junto das variações observadas.
- Se sinais cosméticos são apresentados como contexto, não diagnóstico.
- Se fotos sensíveis não ficam expostas como miniaturas por padrão.
- Se abrir resultado, comparar e acessar privacidade são ações distinguíveis.
- Se a página permanece legível em 375, 768 e 1280 px.

## States Covered

- Histórico com análises concluídas.
- Nova análise em processamento.
- Conta sem análises anteriores.
- Resultado indisponível por qualidade insuficiente.
- Carregamento da biblioteca.

## Winner

**A: Biblioteca editorial.** A análise mais recente domina a página com data, contexto, confiança e condições de captura. Resultados anteriores formam um arquivo secundário e podem ser selecionados em pares para comparação contextual, sem expor fotografias por padrão.
