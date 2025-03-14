# Setting Up a Local Turborepo Cache Server

This document explains how to set up a local Turborepo cache server on your Ubuntu server to speed up builds with caching.

## Prerequisites

- Ubuntu server with Docker and Docker Compose installed
- Network access to the server on port 3072 (or your chosen port)

## Step 1: Create a Directory for the Cache Server

```bash
mkdir -p ~/turbo-cache-server
cd ~/turbo-cache-server
```

## Step 2: Create a Docker Compose File

Create a file named `docker-compose.yml` with the following content:

```yaml
version: '3'

services:
  turbo-cache:
    image: ducktors/turborepo-remote-cache:latest
    container_name: turborepo-cache
    restart: always
    ports:
      - "3072:3000"
    environment:
      - TURBO_TOKEN=your-secret-token # Replace with your own secure token
      - STORAGE_PROVIDER=local
      - STORAGE_PATH=/app/data
    volumes:
      - ./data:/app/data

volumes:
  data:
    driver: local
```

Make sure to replace `your-secret-token` with a secure token of your choice. You'll use this token to authenticate with the cache server.

## Step 3: Start the Cache Server

```bash
cd ~/turbo-cache-server
docker-compose up -d
```

## Step 4: Configure GitHub Actions to Use Your Local Cache Server

Update your `.github/workflows/turbo-cache.yml` file:

```yaml
name: Turborepo Remote Cache

on:
  push:
    branches: [development]
  pull_request:
    branches: [development]

jobs:
  cache-and-test:
    name: Build and Test with Remote Cache
    runs-on: ubuntu-latest
    env:
      TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
      TURBO_API: ${{ secrets.TURBO_API }} # This will be your server URL
      TURBO_TEAM: ""
      TURBO_REMOTE_ONLY: true

    steps:
      # Rest of the file remains the same
```

Add the following secrets to your GitHub repository:
- `TURBO_TOKEN`: The token you set in the docker-compose.yml file
- `TURBO_API`: `http://your-server-ip:3072` (replace with your actual server IP)

## Step 5: Configure Local Development to Use Your Cache Server

To use the local cache server for development, add a `.turbo/config.json` file to your project:

```json
{
  "teamId": "",
  "apiUrl": "http://your-server-ip:3072"
}
```

And set your token in your environment:

```bash
export TURBO_TOKEN=your-secret-token
```

Or run commands with the token:

```bash
TURBO_TOKEN=your-secret-token npm run build
```

## Maintenance

### View Cache Server Logs

```bash
cd ~/turbo-cache-server
docker-compose logs -f
```

### Reset the Cache

If you need to clear the cache:

```bash
cd ~/turbo-cache-server
docker-compose down
rm -rf data
docker-compose up -d
```

### Update the Cache Server

```bash
cd ~/turbo-cache-server
docker-compose pull
docker-compose up -d
``` 