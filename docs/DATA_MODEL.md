# Modelo de Dados - BorracharIA

## 1. Princípios Arquiteturais do Schema

- **Identificadores UUIDv4**: Nenhuma tabela utiliza inteiros auto-incrementados. Todas as chaves primárias são tipadas como `UUID` geradas via `gen_random_uuid()` para prevenir enumeração maliciosa de registros.
- **Separação Estrita de Perfis**: A entidade `User` atua como âncora de autenticação e identidade, enquanto `CustomerProfile` e `ProviderProfile` mantêm o isolamento de domínio 1:1.
- **Onboarding Resiliente de Prestadores**: URLs de documentos de validação (`cnh_url`, `tools_photo_url`, `validation_video_url`) são concebidas como `nullable`, permitindo que o prestador inicie o cadastro e complete o upload assíncrono durante sua jornada de credenciamento.
- **Prontidão de Integração Asaas**: O campo `asaas_wallet_id` em `ProviderProfile` prepara a liquidação de repasses e subcontas no gateway Asaas.
- **Especialização de Veículos N:M**: Relação de muitos para muitos entre `ProviderProfile` e `VehicleType` com chave primária UUID dedicada na tabela associativa `provider_vehicle_types`.

## 2. Diagrama Entidade-Relacionamento (ERD)

```mermaid
erDiagram
    users ||--o| customer_profiles : "1:1 possui"
    users ||--o| provider_profiles : "1:1 possui"
    provider_profiles ||--o{ provider_vehicle_types : "atende"
    vehicle_types ||--o{ provider_vehicle_types : "inclui"

    users {
        uuid id PK
        string email UK
        string phone UK
        user_role role
        timestamp created_at
        timestamp updated_at
    }

    customer_profiles {
        uuid id PK
        uuid user_id FK,UK
        timestamp created_at
        timestamp updated_at
    }

    provider_profiles {
        uuid id PK
        uuid user_id FK,UK
        string cnh_url
        string tools_photo_url
        string validation_video_url
        provider_status status
        string asaas_wallet_id
        timestamp created_at
        timestamp updated_at
    }

    vehicle_types {
        uuid id PK
        string name UK
        timestamp created_at
        timestamp updated_at
    }

    provider_vehicle_types {
        uuid id PK
        uuid provider_id FK
        uuid vehicle_type_id FK
        timestamp created_at
    }
```

## 3. Dicionário de Dados

### 3.1. users

| Campo        | Tipo        | Nulo | Padrão              | Descrição                                         |
| :----------- | :---------- | :--- | :------------------ | :------------------------------------------------ |
| `id`         | UUID        | Não  | `gen_random_uuid()` | Chave primária universal                          |
| `email`      | VARCHAR     | Não  | -                   | E-mail do usuário (único)                         |
| `phone`      | VARCHAR     | Não  | -                   | Telefone com DDD (único)                          |
| `role`       | `user_role` | Não  | `CUSTOMER`          | Perfil de acesso: `CUSTOMER`, `PROVIDER`, `ADMIN` |
| `created_at` | TIMESTAMP   | Não  | `now()`             | Data/hora de criação do registro                  |
| `updated_at` | TIMESTAMP   | Não  | -                   | Data/hora da última atualização                   |

### 3.2. customer_profiles

| Campo        | Tipo      | Nulo | Padrão              | Descrição                                   |
| :----------- | :-------- | :--- | :------------------ | :------------------------------------------ |
| `id`         | UUID      | Não  | `gen_random_uuid()` | Chave primária                              |
| `user_id`    | UUID      | Não  | -                   | FK para `users.id` (1:1, onDelete: CASCADE) |
| `created_at` | TIMESTAMP | Não  | `now()`             | Criação do perfil                           |
| `updated_at` | TIMESTAMP | Não  | -                   | Última atualização                          |

### 3.3. provider_profiles

| Campo                  | Tipo              | Nulo | Padrão              | Descrição                                           |
| :--------------------- | :---------------- | :--- | :------------------ | :-------------------------------------------------- |
| `id`                   | UUID              | Não  | `gen_random_uuid()` | Chave primária                                      |
| `user_id`              | UUID              | Não  | -                   | FK para `users.id` (1:1, onDelete: CASCADE)         |
| `cnh_url`              | TEXT              | Sim  | NULL                | URL do comprovante da CNH                           |
| `tools_photo_url`      | TEXT              | Sim  | NULL                | URL da foto do kit de ferramentas do borracheiro    |
| `validation_video_url` | TEXT              | Sim  | NULL                | URL do vídeo de validação técnica do prestador      |
| `status`               | `provider_status` | Não  | `PENDING_REVIEW`    | Status: `PENDING_REVIEW`, `APPROVED`, `REJECTED`    |
| `asaas_wallet_id`      | VARCHAR           | Sim  | NULL                | Identificador da subconta/carteira no gateway Asaas |
| `created_at`           | TIMESTAMP         | Não  | `now()`             | Criação do perfil de prestador                      |
| `updated_at`           | TIMESTAMP         | Não  | -                   | Última atualização                                  |

### 3.4. vehicle_types

| Campo        | Tipo      | Nulo | Padrão              | Descrição                                                 |
| :----------- | :-------- | :--- | :------------------ | :-------------------------------------------------------- |
| `id`         | UUID      | Não  | `gen_random_uuid()` | Chave primária                                            |
| `name`       | VARCHAR   | Não  | -                   | Nome da categoria (ex: Moto, Passeio, Caminhão, Agrícola) |
| `created_at` | TIMESTAMP | Não  | `now()`             | Criação                                                   |
| `updated_at` | TIMESTAMP | Não  | -                   | Atualização                                               |

### 3.5. provider_vehicle_types

| Campo             | Tipo      | Nulo | Padrão              | Descrição                                          |
| :---------------- | :-------- | :--- | :------------------ | :------------------------------------------------- |
| `id`              | UUID      | Não  | `gen_random_uuid()` | Chave primária                                     |
| `provider_id`     | UUID      | Não  | -                   | FK para `provider_profiles.id` (onDelete: CASCADE) |
| `vehicle_type_id` | UUID      | Não  | -                   | FK para `vehicle_types.id` (onDelete: CASCADE)     |
| `created_at`      | TIMESTAMP | Não  | `now()`             | Criação da associação                              |
