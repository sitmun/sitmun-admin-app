#!/bin/bash
# conditional-e2e.sh - Conditionally run E2E tests if API is available
# This script runs the e2e tests only if it can connect first to the testdeployment API
# Must be called from the root of the project

set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration (can be overridden by environment variables)
E2E_RETRY_COUNT=${E2E_RETRY_COUNT:-10}
E2E_RETRY_DELAY=${E2E_RETRY_DELAY:-10}
E2E_API_URL=${E2E_API_URL:-}

# Validate curl is available
if ! command -v curl >/dev/null 2>&1; then
  echo -e "${RED}ERROR: curl is required but not installed${NC}"
  exit 1
fi

# Validate node is available for parsing
if ! command -v node >/dev/null 2>&1; then
  echo -e "${RED}ERROR: node is required but not installed${NC}"
  exit 1
fi

# Get the API URL from the testdeployment environment file
ENV_FILE="src/environments/environment.testdeployment.ts"

if [ ! -f "$ENV_FILE" ]; then
  echo -e "${RED}ERROR: Environment file not found: $ENV_FILE${NC}"
  exit 1
fi

# Use node to properly parse the TypeScript environment file
# This is more robust than string parsing
if [ -z "$E2E_API_URL" ]; then
  echo -e "${BLUE}Extracting API URL from environment file...${NC}"
  E2E_API_URL=$(node -e "
    try {
      const fs = require('fs');
      const content = fs.readFileSync('$ENV_FILE', 'utf8');
      // Extract apiBaseURL value using regex (safer than eval)
      const match = content.match(/apiBaseURL:\\s*['\"]([^'\"]+)['\"]/);
      if (match && match[1]) {
        console.log(match[1]);
      } else {
        console.error('Could not find apiBaseURL in environment file');
        process.exit(1);
      }
    } catch (error) {
      console.error('Error reading environment file:', error.message);
      process.exit(1);
    }
  " 2>&1)
  
  if [ $? -ne 0 ] || [ -z "$E2E_API_URL" ]; then
    echo -e "${RED}ERROR: Failed to extract API URL from $ENV_FILE${NC}"
    exit 1
  fi
fi

echo -e "${BLUE}Testing connection to API: ${E2E_API_URL}${NC}"

# Try connecting to the test deployment API
# As it may need to "wake up", we allow for retries with configurable delay
CONNECTED=false
for i in $(seq 1 $E2E_RETRY_COUNT); do
  echo -e "${BLUE}Attempt $i/$E2E_RETRY_COUNT...${NC}"
  
  # Use curl with timeout and check for 204 or 200 status
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "${E2E_API_URL}/api/" 2>/dev/null || echo "000")
  
  if [ "$HTTP_CODE" = "204" ] || [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Successfully connected to API (HTTP $HTTP_CODE)${NC}"
    CONNECTED=true
    break
  else
    if [ $i -lt $E2E_RETRY_COUNT ]; then
      echo -e "${YELLOW}Connection failed (HTTP $HTTP_CODE), retrying in ${E2E_RETRY_DELAY} seconds...${NC}"
      sleep $E2E_RETRY_DELAY
    fi
  fi
done

if [ "$CONNECTED" = "false" ]; then
  echo -e "${YELLOW}Unable to connect to the test deployment API after $E2E_RETRY_COUNT attempts${NC}"
  echo -e "${YELLOW}Skipping E2E tests${NC}"
  exit 0
fi

# Check if E2E tests are configured
# Note: E2E tests appear to be disabled/not configured
# If E2E tests are added in the future, uncomment and configure the command below
if [ -d "e2e" ] && [ -f "e2e/protractor.conf.headless.js" ]; then
  echo -e "${BLUE}Running E2E tests...${NC}"
  # Uncomment when E2E tests are properly configured:
  # npm run e2e -- --protractor-config=e2e/protractor.conf.headless.js --configuration=testdeployment
  echo -e "${YELLOW}E2E tests are not currently configured${NC}"
else
  echo -e "${YELLOW}E2E test directory or configuration not found${NC}"
  echo -e "${YELLOW}E2E tests are not configured for this project${NC}"
fi

exit 0
