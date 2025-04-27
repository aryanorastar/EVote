#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Completely resetting local Internet Computer replica...${NC}"

# Stop dfx if it's running
echo -e "${BLUE}Stopping dfx...${NC}"
dfx stop

# Remove all local state
echo -e "${BLUE}Removing all local state...${NC}"
rm -rf .dfx
rm -rf dist
rm -rf canister_ids.json

# Start dfx with a clean slate
echo -e "${BLUE}Starting dfx with a clean slate...${NC}"
dfx start --clean --background
sleep 5

# Create the security policy file
echo -e "${BLUE}Creating security policy file...${NC}"
cat > .ic-assets.json5 << 'EOL'
[
  {
    "match": "**/*",
    "security_policy": "standard"
  }
]
EOL

echo -e "${BLUE}Building frontend...${NC}"
npm run build

# Create the frontend canister
echo -e "${BLUE}Creating new frontend canister...${NC}"
dfx canister create evote_frontend

# Install the assets
echo -e "${BLUE}Installing assets to canister...${NC}"
dfx canister install evote_frontend --mode reinstall

# Print URL and canister ID
echo -e "${GREEN}Frontend deployed!${NC}"
FRONTEND_ID=$(dfx canister id evote_frontend)
echo -e "${BLUE}Canister ID: ${GREEN}$FRONTEND_ID${NC}"
echo -e "${BLUE}Access your frontend at: ${GREEN}$FRONTEND_ID.localhost:4943${NC}"
