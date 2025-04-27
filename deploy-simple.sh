#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Deploying simplified assets-only project...${NC}"

# Make sure dfx is running
if ! dfx ping &>/dev/null; then
    echo -e "${RED}DFX is not running. Starting dfx...${NC}"
    dfx start --background
    sleep 5
fi

# Clean up any existing state
echo -e "${BLUE}Cleaning up existing state...${NC}"
rm -rf .dfx
rm -rf dist

# Build the frontend
echo -e "${BLUE}Building frontend...${NC}"
npm run build

# Deploy the assets canister
echo -e "${BLUE}Deploying assets canister...${NC}"
dfx deploy evote_frontend

# Print URL
echo -e "${GREEN}Frontend deployed!${NC}"
echo -e "${BLUE}Access your frontend at:${NC}"
FRONTEND_ID=$(dfx canister id evote_frontend)
echo -e "$FRONTEND_ID.localhost:4943"
echo -e "${BLUE}For local development, run:${NC}"
echo -e "npm start"
