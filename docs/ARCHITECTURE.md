# Arquitetura BorracharIA - Monorepo, Backend e Infraestrutura

## 1. Visão Geral

A **BorracharIA** é um marketplace emergencial e sob demanda conectando motoristas com problemas de pneus a borracheiros e profissionais autônomos de socorro emergencial.

A arquitetura do sistema é desenhada como um **Monorepo** modular gerenciado pelo **Turborepo** e **pnpm**, garantindo isolamento de contexto, reaproveitamento de contratos de dados e orquestração de builds eficiente.

## 2. Estrutura de Diretórios

```
borracharia/
├── apps/
│   ├── core-api/           # Backend REST API (Fastify, Zod, Asaas Mock, PostGIS)
│   ├── customer-pwa/       # Aplicação PWA para Clientes / Motoristas
│   ├── provider-pwa/       # Aplicação PWA para Prestadores de Serviço (Borracheiros)
│   └── admin-dashboard/    # Painel administrativo de auditoria e moderação
├── packages/
│   ├── database/           # Camada de dados centralizada (Prisma ORM, schema, migrations)
│   ├── typescript-config/  # Configurações TypeScript compartilhadas
│   └── eslint-config/      # Padronização de linting e boas práticas
├── docs/                   # Documentação arquitetural e dicionário de dados
├── docker/                 # Scripts de inicialização do contêiner Docker
├── docker-compose.yml      # Provisionamento local do PostgreSQL com PostGIS
├── turbo.json              # Configuração de pipelines do Turborepo
├── pnpm-workspace.yaml     # Declaração dos pacotes do monorepo
└── package.json            # Scripts de orquestração da raiz
```

## 3. Topologia de Aplicações

- **Core API (`apps/core-api`)**: Serviço backend construído com **Fastify**, **TypeScript** e **Zod**. Responsável pelo gerenciamento do ciclo de vida dos chamados (`ServiceRequest`), recepção de lances dinâmicos (`Proposal`), busca geoespacial por proximidade e integração com gateway de pagamento Asaas (modelo Uber de pré-autorização/retenção). Porta padrão: `3001`.
- **Customer PWA (`apps/customer-pwa`)**: Focado em fluxo ultrarrápido de solicitação de socorro, geolocalização em tempo real e checkout via Pix/Cartão.
- **Provider PWA (`apps/provider-pwa`)**: Focado no fluxo de aceitação de chamados, navegação por rota, onboarding documental estrito (CNH, fotos de ferramentas, vídeo de validação) e gestão de recebíveis (Asaas).
- **Admin Dashboard (`apps/admin-dashboard`)**: Moderação de prestadores cadastrados (aprovação/rejeição documental), métricas operacionais e resolução de disputas.

## 4. Endpoints da Core API

### 4.1. Chamados de Emergência

- `POST /requests`: Criação de novo chamado com status inicial `CREATED`.
- `GET /requests/nearby`: Consulta geoespacial de chamados em aberto por raio de coordenadas (`latitude`, `longitude`, `radius_km`) utilizando PostGIS `ST_DistanceSphere` (com fallback de alta precisão via fórmula de Haversine).
- `GET /requests/:id`: Consulta detalhada do chamado e seus relacionamentos.

### 4.2. Lances e Propostas Dinâmicas

- `POST /requests/:id/proposals`: Envio de lance por prestador com preço proposto e tempo estimado de chegada. Rejeita automaticamente chamados cancelados ou com prestador já atribuído.
- `GET /requests/:id/proposals`: Listagem ordenada por preço e tempo dos lances recebidos para o chamado.

### 4.3. Aceite de Proposta e Pré-Autorização (Modelo Uber)

- `POST /requests/:id/proposals/:proposalId/accept`: O cliente aceita o lance escolhido. O backend aciona o gateway Asaas para realizar a pré-autorização/retenção no cartão ou geração de Pix. Em transação atômica no banco:
  1. Proposta aceita passa para `ACCEPTED`.
  2. Demais propostas ativas passam para `REJECTED`.
  3. Chamado passa para `PROVIDER_ASSIGNED`.
