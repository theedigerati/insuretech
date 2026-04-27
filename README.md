# Insuretech

A mini insuretech REST API built with **NestJS**, **Sequelize-TypeScript**, and **PostgreSQL**. Users can browse insurance products, purchase plans using a wallet, and activate pending policies.

---

## Tech Stack

- **NestJS** — Node.js framework
- **Sequelize-TypeScript** — ORM
- **PostgreSQL** — Database
- **Jest** — Testing

---

## Prerequisites

- Node.js >= 18
- PostgreSQL running locally (or via Docker)
- pnpm

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/theedigerati/insuretech.git
cd insuretech
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Copy the example env file and update with your database credentials:

```bash
cp .env.example .env
```

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_NAME=insuretech
```

### 4. Create the database

```bash
createdb insuretech
```

Or via psql:

```sql
CREATE DATABASE mycovergenius;
```

### 5. Start the application (sync db)

```bash
# Development
pnpm start

```

### 5.seed the database

```bash

# Seed initial data (products, test users)
pnpm seed
```

The API will be available at `http://localhost:3000` and Swagger docs at `http://localhost:3000/api`.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/products` | List all products with category and price |
| `POST` | `/plans` | Purchase a plan (deducts from wallet) |
| `GET` | `/plans/` | Fetch all plans |
| `GET` | `/plans/:planId/pending-policies` | List pending policies under a plan |
| `GET` | `/policies` | List all activated policies (filter by `?plan=`) |
| `POST` | `/policies/activate` | Activate a pending policy |

---

## Running Tests

```bash
# Unit and integration tests
pnpm test

# Test coverage
pnpm test:cov
```

---


## Notes

- No authentication is implemented — users are seeded directly into the database.
- A user can only hold **one policy per product type** within a plan.
- Pending policies are soft-deleted upon activation.
- Policy numbers are randomly generated unique identifiers (nanoid).
