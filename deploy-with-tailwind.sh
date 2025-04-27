#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Building and deploying with Tailwind CSS...${NC}"

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
npx tailwindcss -i ./src/evote_frontend/src/styles/tailwind.css -o ./src/evote_frontend/src/styles/output.css --minify

# Build the React app using webpack
echo -e "${BLUE}Building React app...${NC}"
npm run build

# Build and deploy with dfx
echo -e "${BLUE}Deploying with dfx...${NC}"
dfx deploy

# Print URL
echo -e "${GREEN}Deployment complete!${NC}"
FRONTEND_ID=$(dfx canister id evote_frontend)
echo -e "${BLUE}Access your app at: ${GREEN}$FRONTEND_ID.localhost:4943${NC}"
echo -e "${BLUE}To manually test Tailwind CSS, visit: ${GREEN}$FRONTEND_ID.localhost:4943/test-tailwind${NC}"
