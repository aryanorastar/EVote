#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Deploying to Internet Computer canister...${NC}"

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

# Build Tailwind CSS
echo -e "${BLUE}Building Tailwind CSS...${NC}"
mkdir -p src/evote_frontend/src/styles
npx tailwindcss -i ./src/evote_frontend/src/styles/tailwind.css -o ./src/evote_frontend/src/styles/output.css --minify

# Ensure the styles directory exists in the dist folder
mkdir -p dist/evote_frontend/styles

# Copy the output CSS file to the dist folder manually
echo -e "${BLUE}Copying Tailwind CSS to dist folder...${NC}"
cp src/evote_frontend/src/styles/output.css dist/evote_frontend/

# Stop dfx and clean up state if requested
if [ "$1" = "--clean" ]; then
    echo -e "${BLUE}Cleaning state...${NC}"
    dfx stop
    rm -rf .dfx
    dfx start --clean --background
    sleep 5
    
    # Create the frontend canister
    echo -e "${BLUE}Creating frontend canister...${NC}"
    dfx canister create evote_frontend
fi

# Deploy with dfx
echo -e "${BLUE}Deploying with dfx...${NC}"
dfx deploy evote_frontend

# Print URL
echo -e "${GREEN}Deployment complete!${NC}"
FRONTEND_ID=$(dfx canister id evote_frontend)
echo -e "${BLUE}Access your app at: ${GREEN}$FRONTEND_ID.localhost:4943${NC}"
echo -e "${BLUE}To test Tailwind CSS, visit: ${GREEN}$FRONTEND_ID.localhost:4943/test-tailwind${NC}"
