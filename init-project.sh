#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Initializing EVote project...${NC}"

# Make sure dfx is running
if ! dfx ping &>/dev/null; then
    echo -e "${RED}DFX is not running. Starting dfx...${NC}"
    dfx start --background
    sleep 5
fi

echo -e "${BLUE}Cleaning up existing state...${NC}"
# Remove local dfx state
rm -rf .dfx
# Remove node modules
rm -rf node_modules
# Remove any existing canisters
rm -rf src/evote_backend/target

echo -e "${BLUE}Installing npm dependencies...${NC}"
npm install

echo -e "${BLUE}Setting up project structure...${NC}"
# Create necessary directories
mkdir -p src/evote_backend/src
mkdir -p src/evote_frontend/assets
mkdir -p src/evote_frontend/src/components
mkdir -p src/evote_frontend/src/pages
mkdir -p src/evote_frontend/src/utils
mkdir -p src/evote_frontend/src/context
mkdir -p src/evote_frontend/src/declarations/evote_backend

echo -e "${GREEN}Project initialized! Now run:${NC}"
echo -e "./deploy.sh"
