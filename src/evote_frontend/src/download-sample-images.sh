#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Downloading sample images for proposals...${NC}"

# Create image directory if it doesn't exist
mkdir -p public/images/proposals

# Infrastructure images
echo -e "${BLUE}Downloading infrastructure images...${NC}"
curl -s -o public/images/proposals/infrastructure-1.jpg "https://images.unsplash.com/photo-1486325212027-8081e485255e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
curl -s -o public/images/proposals/infrastructure-2.jpg "https://images.unsplash.com/photo-1545127398-14699f92334b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
curl -s -o public/images/proposals/infrastructure-3.jpg "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"

# Education images
echo -e "${BLUE}Downloading education images...${NC}"
curl -s -o public/images/proposals/education-1.jpg "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
curl -s -o public/images/proposals/education-2.jpg "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
curl -s -o public/images/proposals/education-3.jpg "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"

# Environment images
echo -e "${BLUE}Downloading environment images...${NC}"
curl -s -o public/images/proposals/environment-1.jpg "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
curl -s -o public/images/proposals/environment-2.jpg "https://images.unsplash.com/photo-1516214104703-d870798883c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
curl -s -o public/images/proposals/environment-3.jpg "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"

# Safety images
echo -e "${BLUE}Downloading safety images...${NC}"
curl -s -o public/images/proposals/safety-1.jpg "https://images.unsplash.com/photo-1622037022824-0c71d511ef3c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
curl -s -o public/images/proposals/safety-2.jpg "https://images.unsplash.com/photo-1582460570035-40de01685051?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
curl -s -o public/images/proposals/safety-3.jpg "https://images.unsplash.com/photo-1607462557754-6a7c4b2bb711?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"

# Community events images
echo -e "${BLUE}Downloading community events images...${NC}"
curl -s -o public/images/proposals/events-1.jpg "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
curl -s -o public/images/proposals/events-2.jpg "https://images.unsplash.com/photo-1540317580384-e5d43867caa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
curl -s -o public/images/proposals/events-3.jpg "https://images.unsplash.com/photo-1528605248644-14dd04022da1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"

# General images
echo -e "${BLUE}Downloading general images...${NC}"
curl -s -o public/images/proposals/general-1.jpg "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
curl -s -o public/images/proposals/general-2.jpg "https://images.unsplash.com/photo-1505236858219-8359eb29e329?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
curl -s -o public/images/proposals/general-3.jpg "https://images.unsplash.com/photo-1530811761207-8d9d22f0a141?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"

echo -e "${GREEN}Successfully downloaded sample images for proposals!${NC}"
echo -e "${BLUE}Images are stored in public/images/proposals/${NC}"
echo -e "${BLUE}You may want to copy these to your deployment assets directory as well.${NC}"
