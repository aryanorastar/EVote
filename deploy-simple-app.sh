#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Deploying simple static app...${NC}"

# Make sure dfx is running
if ! dfx ping &>/dev/null; then
    echo -e "${RED}DFX is not running. Starting dfx...${NC}"
    dfx start --background
    sleep 5
fi

# Stop dfx and remove state
echo -e "${BLUE}Stopping dfx and cleaning up state...${NC}"
dfx stop
rm -rf .dfx
rm -rf dist
rm -rf canister_ids.json

# Start dfx again
echo -e "${BLUE}Starting dfx again...${NC}"
dfx start --clean --background
sleep 5

# Create security policy file
echo -e "${BLUE}Creating security policy file...${NC}"
cat > .ic-assets.json5 << 'EOL'
[
  {
    "match": "**/*",
    "security_policy": "standard"
  }
]
EOL

# Create a temporary directory for the simple app
echo -e "${BLUE}Preparing simple app for deployment...${NC}"
mkdir -p dist/evote_frontend
cp simple-app/index.html dist/evote_frontend/

# Create a new dfx.json file focused just on assets
echo -e "${BLUE}Creating simplified dfx.json...${NC}"
cat > dfx.json << 'EOL'
{
  "canisters": {
    "evote_frontend": {
      "type": "assets",
      "source": ["dist/evote_frontend"]
    }
  },
  "defaults": {
    "build": {
      "args": "",
      "packtool": ""
    }
  },
  "version": 1
}
EOL

# Create a new canister
echo -e "${BLUE}Creating new canister...${NC}"
dfx canister create evote_frontend

# Build the canister
echo -e "${BLUE}Building the canister...${NC}"
dfx build evote_frontend

# Install the assets
echo -e "${BLUE}Installing assets to canister...${NC}"
dfx canister install evote_frontend --mode install

# Print URL
echo -e "${GREEN}Simple app deployed!${NC}"
CANISTER_ID=$(dfx canister id evote_frontend)
echo -e "${BLUE}Access your app at: ${GREEN}$CANISTER_ID.localhost:4943${NC}"
