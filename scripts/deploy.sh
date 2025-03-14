#!/bin/bash

# Exit on error
set -e

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Deploy function
deploy() {
  local app=$1
  echo "Deploying $app..."

  case $app in
    "frontend")
      # Example: deploy to Vercel or your preferred frontend hosting
      echo "Deploying frontend to hosting platform..."
      # Uncomment and customize for your deployment platform
      # cd apps/frontend && vercel --prod
      ;;
    
    "backend")
      # Example: deploy to a server or cloud platform
      echo "Deploying backend to hosting platform..."
      # Uncomment and customize for your deployment platform
      # docker build -t nft-minter-backend -f apps/backend/Dockerfile .
      # docker tag nft-minter-backend:latest your-registry/nft-minter-backend:latest
      # docker push your-registry/nft-minter-backend:latest
      ;;
    
    *)
      echo "Unknown app: $app"
      exit 1
      ;;
  esac
}

# Main script
main() {
  # Get the app to deploy
  local app=${1:-all}

  # Build the shared package first
  echo "Building shared package..."
  npm run build --filter=@nft-minter/shared
  
  # Deploy based on the specified app
  if [ "$app" = "all" ]; then
    deploy "frontend"
    deploy "backend"
  else
    deploy "$app"
  fi

  echo "Deployment completed successfully!"
}

# Run the main function with the provided argument
main "$@" 