# product-service/Dockerfile
# Use a multi-stage build process
# Stage 1: Build
FROM node:21.1-alpine3.18 AS build

# Install Dockerize
ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:21.1-alpine3.18
WORKDIR /usr/src/app
# Copy Dockerize from build stage
COPY --from=build /usr/local/bin/dockerize /usr/local/bin/dockerize

# Copy the built application and install production dependencies
COPY --from=build /usr/src/app/dist ./dist
COPY package*.json ./
RUN npm install --only=production

EXPOSE 3001

# Use Dockerize in CMD to wait for dependencies to be ready (example: waiting for MySQL)
CMD ["dockerize", "-wait", "tcp://mysql:3306", "-timeout", "1m", "node", "dist/index.js"]