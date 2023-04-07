# First stage: build the Node.js application
FROM node:16-alpine3.15 AS builder

# Install Python and build tools
RUN apk add --no-cache --virtual .build-deps python3 make g++

# Set the working directory
WORKDIR /app

# Copy package.json, yarn.lock and tsconfig.json
COPY package.json yarn.lock tsconfig.json ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the application source code
COPY . .

# Build the TypeScript application
RUN yarn build

# Remove build tools
RUN apk del .build-deps

# Second stage: create the runtime image
FROM node:16-alpine3.15

# Install PM2
RUN npm install -g pm2

# Set the working directory
WORKDIR /app

# Copy the built application and production dependencies from the builder stage
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json

# Expose the specified port
EXPOSE 5000

# Set the entrypoint
CMD ["pm2-runtime", "start", "dist/index.js"]
