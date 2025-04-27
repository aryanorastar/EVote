#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Creating and deploying frontend canister...${NC}"

# Make sure dfx is running
if ! dfx ping &>/dev/null; then
    echo -e "${RED}DFX is not running. Starting dfx...${NC}"
    dfx start --background
    sleep 5
fi

# Remove local state for the frontend canister
echo -e "${BLUE}Cleaning up existing frontend canister state...${NC}"
rm -rf .dfx/local/canisters/evote_frontend
rm -rf dist

# Build the frontend
echo -e "${BLUE}Building frontend...${NC}"
npm run build

# Create the frontend canister
echo -e "${BLUE}Creating frontend canister...${NC}"
dfx canister create evote_frontend

# Deploy the frontend canister
echo -e "${BLUE}Deploying frontend canister...${NC}"
dfx deploy evote_frontend

# Print URL
echo -e "${GREEN}Frontend deployed!${NC}"
echo -e "${BLUE}Access your frontend at:${NC}"
FRONTEND_ID=$(dfx canister id evote_frontend)
echo -e "${GREEN}$FRONTEND_ID.localhost:4943${NC}"
echo -e "${BLUE}For local development, run:${NC}"
echo -e "npm start"
