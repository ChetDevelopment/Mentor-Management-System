# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && \
    cp -R node_modules /tmp/node_modules && \
    npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production
RUN apk add --no-cache tini curl
WORKDIR /app

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /tmp/node_modules ./node_modules
COPY --from=build /app/package*.json ./

# Create upload directories with proper permissions
RUN mkdir -p uploads/avatars uploads/cvs && \
    chown -R appuser:appgroup uploads && \
    chmod 750 uploads

EXPOSE 3000

# Switch to non-root user
USER appuser

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/v1/health || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/main"]
