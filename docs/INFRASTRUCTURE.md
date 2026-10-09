# Infraestrutura - BorracharIA

## 1. Banco de Dados Local com PostGIS

A BorracharIA exige recursos geoespaciais avançados (cálculo de distância euclidiana/esférica via `ST_DistanceSphere`, raio de busca de prestadores e cálculo de rotas emergenciais). Por essa razão, a imagem oficial utilizada é `postgis/postgis:16-3.4`.

### Arquivo docker-compose.yml

O arquivo na raiz provisiona:

- Contêiner: `borracharia-db`
- Porta exposta: `5432`
- Extensão PostGIS habilitada via script `/docker-entrypoint-initdb.d/init.sql`
- Variáveis de ambiente configuradas por padrão para desenvolvimento seguro (sem credenciais reais em produção).
- Healthcheck com `pg_isready` para garantir que os serviços dependentes aguardem a prontidão do banco.

## 2. Comandos Operacionais

### Subir infraestrutura Docker:

```bash
pnpm docker:up
# ou docker-compose up -d
```

### Verificar saúde do contêiner:

```bash
docker ps
docker-compose logs -f
```

### Rodar Migrations:

```bash
pnpm db:migrate
```

### Visualizar Dados (Prisma Studio):

```bash
pnpm --filter @borracharia/database db:studio
```

## 3. Gestão de Migrations

As migrações são geradas de forma declarativa e versionadas pelo Prisma ORM em `packages/database/prisma/migrations`.
Toda nova alteração no schema deve gerar um arquivo SQL versionado pelo comando:

```bash
pnpm --filter @borracharia/database prisma migrate dev --name <nome_da_migracao>
```
