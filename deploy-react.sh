#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Deploying React app to Internet Computer...${NC}"

# Make sure dfx is running
if ! dfx ping &>/dev/null; then
    echo -e "${RED}DFX is not running. Starting dfx...${NC}"
    dfx start --background
    sleep 5
fi

# Create security policy file if it doesn't exist
if [ ! -f ".ic-assets.json5" ]; then
    echo -e "${BLUE}Creating security policy file...${NC}"
    cat > .ic-assets.json5 << 'EOL'
[
  {
    "match": "**/*",
    "security_policy": "standard",
    "disable_security_policy_warning": true
  }
]
EOL
fi

# Create a directory structure for the React build output
echo -e "${BLUE}Building React app...${NC}"
npm run build

# Create a simplified dfx.json file just for assets
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

# Build the canister
echo -e "${BLUE}Building the canister...${NC}"
dfx build evote_frontend

# Install the assets
echo -e "${BLUE}Installing assets to canister...${NC}"
CANISTER_ID=$(dfx canister id evote_frontend)
dfx canister install evote_frontend --mode=reinstall

# Print URL
echo -e "${GREEN}React app deployed!${NC}"
echo -e "${BLUE}Access your app at: ${GREEN}$CANISTER_ID.localhost:4943${NC}"
