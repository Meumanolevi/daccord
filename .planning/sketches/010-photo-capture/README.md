---
sketch: 010
name: photo-capture
question: "Como orientar captura, permissão, quality gate e retake com feedback acionável?"
winner: "C"
tags: [camera, upload, permission, quality-gate, retake, privacy, responsive]
---

# Sketch 010: Captura e validação da foto

## Design Question

Como ajudar a pessoa a produzir uma selfie frontal adequada, explicar o uso temporário da imagem e resolver permissão negada ou falha de qualidade sem culpar o usuário, perder o questionário ou consumir uma análise do provedor antes da aprovação?

## How to View

Abra `.planning/sketches/010-photo-capture/index.html` diretamente ou use o endereço local informado no checkpoint.

## Variants

- **A: Câmera imersiva** — orientação e quality gate aparecem sobre uma prévia ampla, com pouca mudança de contexto.
- **B: Preparar, capturar, confirmar** — separa instruções, câmera e validação em passos visíveis e previsvisíveis.
- **C: Captura assistida** — mantém câmera e checklist lado a lado, atualizando condições em tempo real, com uma prévia fotográfica exclusiva deste contexto.

## What to Look For

- Se as instruções de luz, pose, nitidez, distância e remoção de acessórios são compreendidas antes da captura.
- Se permissão de câmera e upload JPG/PNG/HEIC são alternativas claras.
- Se cada retake mostra apenas um motivo prioritário e uma ação concreta.
- Se a pessoa entende que o quality gate acontece antes da análise e não gera cobrança ou consumo do provedor.
- Se o uso temporário e a exclusão da foto permanecem visíveis durante a captura.
- Se a referência visual exclusiva diferencia esta etapa dos retratos editoriais usados em outras partes da experiência.
- Se o fluxo funciona em 360, 768 e 1440 px.

## Requirements Covered

- `CORE-05` — preparo da foto e referências de captura.
- `CORE-06` — permissão, câmera, upload e fallback de dispositivo.
- `CORE-07` — quality gate, retake e confirmação final.
- `RF-003`, `RF-004`, `RF-013`.
- `RN-06` a `RN-09` e regras de eliminação da foto.

## Winner

**C: Captura assistida** — aprovada por manter orientação de qualidade ao lado da câmera, apresentar um ajuste prioritário por vez e usar uma referência visual exclusiva, neutra e própria da etapa de captura.
