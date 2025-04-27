#!/bin/bash

# Colors for better output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting deployment process...${NC}"

# Step 1: Check if we have missing dependencies
echo -e "${BLUE}Checking and installing dependencies...${NC}"
npm install --no-save

# Step 2: Build the project
echo -e "${BLUE}Building project...${NC}"
npm run build

# If the build failed, exit
if [ $? -ne 0 ]; then
  echo -e "${RED}Build failed. Fixing issues...${NC}"
  
  # Check if there are specific errors we can fix
  echo -e "${BLUE}Installing missing packages...${NC}"
  npm install --save-dev css-loader postcss-loader autoprefixer tailwindcss

  # Try building again
  echo -e "${BLUE}Attempting to build again...${NC}"
  npm run build
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}Build still failing. Please check error messages above.${NC}"
    exit 1
  fi
fi

# Step 3: Deploy the application
echo -e "${GREEN}Build successful. Deploying the application...${NC}"
dfx deploy evote_frontend

# Check if deployment was successful
if [ $? -eq 0 ]; then
  echo -e "${GREEN}Deployment successful!${NC}"
  echo -e "${BLUE}You can now access your application locally.${NC}"
else
  echo -e "${RED}Deployment failed. Please check error messages above.${NC}"
  exit 1
fi
