# Choose the right version as per your requirements
FROM node:16.14.0

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND yarn.lock are copied
COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

# Bundle app source
COPY . .

# Compile TypeScript to JavaScript
RUN yarn build

# Expose the port your app runs on
EXPOSE 3000

# The command to start your application
CMD [ "yarn", "start" ]
