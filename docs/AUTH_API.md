# Autenticação D’Accord

O backend fica em `backend/` e usa Laravel 13, Sanctum 4 e SQLite. O frontend Next.js usa a autenticação SPA do Sanctum: a sessão é armazenada no banco e o navegador recebe apenas cookies protegidos. Requisições mutáveis usam o cookie `XSRF-TOKEN` e o cabeçalho `X-XSRF-TOKEN`.

## Preparação

Requisitos de produção e de uma instalação nova:

- PHP 8.3 ou superior com `curl`, `fileinfo`, `intl`, `mbstring`, `openssl`, `pdo_sqlite`, `sqlite3` e `zip`;
- Composer 2;
- Node.js 20.9 ou superior para o frontend.

Neste workspace, PHP e Composer portáteis estão em `.tools/` e não são versionados. Os comandos equivalentes são:

```powershell
cd backend
Copy-Item .env.example .env
..\.tools\php\php.exe ..\.tools\composer.phar install
..\.tools\php\php.exe artisan key:generate
New-Item -ItemType File database\database.sqlite -Force
..\.tools\php\php.exe artisan migrate --seed
..\.tools\php\php.exe artisan serve --host=localhost --port=8000
```

Com PHP e Composer no `PATH`, substitua os executáveis portáteis por `composer` e `php`. O atalho `composer setup` instala dependências, cria o SQLite e executa migrations e seeders.

Em outro terminal:

```powershell
Copy-Item .env.example .env.local
npm ci
npm run dev
```

Frontend: `http://localhost:3000`. API: `http://localhost:8000`.

## Variáveis principais

| Variável | Finalidade |
| --- | --- |
| `APP_URL` | URL pública do Laravel, usada nas URLs assinadas |
| `FRONTEND_URL` | Origem aceita pelo CORS e destino dos links enviados por e-mail |
| `CORS_ALLOWED_ORIGINS` | Lista separada por vírgulas das origens aceitas pelo CORS; inclua também o endereço da rede local quando necessário |
| `DB_CONNECTION` | `sqlite` nesta etapa; pode ser alterado sem mudar models e controllers |
| `SESSION_DRIVER` | `database`, para sessões revogáveis no servidor |
| `SANCTUM_STATEFUL_DOMAINS` | Hosts do frontend autorizados a usar sessão Sanctum |
| `AUTH_EMAIL_VERIFICATION_EXPIRE` | Validade, em minutos, do link de confirmação |
| `MAIL_MAILER` | `log` no desenvolvimento; use `smtp` para um provedor real |
| `NEXT_PUBLIC_API_URL` | URL do Laravel exposta ao cliente Next.js |
| `BACKEND_INTERNAL_URL` | URL usada pelo proxy interno do Next.js para alcançar o Laravel |

Em produção, use HTTPS e configure `SESSION_SECURE_COOKIE=true`. Frontend e API devem compartilhar o mesmo domínio principal para o modo SPA do Sanctum.

## Endpoints

Todas as respostas usam `{ success, message, data }` em sucesso e `{ success, message, errors }` em erro.

