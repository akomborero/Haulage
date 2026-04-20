# Use the official Node.js 18 image
FROM node:18

# Create an app directory inside the container
WORKDIR /app

# Copy package files first to install dependencies (faster building)
COPY package*.json ./
RUN npm install

# Copy the rest of your source code
COPY . .

# Expose the port your server is running on
EXPOSE 5000

# Start the application
CMD ["node", "src/app.js"]