#!/bin/bash

# Exit on error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Print colored message
print_message() {
  local color=$1
  local message=$2
  echo -e "${color}${message}${NC}"
}

# Check if git is installed
if ! command -v git &> /dev/null; then
  print_message "$RED" "Error: Git is not installed. Please install Git first."
  exit 1
fi

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
  print_message "$YELLOW" "Warning: GitHub CLI (gh) is not installed. Some automated setup will be skipped."
  has_gh=false
else
  has_gh=true
  # Check if authenticated
  if ! gh auth status &> /dev/null; then
    print_message "$YELLOW" "GitHub CLI is not authenticated. Please run 'gh auth login' first."
    has_gh=false
  fi
fi

# Initialize git repository if not already a git repo
if [ ! -d .git ]; then
  print_message "$GREEN" "Initializing git repository..."
  git init
  git add .
  git commit -m "Initial commit"
  git branch -M main
else
  print_message "$YELLOW" "Git repository already initialized."
fi

# Ask for GitHub repository information
read -p "Enter your GitHub username: " github_username
read -p "Enter repository name [nft-minter-monorepo]: " repo_name
repo_name=${repo_name:-nft-minter-monorepo}
read -p "Make repository private? (y/n) [n]: " private_repo
private_repo=${private_repo:-n}

if [ "$private_repo" = "y" ] || [ "$private_repo" = "Y" ]; then
  is_private=true
else
  is_private=false
fi

# Create GitHub repository
if [ "$has_gh" = true ]; then
  print_message "$GREEN" "Creating GitHub repository: $github_username/$repo_name (private: $is_private)..."
  if [ "$is_private" = true ]; then
    gh repo create "$github_username/$repo_name" --private --source=. --push
  else
    gh repo create "$github_username/$repo_name" --public --source=. --push
  fi
else
  print_message "$YELLOW" "Please create a GitHub repository manually at https://github.com/new"
  print_message "$YELLOW" "Repository name: $repo_name"
  print_message "$YELLOW" "Private: $is_private"
  print_message "$YELLOW" "Then run the following commands:"
  print_message "$YELLOW" "git remote add origin https://github.com/$github_username/$repo_name.git"
  print_message "$YELLOW" "git push -u origin main"
  
  read -p "Press Enter when you have created the repository and added it as a remote..."
  
  # Add remote
  git remote add origin "https://github.com/$github_username/$repo_name.git"
  git push -u origin main
fi

print_message "$GREEN" "GitHub repository setup complete!"

# Set up Turborepo remote caching if GitHub CLI is available
if [ "$has_gh" = true ]; then
  print_message "$GREEN" "Setting up Turborepo remote caching..."
  print_message "$YELLOW" "You'll need to create a Vercel account and link your GitHub repository to use Turborepo remote caching."
  print_message "$YELLOW" "Visit https://vercel.com/ to sign up."
  
  read -p "Do you want to setup Turborepo remote caching tokens now? (y/n) [n]: " setup_turbo
  setup_turbo=${setup_turbo:-n}
  
  if [ "$setup_turbo" = "y" ] || [ "$setup_turbo" = "Y" ]; then
    read -p "Enter your Turborepo token from Vercel: " turbo_token
    read -p "Enter your Turborepo team name (usually your username): " turbo_team
    
    # Set up GitHub Actions secrets
    gh secret set TURBO_TOKEN -b "$turbo_token"
    gh variable set TURBO_TEAM -b "$turbo_team"
    
    print_message "$GREEN" "Turborepo remote caching configured!"
  else
    print_message "$YELLOW" "Skipping Turborepo remote caching setup."
  fi
fi

print_message "$GREEN" "Setup completed successfully!"
print_message "$GREEN" "Your NFT Minter Monorepo is ready to use."
print_message "$GREEN" "Next steps:"
print_message "$GREEN" "  - Update deployment configurations in .github/workflows/ to match your hosting providers"
print_message "$GREEN" "  - Add GitHub secrets for deployments (NEXT_PUBLIC_API_URL, DATABASE_URL, etc.)"
print_message "$GREEN" "  - Customize Docker configurations if needed"
print_message "$GREEN" "  - Start developing your NFT minting application" 