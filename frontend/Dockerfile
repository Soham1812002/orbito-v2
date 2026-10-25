# ─────────────────────────────────────────────────────────────
# Stage 1 — builder: Install deps and build the Vite SPA
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY index.html tsconfig.json tsconfig.node.json vite.config.ts ./
COPY public/ ./public/
COPY src/ ./src/

# Build-time ARGs — baked into the SPA bundle by Vite
ARG VITE_API_BASE_URL=/auth/v1/api
ARG VITE_API_GXP_BASE_URL=/gxp/v1/api
ARG VITE_API_LIMS_BASE_URL=/lims/v1/api

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_API_GXP_BASE_URL=$VITE_API_GXP_BASE_URL
ENV VITE_API_LIMS_BASE_URL=$VITE_API_LIMS_BASE_URL

RUN npm run build

# ─────────────────────────────────────────────────────────────
# Stage 2 — runner: Serve static files via Nginx
# ─────────────────────────────────────────────────────────────
FROM nginx:alpine-slim AS runner

# Remove default Nginx config and replace with our custom one
RUN rm /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/app.conf /etc/nginx/conf.d/app.conf

EXPOSE 80 4173

CMD ["nginx", "-g", "daemon off;"]
