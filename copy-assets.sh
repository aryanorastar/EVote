#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Creating dist directory structure...${NC}"

# Ensure dist directory exists
mkdir -p dist/evote_frontend

# Copy main.css to dist directory (only if it doesn't exist in dist)
if [ ! -f "dist/evote_frontend/main.css" ]; then
  echo -e "${BLUE}Copying main.css to dist directory...${NC}"
  cp src/evote_frontend/assets/main.css dist/evote_frontend/
fi

echo -e "${GREEN}Assets prepared for deployment!${NC}"
