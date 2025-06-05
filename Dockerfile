# Use Node with dependencies Puppeteer needs
FROM node:20-slim

# Avoid prompts during apt install
ENV DEBIAN_FRONTEND=noninteractive

# Install Chromium dependencies
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends \
 && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Install Chromium via Puppeteer
RUN npx puppeteer browsers install chrome

# Expose port (change if your app uses a different port)
EXPOSE 3000

# Start your app
CMD ["npm", "start"]

