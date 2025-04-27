#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Fixing Tailwind CSS setup...${NC}"

# Install or update necessary packages
echo -e "${BLUE}Installing/updating required packages...${NC}"
npm install --save-dev tailwindcss@latest postcss@latest autoprefixer@latest postcss-loader@latest

# Create a proper tailwind.config.js if it doesn't exist
if [ ! -f "tailwind.config.js" ] || ! grep -q "content:" "tailwind.config.js"; then
  echo -e "${BLUE}Creating or updating tailwind.config.js...${NC}"
  cat > tailwind.config.js << 'EOL'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/evote_frontend/src/**/*.{js,jsx,ts,tsx}",
    "./src/evote_frontend/src/index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // Primary color
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        background: '#f9fafb',
      },
      borderRadius: {
        'DEFAULT': '12px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'md': '0 6px 10px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      textDecoration: {
        'none': 'none',
      },
    },
  },
  plugins: [],
};
EOL
fi

# Create postcss.config.js if it doesn't exist
if [ ! -f "postcss.config.js" ]; then
  echo -e "${BLUE}Creating postcss.config.js...${NC}"
  cat > postcss.config.js << 'EOL'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
EOL
fi

# Create or update the Tailwind input CSS file
echo -e "${BLUE}Creating Tailwind CSS input file...${NC}"
mkdir -p src/evote_frontend/src/styles
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

# Build the Tailwind CSS output
echo -e "${BLUE}Building Tailwind CSS...${NC}"
npx tailwindcss -i ./src/evote_frontend/src/styles/tailwind.css -o ./src/evote_frontend/src/styles/output.css --minify

echo -e "${GREEN}Tailwind CSS setup has been fixed!${NC}"
echo -e "${BLUE}Now try deploying with: ${GREEN}./validate-and-deploy.sh${NC}"
