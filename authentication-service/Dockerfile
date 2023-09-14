# First stage: build the Rust application
FROM rust:1.72.0 AS builder

# Create a new empty shell project
RUN USER=root cargo new --bin authentication-service
WORKDIR /authentication-service

# Copy over your manifests and source files
COPY ./Cargo.toml ./Cargo.toml
COPY ./Cargo.lock ./Cargo.lock

# Copy all your workspace members
COPY ./controller ./controller
COPY ./database ./database
COPY ./entity ./entity
COPY ./model ./model
COPY ./migration ./migration
COPY ./repository ./repository
COPY ./service ./service
COPY ./utility ./utility

# Copy your source tree
COPY ./src ./src

# Build for release
RUN cargo build --release

# Second stage: create the runtime image
FROM alpine:3.15

# Install necessary runtime dependencies
RUN apk add --no-cache \
    ca-certificates \
    libssl1.1 \
    tzdata

# Copy the binary from the builder stage
COPY --from=builder /authentication-service/target/release/teleman-authentication-service /usr/local/bin

# Expose the specified port
EXPOSE 8084

# Set the entrypoint
ENTRYPOINT ["teleman-authentication-service"]
