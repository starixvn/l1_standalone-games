FROM hub.lumigame.com/base/node:20.9.0-alpine-24h1.1 AS base
WORKDIR /app

FROM base AS builder
COPY package.json package-*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM base AS clean
COPY package.json package-*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
RUN npx mod-pruner prune --force && rm package-lock.json

FROM base AS app
COPY --from=clean /app .
USER node
EXPOSE 5000
CMD ["node", "dist/bin.js"]
