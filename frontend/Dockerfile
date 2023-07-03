# First stage: build the Next.js application
FROM node:16-alpine3.15 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json, yarn.lock, and next.config.js
COPY package.json yarn.lock next.config.js ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the application source code
COPY . .

# Build the Next.js application
RUN yarn build

# Second stage: create the runtime image
FROM node:16-alpine3.15

# Set the working directory
WORKDIR /app

# Copy the built application and production dependencies from the builder stage
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/public /app/public
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/next.config.js /app/next.config.js

# Expose the specified port
EXPOSE 3000

# Start the Next.js application
CMD ["yarn", "start"]
