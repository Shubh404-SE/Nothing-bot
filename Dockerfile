# Optional: used by Fly.io / Koyeb / any Docker host
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build && npm prune --omit=dev

ENV NODE_ENV=production

# Discord bot — long-running WebSocket (no HTTP port required)
CMD ["node", "dist/src/index.js"]
