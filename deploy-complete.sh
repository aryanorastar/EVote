#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Complete deployment with all necessary files...${NC}"

# Ensure all necessary directories exist
mkdir -p src/evote_frontend/src/styles
mkdir -p dist/evote_frontend

# Create icons.css if it doesn't exist
if [ ! -f "src/evote_frontend/src/styles/icons.css" ]; then
    echo -e "${BLUE}Creating icons.css file...${NC}"
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

/* Common icon styles */
.fa-home:before {
  content: "\f015";
}

.fa-clipboard-list:before {
  content: "\f46d";
}

.fa-vote-yea:before {
  content: "\f772";
}

.fa-info-circle:before {
  content: "\f05a";
}

.fa-user-check:before {
  content: "\f4fc";
}

.fa-sign-in-alt:before {
  content: "\f2f6";
}

.fa-times:before {
  content: "\f00d";
}

.fa-bars:before {
  content: "\f0c9";
}

.fa-envelope:before {
  content: "\f0e0";
}

.fa-map-marker-alt:before {
  content: "\f3c5";
}
EOL
fi

# Create tailwind.css if it doesn't exist
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

# Build the Tailwind CSS
echo -e "${BLUE}Building Tailwind CSS...${NC}"
npx tailwindcss -i ./src/evote_frontend/src/styles/tailwind.css -o ./src/evote_frontend/src/styles/output.css --minify

# Copy the output CSS directly to dist folder (will be overwritten by the build)
echo -e "${BLUE}Copying CSS files to dist folder...${NC}"
cp src/evote_frontend/src/styles/output.css dist/evote_frontend/
cp src/evote_frontend/src/styles/icons.css dist/evote_frontend/

# Make sure the index.html includes Font Awesome
echo -e "${BLUE}Updating index.html...${NC}"
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

# Fix App.js to avoid requiring icons.css directly
echo -e "${BLUE}Updating App.js...${NC}"
cat > src/evote_frontend/src/App.js << 'EOL'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Proposals from './pages/Proposals';
import Voting from './pages/Voting';
import About from './pages/About';
import TestTailwind from './components/TestTailwind';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/proposals" element={<Proposals />} />
              <Route path="/voting" element={<Voting />} />
              <Route path="/about" element={<About />} />
              <Route path="/test-tailwind" element={<TestTailwind />} />
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

# Create security policy file
echo -e "${BLUE}Creating security policy file...${NC}"
cat > .ic-assets.json5 << 'EOL'
[
  {
    "match": "**/*",
    "security_policy": "standard",
    "disable_security_policy_warning": true
  }
]
EOL

# Build the app
echo -e "${BLUE}Building the app...${NC}"
npm run build

# Deploy the app
echo -e "${BLUE}Deploying with dfx...${NC}"
dfx deploy evote_frontend

# Print URL
echo -e "${GREEN}Deployment complete!${NC}"
FRONTEND_ID=$(dfx canister id evote_frontend)
echo -e "${BLUE}Access your app at: ${GREEN}$FRONTEND_ID.localhost:4943${NC}"
