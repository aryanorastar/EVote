#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting layout fix and deployment...${NC}"

# Create a directory for compiled css
mkdir -p dist/css

# Fix the Voting.css layout first
echo -e "${BLUE}Applying layout fixes to the Voting page...${NC}"

# Compile the CSS without using PostCSS
echo -e "${BLUE}Generating CSS output files...${NC}"

# Generate the output.css file directly to dist
cp src/evote_frontend/src/pages/Voting.css dist/css/voting.css

# Update the index.js to properly import the CSS from the right location
echo -e "${BLUE}Updating imports...${NC}"

# Create a method to bypass PostCSS/Tailwind
cat > src/evote_frontend/src/index.js << 'EOL'
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Import basic CSS files directly
import './App.css';

// Create traditional link elements for our CSS files to bypass PostCSS processing
function createLinkElement(href) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

// Add CSS files we need
createLinkElement('./css/voting.css');

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOL

# Update the App.js to no longer import CSS files
cat > src/evote_frontend/src/App.js << 'EOL'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

# Create a simplified postcss.config.js that doesn't use Tailwind
cat > postcss.config.js << 'EOL'
module.exports = {
  plugins: [
    require('autoprefixer')
  ]
};
EOL

# Copy CSS files to deploy directory
echo -e "${BLUE}Copying CSS files to deploy directory...${NC}"
mkdir -p .dfx/local/canisters/evote_frontend/assets/css
cp dist/css/* .dfx/local/canisters/evote_frontend/assets/css/

# Build the project
echo -e "${BLUE}Building project...${NC}"
npm run build

# Deploy with dfx
echo -e "${GREEN}Deploying with dfx...${NC}"
dfx deploy

# Check if deployment was successful
if [ $? -eq 0 ]; then
  echo -e "${GREEN}Deployment successful!${NC}"
  FRONTEND_ID=$(dfx canister id evote_frontend)
  echo -e "${BLUE}Access your app at: ${GREEN}$FRONTEND_ID.localhost:4943${NC}"
else
  echo -e "${RED}Deployment failed. Please check the error messages above.${NC}"
fi
