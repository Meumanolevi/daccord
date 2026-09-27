# D’Accord API

Backend Laravel 13 da D’Accord, com autenticação SPA via Sanctum, sessões persistidas, confirmação de e-mail, recuperação de senha, controle de acesso por papéis e catálogo com estoque por variação.

## Desenvolvimento

```powershell
Copy-Item .env.example .env
composer setup
php artisan serve --host=localhost --port=8000
```

O banco provisório é `database/database.sqlite`. O seeder cria os papéis `user` e `admin` e o catálogo inicial persistido, sem criar credenciais padrão. Produtos, variações, ingredientes, saldos e movimentações são recriados integralmente pelas migrations.

```powershell
php artisan admin:create admin@exemplo.com
php artisan test
vendor\bin\pint --test
```

A documentação completa de endpoints, ambiente, CSRF, e-mails e comandos está em [`../docs/AUTH_API.md`](../docs/AUTH_API.md).
