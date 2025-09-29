FROM node:20-bullseye
WORKDIR /app

# Install dependencies (uses package.json in repo)
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --production

# Copy app sources
COPY . .

# Default command is to run the DB connection test
CMD ["node", "scripts/testDbConnection.js"]
