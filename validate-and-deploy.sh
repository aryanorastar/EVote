#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Validating CSS and preparing for deployment...${NC}"

# Stage 1: Build Tailwind CSS
echo -e "${BLUE}Building Tailwind CSS...${NC}"
npx tailwindcss -i ./src/evote_frontend/src/styles/tailwind.css -o ./src/evote_frontend/src/styles/output.css --minify

# Stage 2: Check for any common CSS issues
echo -e "${BLUE}Checking for common CSS issues...${NC}"

# List of Tailwind CSS directives that might cause issues
INVALID_CLASSES=(
  "text-decoration-none"
  "text-align-center"
  "font-italic"
)

FOUND_ISSUES=false

for CLASS in "${INVALID_CLASSES[@]}"; do
  if grep -r "@apply.*$CLASS" --include="*.css" ./src/evote_frontend/; then
    echo -e "${RED}Found invalid Tailwind class: $CLASS${NC}"
    FOUND_ISSUES=true
  fi
done

if [ "$FOUND_ISSUES" = true ]; then
  echo -e "${RED}Found CSS issues that need to be fixed. Please correct them before deploying.${NC}"
  exit 1
fi

# Stage 3: Try to build with webpack first to catch any errors
echo -e "${BLUE}Running webpack build to check for errors...${NC}"
npm run build

if [ $? -ne 0 ]; then
  echo -e "${RED}Webpack build failed. Please fix the errors and try again.${NC}"
  exit 1
fi

# Stage 4: Deploy with dfx
echo -e "${GREEN}Validation successful! Deploying with dfx...${NC}"
dfx deploy evote_frontend

# Check if deployment was successful
if [ $? -eq 0 ]; then
  echo -e "${GREEN}Deployment successful!${NC}"
  CANISTER_ID=$(dfx canister id evote_frontend)
  echo -e "${BLUE}Access your app at: ${GREEN}$CANISTER_ID.localhost:4943${NC}"
else
  echo -e "${RED}Deployment failed. Please check the error messages above.${NC}"
fi
