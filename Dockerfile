# Multi-stage build for optimized production image
FROM rust:1.75-slim as builder

# Install system dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy dependency files
COPY Cargo.toml Cargo.lock ./

# Copy source code
COPY src/ ./src/

# Build optimized release
RUN cargo build --release

# Production stage
FROM debian:bookworm-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create app user
RUN useradd -r -s /bin/false nftgen

# Create app directory
WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/target/release/generate ./generate

# Create output directory
RUN mkdir -p /app/output && chown nftgen:nftgen /app/output

# Switch to app user
USER nftgen

# Default command
CMD ["./generate", "--output-dir", "/app/output", "--count", "4444", "--size", "512", "--max-file-size", "5120"]
