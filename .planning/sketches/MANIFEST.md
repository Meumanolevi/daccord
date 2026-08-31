# D’Accord — Sketch Manifest

## Design Direction

Wireframes de baixa fidelidade com a identidade editorial D’Accord: composição ortogonal, contraste entre ameixa, magenta, nude e branco, tipografia condensada para títulos e navegação funcional direta. A experiência deve transmitir cuidado, segurança e curadoria sem linguagem clínica excessiva ou promessas médicas.

## Reference Points

- Landing page D’Accord já implementada.
- Header atual com aviso de login, acessibilidade, busca, logo centralizada e filtros rápidos.
- Guia de branding em `docs/BRANDING.md`.
- Mapa de 65 unidades funcionais em `docs/mvp/09_Mapa_de_Telas_do_MVP.docx`.

## Sprint 1 — Fundação e descoberta

| # | Name | Design Question | Winner | Tags |
|---|------|-----------------|--------|------|
| 001 | global-shell | Como organizar busca, filtros, conta e análise mantendo a logo centralizada? | C · Jornada guiada | shell, header, navigation, responsive |
| 002 | catalog-discovery | Como navegar e filtrar o catálogo sem sobrecarregar a interface? | B · Curadoria visível | catalog, search, filters |
| 003 | product-detail | Como equilibrar compra, compatibilidade e explicação no detalhe do produto? | D · Síntese B mais leve | pdp, commerce, recommendation |

## Sprint 1 — Decisions

- **Shell:** jornada guiada, com análise de pele como entrada principal, catálogo como alternativa e logo centralizada em todos os breakpoints.
- **Catálogo:** curadoria visível, com filtros persistentes no desktop e painel dedicado no celular.
- **Produto:** compatibilidade explicada com hierarquia mais leve, poucos contornos e cantos discretos somente no universo do produto.
- **Geometria:** a interface global permanece ortogonal; o arredondamento de 4 a 10 px é uma exceção funcional para imagens, controles e painéis de produto.
- **Próximo sprint:** institucional, acessibilidade, consentimento de cookies e autenticação.

## Sprint 2 — Confiança, consentimento e acesso

| # | Name | Design Question | Winner | Tags |
|---|------|-----------------|--------|------|
| 004 | institutional-system | Como manter leitura confortável, navegação interna e identidade editorial em páginas longas? | D · Síntese C mais leve | institutional, legal, accessibility, content |
| 005 | help-contact | Como encaminhar cada dúvida sem transformar contato em um formulário genérico? | C · Central híbrida | help, faq, contact, support |
| 006 | cookie-consent | Como obter consentimento granular sem bloquear a landing ou induzir escolhas? | pendente | cookies, consent, lgpd, privacy |
| 007 | authentication | Como criar uma jornada de acesso confiável, curta e fácil de recuperar? | pendente | login, signup, verification, recovery |
