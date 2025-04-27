#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up project for deployment...${NC}"

# Step 1: Clean up and install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm install --save-dev tailwindcss@^3.3.0 postcss@^8.4.21 autoprefixer@^10.4.14 postcss-loader@^7.1.0 css-loader@^6.7.3

# Step 2: Create proper configuration files
echo -e "${BLUE}Creating Tailwind configuration...${NC}"

# Create tailwind.config.js
cat > tailwind.config.js << 'EOL'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/evote_frontend/src/**/*.{js,jsx,ts,tsx}",
    "./src/evote_frontend/src/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        }
      }
    },
  },
  plugins: [],
}
EOL

# Create postcss.config.js
cat > postcss.config.js << 'EOL'
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ]
};
EOL

# Step 3: Create Tailwind CSS base file
echo -e "${BLUE}Creating Tailwind base CSS...${NC}"
mkdir -p src/evote_frontend/src/styles

cat > src/evote_frontend/src/styles/tailwind-base.css << 'EOL'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOL

# Step 4: Build Tailwind CSS
echo -e "${BLUE}Building Tailwind CSS...${NC}"
npx tailwindcss -i ./src/evote_frontend/src/styles/tailwind-base.css -o ./src/evote_frontend/src/styles/output.css

# Step 5: Update index.html to include the CSS file
echo -e "${BLUE}Updating index.html...${NC}"

# Create or update index.html
cat > src/evote_frontend/src/index.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="theme-color" content="#2563eb" />
    <meta
      name="description"
      content="EVote - Decentralized Governance Platform for Local Communities"
    />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Add Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <title>EVote - Decentralized Governance</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
EOL

# Step 6: Update App.js to import the Tailwind CSS output file
echo -e "${BLUE}Updating App.js...${NC}"
cat > src/evote_frontend/src/App.js << 'EOL'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles/output.css'; // Import the Tailwind CSS output file
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Proposals from './pages/Proposals';
import Voting from './pages/Voting';
import About from './pages/About';
import AuthAlert from './components/AuthAlert';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <AuthAlert />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/proposals" element={<Proposals />} />
              <Route path="/voting" element={<Voting />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
EOL

# Step 7: Build the project
echo -e "${BLUE}Building project...${NC}"
npm run build

# Step 8: Deploy with dfx
echo -e "${GREEN}Deploying with dfx...${NC}"
dfx deploy evote_frontend

# Check if deployment was successful
if [ $? -eq 0 ]; then
  echo -e "${GREEN}Deployment successful!${NC}"
  FRONTEND_ID=$(dfx canister id evote_frontend)
  echo -e "${BLUE}Access your app at: ${GREEN}$FRONTEND_ID.localhost:4943${NC}"
else
  echo -e "${RED}Deployment failed. Please check the error messages above.${NC}"
fi
