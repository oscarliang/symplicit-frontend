ARG DOCKER_SRC=docker.io

FROM ${DOCKER_SRC}/node:20.7.0-slim AS builder

WORKDIR /app

COPY .npmrc package.json package-lock.json ./
RUN \
  npm pkg delete scripts.prepare && \
  npm ci --only-production --no-audit --no-fund

COPY . .
RUN NEXT_TELEMETRY_DISABLED=1 npm run build

FROM ${DOCKER_SRC}/node:20.7.0-slim AS runner
WORKDIR /app

ENV \
  TZ=Australia/Sydney \
  NEXT_TELEMETRY_DISABLED=1 \
  NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/.npmrc ./
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public

# Set the correct permission for nextjs
RUN mkdir /nonexistent
RUN mkdir /nonexistent/.npm
RUN chown nextjs:nodejs /nonexistent
RUN chown nextjs:nodejs /nonexistent/.npm

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 4000

CMD ["npm", "run", "dev"]
