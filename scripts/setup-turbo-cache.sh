#!/bin/bash

# Script to set up a local Turborepo cache server
# Run this on your Ubuntu server

# Create directory for the Turborepo cache server
mkdir -p ~/turbo-cache-server
cd ~/turbo-cache-server

# Generate a random token if one isn't provided
if [ -z "$1" ]; then
  TOKEN=$(openssl rand -hex 16)
  echo "Generated random token: $TOKEN"
else
  TOKEN=$1
  echo "Using provided token: $TOKEN"
fi

# Create docker-compose.yml
cat > docker-compose.yml << EOL
version: '3'

services:
  turbo-cache:
    image: ghcr.io/vercel/turborepo-remote-cache:latest
    container_name: turborepo-cache
    restart: always
    ports:
      - "3072:3000"
    environment:
      - TURBO_TOKEN=$TOKEN
      - STORAGE_PROVIDER=local
      - STORAGE_PATH=/app/data
    volumes:
      - ./data:/app/data

volumes:
  data:
    driver: local
EOL

# Make data directory
mkdir -p data

# Start the cache server
echo "Starting Turborepo cache server..."
docker-compose up -d

# Get the server's IP address
SERVER_IP=$(hostname -I | awk '{print $1}')

echo ""
echo "===== Turborepo Cache Server Setup Complete ====="
echo "Server running at: http://$SERVER_IP:3072"
echo "TURBO_TOKEN: $TOKEN"
echo ""
echo "To configure GitHub Actions, add these secrets to your repository:"
echo "  TURBO_API: http://$SERVER_IP:3072"
echo "  TURBO_TOKEN: $TOKEN"
echo ""
echo "For local development, create .turbo/config.json in your project:"
echo '{
  "teamId": "",
  "apiUrl": "http://'"$SERVER_IP"':3072"
}'
echo ""
echo "And set this environment variable when running Turbo commands:"
echo "  export TURBO_TOKEN=$TOKEN"
echo "" 