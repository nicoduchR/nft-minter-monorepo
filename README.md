# NFT Minter Monorepo

A full-stack NFT Minting application built with Turborepo, NestJS, and NextJS.

## ⚠️ Important Note

This project requires Node.js v18.18.0 or higher. If you're using an older version, please upgrade before proceeding.

```bash
# Using nvm to install and use Node.js v18
nvm install 18
nvm use 18
```

## 📦 Project Structure

```
nft-minter-monorepo/
├── apps/
│   ├── frontend/         # NextJS Frontend
│   └── backend/          # NestJS Backend
├── packages/
│   └── shared/           # Shared types, utils, and constants
├── .github/              # GitHub Actions workflows
├── scripts/              # Utility scripts for development and deployment
├── turbo.json            # Turborepo configuration
└── package.json          # Root package.json with workspaces
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (recommended) or npm or yarn
- Git
- GitHub CLI (optional, for automated repository setup)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
# Using pnpm (recommended)
pnpm install

# OR using npm
npm install

# OR using yarn
yarn install
```

### GitHub Repository Setup

You can easily set up a GitHub repository with our automated script:

```bash
./scripts/setup-repo.sh
```

This script will:
1. Initialize a Git repository if not already initialized
2. Create a GitHub repository (using GitHub CLI if available)
3. Push the code to GitHub
4. Set up Turborepo remote caching (optional)

If GitHub CLI is not available, the script will guide you through manual setup.

### Development

Run the entire stack in development mode:

```bash
# Using pnpm
pnpm dev

# OR using npm
npm run dev

# OR using yarn
yarn dev
```

This will start:
- Frontend at http://localhost:3000
- Backend at http://localhost:3001

### Building

Build all applications and packages:

```bash
# Using pnpm
pnpm build

# OR using npm
npm run build

# OR using yarn
yarn build
```

## 📋 Available Scripts

- `dev`: Run all applications in development mode
- `build`: Build all applications and packages
- `start`: Start all applications in production mode
- `lint`: Lint all applications and packages
- `test`: Run tests for all applications and packages
- `clean`: Clean build outputs and node_modules

## 🔄 Shared Package

The `@nft-minter/shared` package contains shared code used by both frontend and backend:

- **Types**: Common TypeScript interfaces and types
- **Utils**: Shared utility functions
- **Constants**: Shared constants and configuration

## 🐳 Docker Support

This repository includes Docker configuration for development and deployment:

- `docker-compose.yml`: Sets up a development environment with PostgreSQL and Redis
- `apps/frontend/Dockerfile`: Configuration for building and running the frontend
- `apps/backend/Dockerfile`: Configuration for building and running the backend

To start the Docker development environment:

```bash
docker-compose up -d
```

## 🔄 CI/CD with GitHub Actions

This repository includes GitHub Actions workflows for CI/CD automation:

### Workflows

- **CI**: Runs on every push and pull request to verify the build, lint, and tests
- **Frontend Deploy**: Deploys the frontend when changes are pushed to the main branch
- **Backend Deploy**: Deploys the backend when changes are pushed to the main branch
- **Turborepo Remote Cache**: Optimizes builds using Turborepo's remote caching

### Setting Up GitHub Repository

1. Create a new repository on GitHub
2. Push this code to the repository:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/nft-minter-monorepo.git
git push -u origin main
```

### Setting Up Secrets

For CI/CD to work properly, add these secrets in your GitHub repository settings:

- `TURBO_TOKEN`: Token for Turborepo remote caching
- `NEXT_PUBLIC_API_URL`: URL of your backend API
- Deployment-specific secrets (depends on your hosting provider)

## 🛠️ Tech Stack

- **Monorepo Management**: [Turborepo](https://turbo.build/)
- **Frontend**: [Next.js](https://nextjs.org/) with React
- **Backend**: [NestJS](https://nestjs.com/)
- **Database**: PostgreSQL with TypeORM
- **Blockchain Integration**: ethers.js 