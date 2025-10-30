# Use Node.js LTS as the base image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and lock file first for better caching
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies including dev dependencies for building
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

# Install PostgreSQL client for Prisma
RUN apk --no-cache add postgresql-client

# Set working directory
WORKDIR /app

# Copy package files and lock file
COPY package*.json ./
COPY prisma ./prisma/

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Copy Prisma client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Ensure the node_modules/.prisma/client directory exists
RUN mkdir -p /app/node_modules/.prisma/client && \
    if [ -d "/app/node_modules/.prisma/client/query_engine-linux-musl" ]; then \
        echo "Prisma client found"; \
    else \
        echo "Prisma client not found, generating..."; \
        npx prisma generate; \
    fi

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
