# Arquitetura BorracharIA - Monorepo & Infraestrutura

## 1. Visão Geral

A **BorracharIA** é um marketplace emergencial e sob demanda conectando motoristas com problemas de pneus a borracheiros e profissionais autônomos de socorro emergencial.

A arquitetura do sistema é desenhada como um **Monorepo** modular gerenciado pelo **Turborepo** e **pnpm**, garantindo isolamento de contexto, reaproveitamento de contratos de dados e orquestração de builds eficiente.

## 2. Estrutura de Diretórios

```
borracharia/
├── apps/
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

- **Customer PWA**: Focado em fluxo ultrarrápido de solicitação de socorro, geolocalização em tempo real e checkout via Pix/Cartão.
- **Provider PWA**: Focado no fluxo de aceitação de chamados, navegação por rota, onboarding documental estrito (CNH, fotos de ferramentas, vídeo de validação) e gestão de recebíveis (Asaas).
- **Admin Dashboard**: Moderação de prestadores cadastrados (aprovação/rejeição documental), métricas operacionais e resolução de disputas.
