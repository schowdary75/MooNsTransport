# ═══════════════════════════════════════════════════════════════
# Moon Web App - Production Dockerfile (Monorepo Context)
# ═══════════════════════════════════════════════════════════════

# Stage 1: Dependencies
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy root lockfiles and package jsons
COPY package.json package-lock.json* ./
COPY apps/web/package.json ./apps/web/package.json
COPY packages/config/package.json ./packages/config/package.json
COPY packages/db/package.json ./packages/db/package.json
COPY packages/utils/package.json ./packages/utils/package.json
COPY packages/ui/package.json ./packages/ui/package.json
COPY packages/api/package.json ./packages/api/package.json

# Install all workspace dependencies
RUN npm ci

# Stage 2: Builder
FROM node:18-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npm run generate --workspace=@moon/db

# Build the application
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_dummy"
ENV CLERK_SECRET_KEY="sk_live_dummy"
ENV DATABASE_URL="mysql://root:root@localhost/dummy"
ENV NEXT_PUBLIC_OTP_API_URL="http://localhost:8080"
RUN npm run build --workspace=@moon/web

# Stage 3: Production Runtime
FROM node:18-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy necessary files from builder
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/packages ./packages

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the web app using the workspace run script
CMD ["npm", "start", "--workspace=@moon/web"]
