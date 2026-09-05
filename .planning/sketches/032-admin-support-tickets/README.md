---
sketch: 032
name: admin-support-tickets
question: "Como atender tickets de pedidos e análises com SLA, histórico, dados minimizados e escalonamento?"
winner: "D"
tags: [admin, support, tickets, sla, escalation, orders, analysis, privacy, responsive]
---

# Sketch 032: Central de suporte

## Design Question

Como atender tickets de pedidos e análises com SLA, histórico, dados minimizados e escalonamento sem perder o contexto do caso?

## How to View

Abra `.planning/sketches/032-admin-support-tickets/index.html` diretamente ou use o endereço local informado no checkpoint.

## Variants

- **A: Fila com conversa e contexto** — mantém lista, conversa e dados essenciais do caso no mesmo espaço, com prazo e próxima ação sempre visíveis.
- **B: Atendimento guiado por caso** — conduz a resolução por diagnóstico operacional, comunicação, ação segura e encerramento.
- **C: Central de SLA e escalonamento** — organiza filas por urgência e equipe, expondo capacidade, gargalos e transferências.
- **D: SLA + atendimento contextual** — combina capacidade e risco por equipe com fila priorizada, conversa e contexto mínimo no mesmo espaço de trabalho.

## What to Look For

- Se o atendente identifica tipo, urgência, responsável, SLA e próxima ação sem abrir várias telas.
- Se mensagens ao cliente e notas internas são impossíveis de confundir.
- Se pedido ou análise original continuam vinculados sem expor dados sensíveis por padrão.
- Se a escalada explica destino, motivo, prioridade e o que já foi tentado.
- Se suporte técnico não consegue alterar uma análise ou assumir linguagem de diagnóstico.
- Se solicitações de privacidade seguem fluxo protegido e auditável.
- Se a experiência continua utilizável em 375, 768 e 1280 px.

## States Covered

- Operação atual.
- SLA crítico.
- Integração indisponível.
- Nenhum ticket.
- Carregamento.

## Winner

**D — SLA + atendimento contextual.** Capacidade, urgência e destino de escalonamento aparecem antes da fila, mas o trabalho continua dentro do caso selecionado. A equipe filtra tickets por domínio sem perder conversa, referência original, dados protegidos, próxima ação ou prazo. Toda transferência preserva histórico e SLA.
