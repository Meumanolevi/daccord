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
| 006 | cookie-consent | Como obter consentimento granular sem bloquear a landing ou induzir escolhas? | A · Banner progressivo | cookies, consent, lgpd, privacy |
| 007 | authentication | Como criar uma jornada de acesso confiável, curta e fácil de recuperar? | A · Entrada unificada | login, signup, verification, recovery |

## Sprint 2 — Decisions

- **Institucional:** hub modular com leitura progressiva, poucos contornos e referências visuais contextuais.
- **Ajuda:** central híbrida, combinando busca, atalhos por assunto e atendimento humano já contextualizado.
- **Consentimento:** banner progressivo com cookies opcionais desligados por padrão e ações equivalentes para aceitar ou recusar.
- **Autenticação:** entrada unificada por e-mail, adaptando login, cadastro, recuperação e verificação sem criar rotas concorrentes.
- **Confiança:** privacidade, acessibilidade e limites da tecnologia permanecem visíveis nos momentos de maior sensibilidade.
- **Próximo sprint:** onboarding e jornada completa de análise de pele.

## Sprint 3 — Jornada de análise de pele

| # | Name | Design Question | Winner | Tags |
|---|------|-----------------|--------|------|
| 008 | analysis-entry-consent | Como apresentar limites, elegibilidade e consentimento antes da análise sem criar medo ou sobrecarga? | A · Jornada transparente | onboarding, consent, safety, lgpd |
| 009 | skin-questionnaire | Como coletar contexto, alergias e restrições sem transformar o fluxo em anamnese clínica? | A · Passos por assunto | questionnaire, safety, progress |
| 010 | photo-capture | Como orientar captura, permissão, quality gate e retake com feedback acionável? | C · Captura assistida | camera, upload, quality-gate |
| 011 | analysis-result | Como explicar sinais, confiança, limites e rotina recomendada sem sugerir diagnóstico? | A · Resultado em camadas | result, explainability, routine |

## Sprint 3 — Decisions

- **Entrada e consentimento:** jornada transparente, com abertura visual e informação em camadas; método, duração, limites e elegibilidade aparecem antes dos consentimentos separados.
- **Questionário:** passos por assunto, com uma etapa temática por vez, progresso persistente, salvamento de sessão, revisão final e interrupção segura sem perder respostas.
- **Captura e validação:** assistência persistente ao lado da câmera, com checklist em tempo real, um motivo prioritário por retake e referência visual exclusiva da etapa.
- **Referências visuais:** cada etapa core deve priorizar um asset contextual próprio ou uma visualização funcional; evitar repetir os mesmos retratos editoriais entre landing, acesso, questionário, captura e resultado.
- **Resultado e recomendação:** leitura em camadas, começando por síntese visual e aprofundando sinais, confiança, limites, justificativas, alternativas e rotina sob demanda.
- **Sprint concluída:** a jornada core agora cobre entrada/consentimento, questionário, captura/quality gate e resultado/recomendação com estados críticos e responsividade.
- **Próximo sprint:** comércio e checkout — sacola, identificação, entrega, pagamento, revisão, confirmação e falhas recuperáveis.

## Sprint 4 — Comércio e checkout

| # | Name | Design Question | Winner | Tags |
|---|------|-----------------|--------|------|
| 012 | cart-and-favorites | Como reunir favoritos, mini-sacola e sacola completa sem esconder preço, estoque ou próximos passos? | **C — Pronta para checkout** | cart, mini-cart, favorites, stock |
| 013 | checkout-identity-delivery | Como identificar o comprador e coletar entrega com pouco atrito e validação clara? | **C — CEP primeiro** | checkout, identity, address, shipping |
| 014 | checkout-payment-review | Como coletar pagamento e revisar o pedido sem duplicidade ou surpresa financeira? | **A — Pagamento em foco** | payment, review, psp, security |
| 015 | order-confirmation-recovery | Como confirmar o pedido e recuperar pagamento pendente ou falho com segurança? | **B — Acompanhamento imediato** | confirmation, payment-failure, order |

## Sprint 4 — Decisions

- **Sacola e favoritos:** aprovada a variante C, com revisão compacta de itens, favoritos salvos, entrega estimada, cupom e total orientados ao início do checkout.
- **Identificação e entrega:** aprovada a variante C; cobertura e prazo são verificados pelo CEP antes da revelação progressiva do endereço, contato e frete.
- **Pagamento e revisão:** aprovada a variante A, com método e dados de pagamento em primeiro plano e revisão lateral persistente de contato, entrega, itens e total.
- **Confirmação e recuperação:** aprovada a variante B, com linha do tempo e acompanhamento em primeiro plano, preservando recibo, estados de pagamento e o mesmo identificador durante a recuperação.
- **Referências visuais:** o comércio usa silhuetas de embalagem e hierarquia de informação; fotografias ficam reservadas para quando agregarem contexto real.
- **Sprint concluída:** comércio e checkout agora cobre sacola, entrega, pagamento, revisão, confirmação e recuperação sem duplicidade.
- **Próximo sprint:** conta do cliente — dashboard, perfil, perfil de pele, análises, curadorias, pedidos, endereços e privacidade.

## Sprint 5 — Conta do cliente

| # | Name | Design Question | Winner | Tags |
|---|------|-----------------|--------|------|
| 016 | account-dashboard | Como reunir análise, rotina, pedidos e atalhos pessoais sem transformar a conta em um painel administrativo? | **A — Resumo editorial** | account, dashboard, skin-profile, routine, orders |
| 017 | profile-access-security | Como editar dados pessoais e gerenciar acesso sem misturar alterações comuns e ações sensíveis? | **B — Perfil em capítulos** | account, profile, security, sessions, verification |
| 018 | skin-profile | Como apresentar e atualizar um perfil de pele vivo, distinguindo respostas, análise e regras de segurança? | **B — Perfil versionado** | account, skin-profile, provenance, allergies, restrictions, history |

## Sprint 5 — Decisions

- **Dashboard:** aprovada a variante A; o perfil de pele abre a conta como síntese editorial, com rotina, pedido e atalhos pessoais em uma coluna complementar.
- **Perfil e segurança:** aprovada a variante B, com navegação lateral persistente e capítulos expansíveis que separam dados pessoais, e-mail, senha, sessões e privacidade por peso e consequência.
- **Perfil de pele:** aprovada a variante B; cada atualização cria uma versão auditável ligada às suas fontes e à curadoria correspondente, preservando versões anteriores para consulta e comparação.
- **Referências visuais:** priorizar mapas, progresso, rotina e objetos funcionais; fotografias só entram quando adicionarem contexto novo.
- **Próxima etapa:** detalhar a biblioteca de análises, seus estados, comparação segura e acesso aos resultados anteriores.
