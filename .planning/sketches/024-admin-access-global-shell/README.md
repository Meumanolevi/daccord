---
sketch: 024
name: admin-access-global-shell
question: "Como estruturar acesso e navegação administrativa com contexto de papel, ambiente, alertas e auditoria?"
winner: "A"
tags: [admin, access, shell, rbac, navigation, audit, responsive]
---

# Sketch 024: Acesso e shell global do ADM

## Design Question

Como separar claramente a operação administrativa da experiência de compra, mantendo a identidade D’Accord e oferecendo acesso rápido a módulos, busca, alertas, papel, ambiente e auditoria?

## How to View

Abra `.planning/sketches/024-admin-access-global-shell/index.html` diretamente ou use o endereço local informado no checkpoint.

## Variants

- **A: Sidebar operacional** — navegação lateral estável, organizada por domínio, com contexto persistente de papel e ambiente.
- **B: Central de comando** — trilho compacto de módulos, busca global dominante e filas operacionais priorizadas.
- **C: Workspace superior** — módulos em navegação horizontal e uma área de trabalho ampla com atalhos contextuais.

## What to Look For

- Se a área administrativa é reconhecível como D’Accord sem parecer uma extensão da loja.
- Se papel, ambiente e alcance de permissão ficam visíveis antes de ações sensíveis.
- Se busca, alertas e auditoria podem ser encontrados sem disputar atenção com a tarefa atual.
- Se a navegação suporta catálogo, pedidos, clientes, análises, governança, conteúdo, suporte e configurações.
- Se estados de sessão expirada, falta de permissão e serviço degradado explicam o que ocorreu e como continuar.
- Se o shell preserva área útil suficiente para tabelas, filas, filtros e formulários.
- Se a navegação permanece funcional em 375, 768 e 1280 px.

## States Covered

- Operação normal.
- Sessão expirada e renovação com MFA.
- Acesso sem permissão.
- Serviço degradado.
- Carregamento.

## Winner

**A: Sidebar operacional.** A navegação lateral persistente oferece o melhor equilíbrio entre previsibilidade e densidade para a administração. Os módulos ficam organizados por domínio, enquanto papel, ambiente, busca, alertas e auditoria permanecem visíveis sem ocupar a área principal de trabalho.
