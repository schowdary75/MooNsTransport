# ═══════════════════════════════════════════════════════════════
# Moon Tracking Service - Production Dockerfile
# ═══════════════════════════════════════════════════════════════

FROM node:18-alpine AS builder

WORKDIR /app

# Copy root lockfiles and workspace package jsons
COPY package.json package-lock.json* ./
COPY services/tracking/package.json ./services/tracking/package.json
COPY packages/config/package.json ./packages/config/package.json

# Install dependencies
RUN npm ci

# Copy configurations and source code
COPY packages/config ./packages/config
COPY services/tracking ./services/tracking

# Build TypeScript to JavaScript
WORKDIR /app/services/tracking
RUN npm run build

# Production Stage
FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/services/tracking/package.json ./
COPY --from=builder /app/services/tracking/node_modules ./node_modules
COPY --from=builder /app/services/tracking/dist ./dist

EXPOSE 3001

ENV PORT 3001
ENV NODE_ENV production

CMD ["node", "dist/server.js"]
