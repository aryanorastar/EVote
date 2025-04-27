#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Deploying frontend assets canister only...${NC}"

# Build the frontend
npm run build

# Deploy only the frontend canister
dfx deploy evote_frontend

# Print URL
echo -e "${GREEN}Frontend deployed!${NC}"
echo -e "${BLUE}Access your frontend at:${NC}"
FRONTEND_ID=$(dfx canister id evote_frontend)
echo -e "$FRONTEND_ID.localhost:4943"
