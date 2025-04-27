#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up EVote project...${NC}"

# Install dependencies
echo -e "${BLUE}Installing npm dependencies...${NC}"
npm install

# Check if dfx is installed
if ! command -v dfx &> /dev/null
then
    echo -e "${RED}dfx could not be found, installing...${NC}"
    sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
else
    echo -e "${GREEN}dfx is already installed.${NC}"
fi

# Check if dfx is already running
if dfx ping; then
    echo -e "${GREEN}dfx is already running.${NC}"
else
    echo -e "${BLUE}Starting dfx in the background...${NC}"
    dfx start --background
fi

# Create necessary directories
echo -e "${BLUE}Creating project directories...${NC}"
mkdir -p src/evote_frontend/assets
mkdir -p src/evote_frontend/src/components
mkdir -p src/evote_frontend/src/pages
mkdir -p src/evote_backend/src

# Set execute permissions
chmod +x setup.sh

echo -e "${GREEN}Setup complete!${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo -e "1. Run ${GREEN}dfx deploy${NC} to deploy the canisters"
echo -e "2. Run ${GREEN}npm start${NC} to start the development server"
