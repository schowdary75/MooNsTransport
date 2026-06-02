# Moon Deployment Setup

This is a first-time deployment runbook for the Moon monorepo. Start here if no
production services are configured yet.

## 0. Important Secret Note

Never commit real database URLs, API keys, or webhook secrets. If a secret was
pasted into chat or committed anywhere, rotate it in the provider dashboard
before using it in production.

Use these files only as templates:

- `.env.example`
- `apps/web/.env.example`
- `apps/web/.env.production.example`

Real production values should live in Vercel, GitHub Actions secrets, Docker
host env files, or your cloud provider's secret manager.

## 1. Prove The App Works Locally

Install dependencies:

```bash
npm install
```

Start local MySQL, Redis, and Adminer:

```bash
docker compose up -d mysql redis adminer
```

The local database URL should be:

```bash
DATABASE_URL="mysql://moon:moon123@localhost:3307/moon"
```

Create schema and seed data:

```bash
npm run db:push --workspace=@moon/db
npm run db:seed --workspace=@moon/db
```

Run checks:

```bash
npm run typecheck
npm run build --workspace=@moon/web
```

Start the app:

```bash
npm run dev --workspace=@moon/web
```

Open `http://localhost:3000`.

## 2. Choose Your Deployment Path

Use Vercel if you only need the Next.js web app online quickly.

Use Docker on a VPS/cloud VM if you want to run the web app, MySQL, Redis,
routing service, and tracking service together from `docker-compose.prod.yml`.

Recommended first production setup:

- Web app: Vercel
- Database: managed MySQL/TiDB
- Redis: Upstash or managed Redis
- Routing/tracking services: deploy later with Docker or a separate service

## 3. Create Production Services

### Database

Create a managed MySQL-compatible database. TiDB Cloud, PlanetScale, AWS RDS,
DigitalOcean Managed MySQL, or Railway MySQL are all reasonable.

Save the production connection string as `DATABASE_URL`.

Example format:

```bash
mysql://USER:PASSWORD@HOST:PORT/DATABASE
```

If your provider requires TLS, use the exact Prisma-compatible connection
parameters from that provider's dashboard or docs. URL-encode special characters
in usernames and passwords.

### Redis

Create Redis with Upstash or another managed Redis provider.

Save:

```bash
REDIS_URL="redis://..."
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."
```

### Auth, Payments, Notifications, Monitoring

Create these only when you are ready to enable the related features:

- Clerk production app
- Razorpay live keys and webhook secret
- Firebase production project and service account
- Resend API key
- MSG91 API key
- Amadeus production credentials
- Sentry project

For an early smoke-test deployment, you can keep optional services as placeholder
values only if the app code path you test does not require them.

## 4. Prepare Production Environment Variables

Copy the keys from `apps/web/.env.production.example` into your deployment
provider. Do not copy placeholder values blindly.

Minimum production variables:

```bash
DATABASE_URL="mysql://..."
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NEXT_PUBLIC_API_URL="https://your-domain.com/api"
NODE_ENV="production"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_..."
CLERK_SECRET_KEY="sk_live_..."
REDIS_URL="redis://..."
NEXT_PUBLIC_OTP_API_URL="https://routing-api.your-domain.com"
SENTRY_ENABLED="false"
```

Set `SENTRY_ENABLED="true"` only after adding a real
`NEXT_PUBLIC_SENTRY_DSN`.

## 5. Initialize The Production Database

Do this once after `DATABASE_URL` points to the production database.

From PowerShell:

```powershell
$env:DATABASE_URL="mysql://..."
npm run db:push --workspace=@moon/db
npm run db:seed --workspace=@moon/db
```

From bash:

```bash
DATABASE_URL="mysql://..." npm run db:push --workspace=@moon/db
DATABASE_URL="mysql://..." npm run db:seed --workspace=@moon/db
```

Use `db:push` for this current repo because there is no committed Prisma
migrations folder yet. After the first stable production schema, prefer
migrations:

```bash
npm run db:migrate --workspace=@moon/db
npm run db:migrate:deploy --workspace=@moon/db
```

## 6. Deploy Web App To Vercel

Install and login:

```bash
npm install -g vercel
vercel login
```

From the repository root, link the project:

```bash
vercel link
```

In the Vercel dashboard, configure the project as a monorepo app:

- Framework preset: `Next.js`
- Root directory: `apps/web`
- Install command: `cd ../.. && npm ci`
- Build command: `cd ../.. && npm run build --workspace=@moon/web`
- Development command: `cd ../.. && npm run dev --workspace=@moon/web`

Add all production environment variables in:

```text
Vercel Project -> Settings -> Environment Variables
```

Deploy:

```bash
vercel --prod
```

After deployment, update:

```bash
NEXT_PUBLIC_APP_URL="https://your-vercel-domain-or-custom-domain"
NEXT_PUBLIC_API_URL="https://your-vercel-domain-or-custom-domain/api"
```

Redeploy after changing these values.

## 7. Configure Webhooks

Use the final deployed domain.

Clerk webhook endpoint:

```text
https://your-domain.com/api/webhooks/clerk
```

Razorpay webhook endpoint:

```text
https://your-domain.com/api/webhooks/razorpay
```

Put the webhook signing secrets into the deployment environment:

```bash
CLERK_WEBHOOK_SECRET="whsec_..."
RAZORPAY_WEBHOOK_SECRET="..."
```

## 8. Optional: Deploy Full Stack With Docker

Use this path for a VPS or cloud VM.

Create a production env file on the server:

```bash
cp .env.example .env.production
```

Fill production values in `.env.production`.

Build and start:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

Check status:

```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f web
```

If you use a managed external database, remove the `mysql` service dependency
from `docker-compose.prod.yml` or leave the local MySQL service unused.

## 9. GitHub Actions Secrets

If you want CI to deploy to Vercel from `.github/workflows/deploy.yml`, add:

```text
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

Add them in:

```text
GitHub -> Repository -> Settings -> Secrets and variables -> Actions
```

## 10. Production Checklist

- Local build passes.
- Production database is created.
- `DATABASE_URL` is set only as a secret.
- Production database schema is pushed or migrated.
- Seed data is loaded only if wanted.
- Vercel or Docker environment variables are complete.
- Clerk production keys are configured.
- Webhook URLs use the deployed domain.
- Optional services are either configured or disabled safely.
- Custom domain and HTTPS are active.
- A rollback path is known before launch.

## Useful Commands

Build web:

```bash
npm run build --workspace=@moon/web
```

Generate Prisma client:

```bash
npm run generate --workspace=@moon/db
```

Open Prisma Studio:

```bash
npm run db:studio --workspace=@moon/db
```

Check Docker logs:

```bash
docker compose -f docker-compose.prod.yml logs -f
```
