#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Building and deploying with icons...${NC}"

# Ensure the styles directory exists
mkdir -p src/evote_frontend/src/styles

# Build Tailwind CSS
echo -e "${BLUE}Building Tailwind CSS...${NC}"
npx tailwindcss -i ./src/evote_frontend/src/styles/tailwind.css -o ./src/evote_frontend/src/styles/output.css --minify

# Create a file that uses Font Awesome directly
echo -e "${BLUE}Creating Font Awesome helper file...${NC}"
cat > src/evote_frontend/src/styles/icons.css << 'EOL'
/* Include font awesome classes for backward compatibility */
.fa, .fas, .far, .fal, .fad, .fab {
  display: inline-block;
  font-style: normal;
  font-variant: normal;
  text-rendering: auto;
  line-height: 1;
}

/* Fix spacing for icons */
i.mr-2 {
  margin-right: 0.5rem;
}
EOL

# Build the application
echo -e "${BLUE}Building application...${NC}"
npm run build

# Deploy with dfx
echo -e "${BLUE}Deploying with dfx...${NC}"
dfx deploy evote_frontend

# Print URL
echo -e "${GREEN}Deployment complete!${NC}"
FRONTEND_ID=$(dfx canister id evote_frontend)
echo -e "${BLUE}Access your app at: ${GREEN}$FRONTEND_ID.localhost:4943${NC}"
