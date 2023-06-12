# Base image
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install --production

# Copy the entire project directory into the container
COPY . .

# Build TypeScript files
RUN yarn build

# Expose the port on which the Nest.js application will run (change if necessary)
EXPOSE 3000

# Start the Nest.js application
CMD ["node", "dist/main"]
