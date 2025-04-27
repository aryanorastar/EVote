#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Building and deploying webpack output...${NC}"

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

# Build the React app using webpack
echo -e "${BLUE}Building React app using webpack...${NC}"
npm run build

# Get existing canister ID
CANISTER_ID=$(dfx canister id evote_frontend)
if [ -z "$CANISTER_ID" ]; then
    echo -e "${RED}Canister ID not found. Creating a new canister...${NC}"
    dfx canister create evote_frontend
    CANISTER_ID=$(dfx canister id evote_frontend)
fi

echo -e "${BLUE}Deploying to canister ID: $CANISTER_ID${NC}"

# Build the canister using dfx
echo -e "${BLUE}Building the canister...${NC}"
dfx build evote_frontend

# Install the assets
echo -e "${BLUE}Installing assets to canister...${NC}"
dfx canister install evote_frontend --mode=reinstall --yes

# Print URL
echo -e "${GREEN}Deployment complete!${NC}"
echo -e "${BLUE}Access your app at: ${GREEN}$CANISTER_ID.localhost:4943${NC}"
echo -e "${BLUE}For local development, run:${NC}"
echo -e "npm start"
