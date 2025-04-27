#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Building Tailwind CSS...${NC}"

# Create the styles directory if it doesn't exist
mkdir -p src/evote_frontend/src/styles

# Install dependencies if needed
if [ ! -d "node_modules/tailwindcss" ]; then
  echo -e "${BLUE}Installing Tailwind CSS and dependencies...${NC}"
  npm install --save-dev tailwindcss postcss autoprefixer postcss-loader
fi

# Build Tailwind CSS
echo -e "${BLUE}Generating Tailwind CSS...${NC}"
npx tailwindcss -i ./src/evote_frontend/src/styles/tailwind.css -o ./src/evote_frontend/src/styles/output.css

echo -e "${GREEN}Tailwind CSS built successfully!${NC}"
