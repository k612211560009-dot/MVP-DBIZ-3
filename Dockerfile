# Multi-stage Dockerfile for Full-Stack Deployment
# This builds both frontend and backend

# ============================================
# Stage 1: Build Frontend
# ============================================
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install ALL dependencies (including devDependencies for Vite build)
RUN npm install

# Copy frontend source
COPY frontend/ ./

# Set build environment variables
ENV NODE_ENV=production
ENV VITE_BACKEND_URL=/api

# Build frontend for production with increased memory
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

# ============================================
# Stage 2: Backend with Static Frontend
# ============================================
FROM node:18-alpine

WORKDIR /app

# Install production dependencies for backend
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Copy backend source
COPY backend/ ./

# Copy built frontend to backend's public directory
COPY --from=frontend-builder /app/frontend/dist ./public

# Expose backend port
EXPOSE 5000

# Environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start backend server
CMD ["node", "src/app.js"]
