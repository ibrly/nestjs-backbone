# nestjs-backbone

A NestJS starter backbone with JWT authentication, a per-user task API, TypeORM on PostgreSQL, config validation and a Docker setup for development.

## Stack

- NestJS + TypeScript
- TypeORM with PostgreSQL
- Passport JWT authentication
- Joi config validation (`config.schema.ts`)
- Jest unit tests
- Docker Compose for local development

## Getting started

```bash
cp app.env.example app.env
cp db.env.example db.env
# edit the passwords and JWT_SECRET, keeping DB_* in app.env in sync with db.env

docker compose up --build
```

The API is served on `http://localhost:3000` and Postgres on port `5432`.

### Without Docker

```bash
npm install
npm run start:dev
```

Make sure a Postgres instance matches the values in `app.env`.

## Environment variables

| Variable | Description |
|----------|-------------|
| `STAGE` | Environment stage, e.g. `app` or `prod` |
| `DB_HOST` / `DB_PORT` | Postgres host and port |
| `DB_USERNAME` / `DB_PASSWORD` / `DB_DATABASE` | Postgres credentials |
| `JWT_SECRET` | Secret used to sign access tokens |

All variables are validated at startup by `config.schema.ts`.

## API

### Auth

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/auth/signup` | Create a user |
| `POST` | `/auth/signin` | Sign in and receive a JWT access token |

### Tasks (requires `Authorization: Bearer <token>`)

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/tasks` | List the current user's tasks, filterable by status and search |
| `GET` | `/tasks/:id` | Get a task by id |
| `POST` | `/tasks` | Create a task |
| `PATCH` | `/tasks/:id/status` | Update a task's status |
| `DELETE` | `/tasks/:id` | Delete a task |

## Scripts

```bash
npm run start:dev   # watch mode
npm run build       # compile to dist
npm run lint        # eslint with --fix
npm test            # unit tests
npm run test:cov    # coverage report
npm run test:e2e    # end-to-end tests
```

## License

MIT
