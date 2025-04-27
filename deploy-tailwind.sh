#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up Tailwind and deploying...${NC}"

# Install copy-webpack-plugin if missing
if ! npm list copy-webpack-plugin &> /dev/null; then
    echo -e "${BLUE}Installing copy-webpack-plugin...${NC}"
    npm install --save-dev copy-webpack-plugin
fi

# Ensure the styles directory exists
mkdir -p src/evote_frontend/src/styles

# Generate tailwind.css file if it doesn't exist
if [ ! -f "src/evote_frontend/src/styles/tailwind.css" ]; then
    echo -e "${BLUE}Creating tailwind.css file...${NC}"
    cat > src/evote_frontend/src/styles/tailwind.css << 'EOL'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: Poppins, system-ui, sans-serif;
  }
  
  body {
    @apply bg-background;
  }
}

@layer components {
  .btn {
    @apply px-4 py-2 rounded-md font-medium transition-all duration-200 ease-in-out;
  }
  
  .btn-primary {
    @apply bg-primary-600 text-white hover:bg-primary-700 shadow hover:shadow-md;
  }
  
  .btn-outline {
    @apply border-2 border-primary-600 text-primary-600 hover:bg-primary-50;
  }
  
  .card {
    @apply bg-white rounded-md shadow p-6 hover:shadow-md transition-shadow duration-300;
  }
  
  .form-input {
    @apply w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200;
  }
  
  .link {
    @apply text-primary-600 hover:text-primary-800 hover:underline transition-colors duration-200;
  }
}
EOL
fi

# Build Tailwind CSS
echo -e "${BLUE}Building Tailwind CSS...${NC}"
npx tailwindcss -i ./src/evote_frontend/src/styles/tailwind.css -o ./src/evote_frontend/src/styles/output.css --minify

# Create directory for output CSS in dist
mkdir -p dist/evote_frontend

# Copy the output CSS file directly to dist (manual approach)
echo -e "${BLUE}Copying CSS to dist folder...${NC}"
cp src/evote_frontend/src/styles/output.css dist/evote_frontend/

# Build the React app
echo -e "${BLUE}Building React app...${NC}"
npm run build

# Deploy with dfx
echo -e "${BLUE}Deploying with dfx...${NC}"
dfx deploy evote_frontend

# Print URL
echo -e "${GREEN}Deployment complete!${NC}"
FRONTEND_ID=$(dfx canister id evote_frontend)
echo -e "${BLUE}Access your app at: ${GREEN}$FRONTEND_ID.localhost:4943${NC}"
