---
sketch: 018
name: skin-profile
question: "Como apresentar e atualizar um perfil de pele vivo, distinguindo respostas, análise e regras de segurança?"
winner: "B"
tags: [account, skin-profile, provenance, allergies, restrictions, history, responsive]
---

# Sketch 018: Perfil de pele

## Design Question

Como consolidar características, sensibilidades, alergias e objetivos em um perfil compreensível, mostrar a origem e a data de cada dado e explicar quando uma atualização exige revisar a curadoria ou realizar nova análise?

## How to View

Abra `.planning/sketches/018-skin-profile/index.html` diretamente ou use o endereço local informado no checkpoint.

## Variants

- **A: Perfil em camadas** — síntese visual central e blocos separados por fonte: informado pela cliente, observado pela análise e aplicado por segurança.
- **B: Perfil versionado** — perfil atual e mudanças anteriores organizados como uma linha do tempo auditável.
- **C: Mapa de compatibilidade** — restrições, prioridades e pontos de atenção explicam diretamente como o perfil influencia a curadoria.

## What to Look For

- Se a origem de cada informação é reconhecível sem linguagem técnica.
- Se características observadas não parecem diagnóstico ou certeza médica.
- Se alergias e condições informadas têm prioridade sem serem reinterpretadas pela IA.
- Se atualizar respostas preserva o histórico e mostra o impacto antes de alterar a curadoria.
- Se a diferença entre revisar respostas e realizar nova análise com foto fica clara.
- Se o estado sem análise continua útil, mas explicita seus limites.
- Se mapa, linha do tempo e regras visuais substituem fotografias repetitivas com informação real.
- Se a página permanece legível em 375, 768 e 1280 px.

## States Covered

- Perfil atual e curadoria compatível.
- Mudança declarada aguardando revisão de impacto.
- Nova análise recomendada.
- Perfil baseado apenas no questionário, sem foto.
- Carregamento inicial.

## Winner

**B: Perfil versionado.** O perfil atual registra as fontes que o compõem, sua data e a curadoria relacionada. Cada atualização cria uma nova versão, enquanto versões anteriores permanecem disponíveis em modo somente leitura para comparação e rastreabilidade.
