#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting fresh deployment...${NC}"

# Make sure dfx is running
if ! dfx ping &>/dev/null; then
    echo -e "${RED}DFX is not running. Starting dfx...${NC}"
    dfx start --background
    sleep 5
fi

# Stop dfx and clean up
echo -e "${BLUE}Stopping dfx and cleaning up state...${NC}"
dfx stop
rm -rf .dfx
rm -rf dist
rm -rf canister_ids.json

# Start dfx again
echo -e "${BLUE}Starting dfx again...${NC}"
dfx start --background
sleep 5

# Build the frontend
echo -e "${BLUE}Building frontend...${NC}"
npm run build

# Create the frontend canister first
echo -e "${BLUE}Creating frontend canister...${NC}"
dfx canister create evote_frontend

# Deploy the frontend canister
echo -e "${BLUE}Deploying frontend canister...${NC}"
dfx deploy evote_frontend

# Print URL
echo -e "${GREEN}Frontend deployed!${NC}"
echo -e "${BLUE}Access your frontend at:${NC}"
FRONTEND_ID=$(dfx canister id evote_frontend)
if [ -n "$FRONTEND_ID" ]; then
    echo -e "${GREEN}$FRONTEND_ID.localhost:4943${NC}"
else
    echo -e "${RED}Failed to get frontend canister ID${NC}"
fi

echo -e "${BLUE}For local development, run:${NC}"
echo -e "npm start"
