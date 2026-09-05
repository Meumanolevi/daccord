---
sketch: 033
name: admin-users-rbac
question: "Como administrar usuários internos, papéis, permissões e sessões sem permitir privilégios excessivos ou mudanças invisíveis?"
winner: "A"
tags: [admin, users, rbac, permissions, mfa, sessions, audit, security, responsive]
---

# Sketch 033: Usuários internos e acesso

## Design Question

Como administrar usuários internos, papéis, permissões e sessões sem permitir privilégios excessivos ou mudanças invisíveis?

## How to View

Abra `.planning/sketches/033-admin-users-rbac/index.html` diretamente ou use o endereço local informado no checkpoint.

## Variants

- **A: Diretório com inspetor** — seleciona uma pessoa e reúne papel, permissões efetivas, MFA, sessões e histórico no mesmo contexto.
- **B: Matriz por papel** — compara capacidades por domínio e evidencia alterações, conflitos e separação de funções antes da publicação.
- **C: Central de acesso e sessões** — prioriza convites, sessões ativas, anomalias e respostas rápidas a risco de acesso.

## What to Look For

- Se papel atribuído e permissões efetivas são fáceis de distinguir.
- Se ninguém consegue ampliar o próprio acesso ou ignorar separação de funções.
- Se permissões de leitura, operação e aprovação permanecem independentes.
- Se MFA, convite, bloqueio e sessões possuem estados claros.
- Se acessos a fotografia, perfil de pele e direitos de privacidade exigem autorização específica.
- Se alterações críticas exigem motivo, confirmação e geram auditoria.
- Se a experiência continua utilizável em 375, 768 e 1280 px.

## States Covered

- Operação atual.
- Privilégio excessivo detectado.
- Convite expirado.
- Nenhum resultado.
- Carregamento.

## Winner

**A — Diretório com inspetor.** A gestão começa pela pessoa e mantém papel atribuído, permissões efetivas, estado do MFA, revisão periódica, sessões e histórico no mesmo contexto. Mudanças críticas continuam submetidas à menor permissão, justificativa, segunda aprovação e auditoria.
