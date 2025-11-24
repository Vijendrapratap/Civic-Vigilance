# Production-ready Dockerfile for Civic Vigilance
FROM node:18-alpine AS base

# Install dependencies required for native builds
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy application code
COPY . .

# Set environment to production
ENV NODE_ENV=production

# Expose Expo dev server port
EXPOSE 8081 19000 19001 19002

# Start the application
CMD ["npm", "start"]
