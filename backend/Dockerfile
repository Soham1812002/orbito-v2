# ─────────────────────────────────────────────────────────────
# Stage 1 — deps: Install production-only node_modules
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

# ─────────────────────────────────────────────────────────────
# Stage 2 — builder: Compile TypeScript → dist/
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src/ ./src/

RUN npm run build

# ─────────────────────────────────────────────────────────────
# Stage 3 — runner: Lean production image
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Create uploads and logs directories, and give ownership to the non-root "node" user
RUN mkdir -p /app/uploads /app/logs && chown -R node:node /app

# Copy runtime files with node user ownership
COPY --chown=node:node --from=deps /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node package.json ./

# Run as the built-in non-root "node" user
USER node

EXPOSE 9000

CMD ["node", "dist/server.js"]
