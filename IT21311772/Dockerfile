# Use official Node.js image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app code
COPY . .

# Expose the app port
EXPOSE 8002

# Start the app
CMD ["node", "Server.js"]
