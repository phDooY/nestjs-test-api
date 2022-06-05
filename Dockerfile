FROM node:16-alpine AS builder
WORKDIR "/app"
COPY . .
RUN npm ci
RUN npm run build
# RUN npx mikro-orm migration:fresh
RUN npm prune --production
FROM node:16-alpine AS production
WORKDIR "/app"
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/test.db ./test.db
CMD [ "sh", "-c", "npm run start:prod"]