# Use official Node.js 18 LTS image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (to cache dependencies)
COPY package*.json ./

# Install dependencies but ignore host-installed SQLite3
RUN npm install --omit=dev

# Install SQLite3 again inside the container
RUN npm rebuild sqlite3 && npm install sqlite3

# Copy the rest of the application
COPY . .

# Ensure SQLite database directory exists
RUN mkdir -p /app/src/database


ENV DATABASE_PATH=/app/src/database/railway.db


EXPOSE 5000

CMD ["node", "server.js"]
