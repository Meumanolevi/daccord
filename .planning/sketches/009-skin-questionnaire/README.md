---
sketch: 009
name: skin-questionnaire
question: "Como coletar contexto, alergias e restrições sem transformar o fluxo em anamnese clínica?"
winner: "A"
tags: [questionnaire, skin-profile, allergies, safety, progress, responsive]
---

# Sketch 009: Questionário de pele

## Design Question

Como coletar percepção de pele, reações, alergias, condições autorreferidas, medicamentos, rotina e preferências com linguagem acolhedora, explicando por que cada resposta é necessária e interrompendo o fluxo com segurança quando houver sinais fora do escopo cosmético?

## How to View

Abra `.planning/sketches/009-skin-questionnaire/index.html` diretamente ou use o endereço local informado no checkpoint.

## Variants

- **A: Passos por assunto** — uma etapa por vez, com progresso lateral, contexto curto e revisão final.
- **B: Conversa guiada** — perguntas sequenciais em linguagem natural, com respostas rápidas e contexto na própria conversa.
- **C: Panorama editável** — todas as seções em uma página, com resumo de completude persistente e edição direta.

## What to Look For

- Se o ritmo de preenchimento parece leve sem esconder a seriedade das perguntas de segurança.
- Se fica claro que condições e medicamentos são autorreferidos e servem apenas para limitar recomendações.
- Se alergias e reações são fáceis de declarar, inclusive com “não sei”.
- Se o alerta de lesão aberta, dor intensa, sangramento, reação aguda, suspeita de infecção ou piora rápida interrompe a recomendação de modo acolhedor.
- Se revisão, retomada offline e correção de respostas são compreensíveis.
- Se o questionário permanece utilizável em 360, 768 e 1440 px.

## Requirements Covered

- `CORE-03` — perfil, pele, alergias, condições, rotina e preferências.
- `CORE-04` — alerta de elegibilidade e encaminhamento profissional.
- `RF-005`, `RF-009`, `RF-014`.
- `RN-02`, `RN-03`, `RN-05`, `RN-10`, `RN-12` e regras de alerta profissional.

## Winner

**A: Passos por assunto** — aprovada por reduzir a carga cognitiva com uma etapa temática por vez, mantendo progresso, salvamento, explicações de segurança e revisão final sempre claros.
