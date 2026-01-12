# Use Node.js 20 LTS
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port (Cloud Run sets PORT env var dynamically)
ENV PORT=8080
EXPOSE 8080

# Start the server
CMD ["node", "src/server.js"]
