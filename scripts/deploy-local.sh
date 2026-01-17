#!/bin/bash
# deploy-local.sh - Local deployment helper for admin-app
# Usage: ./scripts/deploy-local.sh
# 
# This script builds and deploys the application locally for testing.
# It uses the same deployment process as CI/CD but with local environment variables.

set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the absolute path of this script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Load environment variables from .env file if it exists
ENV_FILE="${DIR}/.env"
if [ -f "$ENV_FILE" ]; then
  echo -e "${BLUE}Loading environment variables from .env file...${NC}"
  set -a
  source "$ENV_FILE"
  set +a
fi

# Set default environment variables if not already set
export TRAVIS_BUILD_DIR=${TRAVIS_BUILD_DIR:-${PWD}}
export GITHUB_WORKSPACE=${GITHUB_WORKSPACE:-${PWD}}
export BASE_HREF=${BASE_HREF:-"https://sitmun.github.io/admin-app/"}

# Validate required tools
echo -e "${BLUE}Validating required tools...${NC}"

if ! command -v ng >/dev/null 2>&1; then
  echo -e "${RED}ERROR: Angular CLI (ng) is not installed or not in PATH${NC}"
  echo "Please install it with: npm install -g @angular/cli"
  exit 1
fi

echo -e "${GREEN}✓ Angular CLI found${NC}"

# Validate required environment variables for deployment
if [ -z "${GITHUB_API_KEY:-}" ]; then
  echo -e "${YELLOW}WARNING: GITHUB_API_KEY not set. Deployment will be skipped.${NC}"
  echo "Set it in .env file or as environment variable to enable deployment."
fi

if [ -z "${USERNAME:-}" ]; then
  echo -e "${YELLOW}WARNING: USERNAME not set. Deployment will be skipped.${NC}"
  echo "Set it in .env file or as environment variable to enable deployment."
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}  Building Admin App${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

# Build the project
echo -e "${BLUE}Building with testdeployment configuration...${NC}"
if ng build --configuration=testdeployment --baseHref="${BASE_HREF}"; then
  echo -e "${GREEN}✓ Build completed successfully${NC}"
else
  echo -e "${RED}ERROR: Build failed${NC}"
  exit 1
fi

# Validate build artifacts
BUILD_DIR="${GITHUB_WORKSPACE}/dist/admin-app"
if [ ! -d "$BUILD_DIR" ]; then
  echo -e "${RED}ERROR: Build artifacts not found at $BUILD_DIR${NC}"
  exit 1
fi

if [ -z "$(ls -A "$BUILD_DIR" 2>/dev/null)" ]; then
  echo -e "${RED}ERROR: Build directory is empty${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Build artifacts validated${NC}"
echo ""

# Deploy if credentials are available
if [ -n "${GITHUB_API_KEY:-}" ] && [ -n "${USERNAME:-}" ]; then
  echo -e "${BLUE}═══════════════════════════════════════${NC}"
  echo -e "${BLUE}  Deploying to GitHub Pages${NC}"
  echo -e "${BLUE}═══════════════════════════════════════${NC}"
  echo ""
  
  # Source the deploy script (they're in the same directory now)
  source "$DIR/deploy.sh"
else
  echo -e "${YELLOW}Deployment skipped (missing credentials)${NC}"
  echo -e "${YELLOW}Build artifacts are available at: $BUILD_DIR${NC}"
fi
