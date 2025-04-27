#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Building with minimal webpack configuration...${NC}"

# Clean the dist directory
rm -rf dist

# Build using the minimal webpack config
echo -e "${BLUE}Running webpack build...${NC}"
NODE_ENV=production npx webpack --config minimal-webpack.config.js

echo -e "${GREEN}Build complete! Output is in the dist/evote_frontend directory${NC}"
