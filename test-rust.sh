#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Testing Rust configuration...${NC}"

# Save current directory
CURRENT_DIR=$(pwd)

# Change to the Rust project directory
cd src/evote_backend

# Check if cargo can find the project
if cargo locate-project; then
    echo -e "${GREEN}Cargo project found successfully!${NC}"
    
    # Try to build the project
    echo -e "${BLUE}Building Rust project...${NC}"
    if cargo build; then
        echo -e "${GREEN}Rust project builds successfully!${NC}"
    else
        echo -e "${RED}Error building Rust project${NC}"
    fi
else
    echo -e "${RED}Cargo project not found${NC}"
    
    echo -e "${BLUE}Directory contents:${NC}"
    ls -la
    
    echo -e "${BLUE}Checking if Cargo.toml exists:${NC}"
    if [ -f "Cargo.toml" ]; then
        echo -e "${GREEN}Cargo.toml exists${NC}"
        echo -e "${BLUE}Cargo.toml contents:${NC}"
        cat Cargo.toml
    else
        echo -e "${RED}Cargo.toml does not exist${NC}"
    fi
fi

# Return to original directory
cd $CURRENT_DIR
