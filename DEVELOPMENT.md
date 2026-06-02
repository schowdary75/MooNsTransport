# Moon Development Setup

## Prerequisites

- Node.js 18+ ([download](https://nodejs.org/))
- npm 9+ (comes with Node.js)
- Docker & Docker Compose (for MySQL and Redis)
- Git

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

This installs dependencies for all workspaces (root, apps, packages, services).

### 2. Set Up Local Database & Redis

```bash
docker-compose up -d
```

This starts:
- **MySQL** on `localhost:3306`
  - Database: `Moon`
  - User: `Moon` / Password: `Moon123`
- **Redis** on `localhost:6379`
- **Adminer** (MySQL GUI) on `localhost:8080`

Check status:
```bash
docker-compose ps
```

Stop services:
```bash
docker-compose down
```

### 3. Configure Environment Variables

Create `.env.local` in `apps/web/`:

```bash
cp apps/web/.env.example apps/web/.env.local
```

Then fill in the required variables. For local development, you can use placeholder values for most services.

### 4. Set Up Prisma Database

```bash
npm run db:migrate
npm run db:seed
```

This creates the database schema and populates seed data.

View database in Prisma Studio:
```bash
npm run db:studio
```

Opens at `http://localhost:5555`

## Development

### Start All Services

```bash
npm run dev
```

This starts:
- **Web app** on `http://localhost:3000`
- **All packages** in watch mode

### Individual Service Commands

#### Web App
```bash
npm run dev --workspace=@moon/web
npm run build --workspace=@moon/web
npm run lint --workspace=@moon/web
```

#### Database
```bash
npm run db:migrate --workspace=@moon/db
npm run db:seed --workspace=@moon/db
npm run db:studio --workspace=@moon/db
```

#### All Packages
```bash
npm run typecheck       # Type check all packages
npm run lint            # Lint all packages
npm run test            # Run all tests
npm run format          # Format all files
```

## Project Structure

```
moon/
├── apps/
│   ├── web/                 # Next.js 14 web app (PORT 3000)
│   ├── android/             # Kotlin Android app (TBD)
│   └── ios/                 # Swift iOS app (TBD)
├── packages/
│   ├── db/                  # Prisma schema
│   ├── api/                 # Shared API types
│   ├── ui/                  # Shared UI components
│   ├── config/              # ESLint, TypeScript, Tailwind
│   └── utils/               # Utility functions
├── services/
│   ├── routing/             # OpenTripPlanner wrapper
│   ├── tracking/            # WebSocket tracking server
│   ├── notifications/       # FCM/Email service
│   └── gtfs-sync/           # GTFS data sync
└── .github/
    └── workflows/           # CI/CD pipelines
```

## Available Scripts

### Root Level
```bash
npm run dev              # Start all services in dev mode
npm run build            # Build all packages
npm run lint             # Lint everything
npm run typecheck        # TypeScript check
npm run test             # Run all tests
npm run format           # Format code with Prettier
npm run format:check     # Check formatting
npm run clean            # Delete node_modules and build files
```

### Database
```bash
npm run db:migrate       # Create new Prisma migration
npm run db:migrate:deploy # Deploy migrations (production)
npm run db:seed          # Run seed script
npm run db:studio        # Open Prisma Studio GUI
```

## Common Tasks

### Add a New Dependency

```bash
# To root
npm install package-name

# To a specific workspace
npm install package-name --workspace=@moon/web
npm install --save-dev dev-package --workspace=@moon/web
```

### Create a New Page (Web)

Create file: `apps/web/app/your-page/page.tsx`

```tsx
export default function YourPage() {
  return <div>Your content here</div>;
}
```

### Create a New Utility

Create file: `packages/utils/src/your-utility.ts`

```ts
export function yourFunction() {
  // implementation
}
```

Export from `packages/utils/src/index.ts`:
```ts
export { yourFunction } from './your-utility';
```

Use in web app:
```tsx
import { yourFunction } from '@moon/utils';
```

### Run Linter with Auto-fix

```bash
npm run lint:fix --workspace=@moon/web
```

## Debugging

### Enable Verbose Logging

```bash
DEBUG=* npm run dev
```

### Prisma Debug Mode

```bash
NODE_ENV=development npm run dev -- --debug
```

### Check Database Queries

Open Prisma Studio and look at the query logs in your terminal.

## Testing

### Run Tests

```bash
npm run test                    # All tests
npm run test --workspace=@moon/web  # Web only
npm run test:watch              # Watch mode
```

### Run Specific Test File

```bash
npm test -- --testPathPattern=auth
```

## Troubleshooting

### Port Already in Use

If `localhost:3000` is busy:
```bash
# Find what's using port 3000 (macOS/Linux)
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Database Connection Issues

1. Check Docker is running:
   ```bash
   docker ps
   ```

2. Check MySQL is accessible:
   ```bash
   docker-compose logs mysql
   ```

3. Reset database:
   ```bash
   docker-compose down -v
   docker-compose up -d
   npm run db:migrate
   npm run db:seed
   ```

### Dependencies Not Installing

```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
npm run typecheck
```

## Performance Tips

- Use `npm run dev` for all services (faster than starting individually)
- Use `npm run test:watch` during development
- Use Turbo's caching by avoiding `rm -rf node_modules`

## First Steps After Setup

1. ✅ Run `npm install`
2. ✅ Run `docker-compose up -d`
3. ✅ Run `npm run db:migrate && npm run db:seed`
4. ✅ Run `npm run dev`
5. ✅ Open `http://localhost:3000`
6. ✅ See the Moon homepage!

## Next Modules

- **Module 1.2**: Complete Prisma schema with all models
- **Module 1.3**: Clerk authentication setup
- **Module 1.4**: Leaflet map component
- **Module 1.5**: OpenTripPlanner integration

See [PROGRESS.md](../PROGRESS.md) for current status.

---

**Need help?** Check the main documentation: [IndiaTransitApp_Documentation.md](../IndiaTransitApp_Documentation.md)
