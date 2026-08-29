# Arquitetura

## Rotas públicas

- `/` — landing page implementada a partir do Figma.
- `/analise` — entrada futura para análise por foto.
- `/questionario` — questionário futuro de perfil e restrições.
- `/recomendacoes` — curadoria futura de produtos e rotina.
- `/produtos`, `/sobre`, `/privacidade`, `/contato` — páginas institucionais preparadas.

## APIs

- `GET /api/health` — verificação simples de disponibilidade.
- `GET|POST /api/help` — informa a disponibilidade do assistente e responde dúvidas de uso da experiência.
- `POST /api/analysis` — contrato inicial da análise; retorna `501` até a integração de visão computacional ser conectada.
- `GET /api/recommendations` — contrato inicial da curadoria; retorna `501` até o motor de recomendações ser conectado.

## Organização

- `src/app` contém páginas, metadata, sitemap, manifest e APIs.
- `src/components/landing` contém a composição visual principal.
- `src/components/ui` contém elementos compartilhados e placeholders das telas futuras.
- `src/lib` centraliza configuração do site e o conteúdo de orientação do assistente.
- `public/images` mantém os assets originais exportados do Figma.
