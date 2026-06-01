# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package definition and locks
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies including devDependencies (needed for nest build)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client and build the NestJS application
RUN npx prisma generate
RUN npm run build

# Production runner stage
FROM node:22-alpine AS runner

WORKDIR /app

# Copy package configs
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built NestJS artifacts and generated Prisma client
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/main"]