| Método | Endpoint | Proteção | Finalidade |
| --- | --- | --- | --- |
| `GET` | `/api/v1/health` | pública | disponibilidade da API |
| `POST` | `/api/v1/auth/register` | CSRF + limite | cadastro como `user` |
| `POST` | `/api/v1/auth/login` | CSRF + 5 tentativas/minuto | iniciar sessão |
| `POST` | `/api/v1/auth/logout` | sessão + CSRF | encerrar e invalidar sessão |
| `GET` | `/api/v1/auth/me` | sessão | usuário autenticado e papel |
| `POST` | `/api/v1/auth/confirm-password` | sessão + limite | confirmar senha para ação sensível |
| `POST` | `/api/v1/auth/forgot-password` | CSRF + limite | solicitar link de recuperação |
| `POST` | `/api/v1/auth/reset-password` | CSRF + limite | redefinir senha com token |
| `GET` | `/api/v1/auth/email/verify/{id}/{hash}` | URL assinada + limite | confirmar e-mail |
| `POST` | `/api/v1/auth/email/verification-notification` | sessão + CSRF + limite | reenviar confirmação |
| `GET` | `/api/v1/admin/users` | admin verificado | listar usuários |
| `PATCH` | `/api/v1/admin/users/{id}/role` | admin verificado + senha confirmada | alterar papel |
| `GET` | `/api/v1/products` | pública | listar produtos publicados com preço e disponibilidade |
| `GET` | `/api/v1/products/{slug}` | pública | consultar um produto publicado |
| `GET` | `/api/v1/admin/products` | admin verificado | listar e filtrar o catálogo administrativo |
| `POST` | `/api/v1/admin/products` | admin verificado | cadastrar produto, composição, primeira variação e saldo |
| `GET` | `/api/v1/admin/products/{id}` | admin verificado | consultar o produto completo |
| `PATCH` | `/api/v1/admin/products/{id}` | admin verificado | atualizar identidade, publicação, composição e AI |
| `DELETE` | `/api/v1/admin/products/{id}` | admin verificado + senha confirmada | excluir logicamente um produto |
| `POST` | `/api/v1/admin/products/{id}/variants` | admin verificado | adicionar uma variação vendável |
| `PATCH` | `/api/v1/admin/products/{id}/variants/{variant}` | admin verificado | atualizar SKU, apresentação, preço e estado da variação |
| `DELETE` | `/api/v1/admin/products/{id}/variants/{variant}` | admin verificado + senha confirmada | excluir uma variação, preservando ao menos uma |
| `GET` | `/api/v1/admin/inventory` | admin verificado | listar e filtrar os saldos por variação |
| `GET` | `/api/v1/admin/inventory/{variant}` | admin verificado | consultar saldo e movimentações recentes |
| `PATCH` | `/api/v1/admin/inventory/{variant}` | admin verificado | ajustar saldo e limite com motivo auditável |

No navegador, o frontend encaminha `/backend/*` ao Laravel por meio do proxy interno do Next.js. Isso mantém os cookies na mesma origem e permite acessar o ambiente por `localhost`, `127.0.0.1` ou pelo endereço da rede local. Antes do primeiro `POST`, o frontend chama `GET /sanctum/csrf-cookie`. Erros `401` limpam o estado de autenticação; erros `419` renovam o cookie CSRF uma vez e repetem a solicitação.

## Papéis e primeiro administrador

O seeder cria apenas os papéis `user` e `admin`; não existe senha padrão. Cadastros públicos sempre recebem `user`. Para criar o primeiro administrador:

```powershell
..\.tools\php\php.exe artisan admin:create admin@exemplo.com
```

O comando pede nome e senha de forma interativa, oculta a senha e marca o e-mail como verificado. Alterações posteriores exigem administrador autenticado, e-mail verificado e confirmação recente da senha. A API impede que um administrador remova o próprio privilégio ou deixe o sistema sem administradores.

## E-mails em desenvolvimento

Com `MAIL_MAILER=log`, os e-mails completos são gravados em `backend/storage/logs/laravel.log`. Procure por `verificar-email` ou `redefinir-senha`, copie a URL e abra no navegador.

Para visualizar e-mails em uma caixa local, execute Mailpit e configure:

```env
MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_SCHEME=null
```

Em produção ainda será necessário contratar e configurar um provedor SMTP ou transacional, validar o domínio de envio e publicar SPF, DKIM e DMARC. Google e Apple também dependem de credenciais OAuth e não fazem parte desta etapa.

## Banco e validação

O arquivo SQLite local não é versionado. Para recriar toda a estrutura:

```powershell
..\.tools\php\php.exe artisan migrate:fresh --seed
```

Para trocar de banco, altere as variáveis `DB_*` e execute as mesmas migrations. Os relacionamentos usam chaves estrangeiras e o papel não pode ser excluído enquanto houver usuários associados.

Produtos possuem uma ou mais variações. SKU, preço e estado de venda pertencem à variação; cada variação possui exatamente um saldo. Alterações de quantidade são transacionais e criam uma movimentação com quantidade anterior, ajuste, quantidade resultante, motivo e administrador. O estoque agregado exibido para um produto é a soma de suas variações não excluídas.

Execute a validação completa com:

```powershell
..\.tools\php\php.exe vendor\bin\pint --test
..\.tools\php\php.exe artisan test
npm run lint
npm run typecheck
npm run build
```
