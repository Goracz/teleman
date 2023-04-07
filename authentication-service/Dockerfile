# First stage: build the Rust application
FROM rust:1.59 AS builder

# Create a new empty shell project
RUN USER=root cargo new --bin authentication-service
WORKDIR /authentication-service

# Copy over your manifests
COPY ./Cargo.toml ./Cargo.toml
COPY ./Cargo.lock ./Cargo.lock

# Cache your dependencies
RUN cargo build --release
RUN rm src/*.rs

# Copy your source tree
COPY ./src ./src

# Build for release
RUN rm ./target/release/deps/authentication_service*
RUN cargo build --release

# Second stage: create the runtime image
FROM alpine:3.15

# Install necessary runtime dependencies
RUN apk add --no-cache \
    ca-certificates \
    libssl1.1 \
    tzdata

# Copy the binary from the builder stage
COPY --from=builder /authentication-service/target/release/authentication-service /usr/local/bin

# Expose the specified port
EXPOSE 8084

# Set the entrypoint
ENTRYPOINT ["authentication-service"]
