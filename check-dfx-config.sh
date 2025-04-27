#!/bin/bash

# Colors for better output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Checking project configuration for Internet Computer deployment...${NC}"

# Step 1: Check if dfx is installed
if ! command -v dfx &> /dev/null
then
    echo -e "${RED}dfx could not be found. Please install the DFINITY Canister SDK.${NC}"
    echo "Visit https://sdk.dfinity.org/docs/quickstart/local-quickstart.html for installation instructions."
    exit 1
fi

# Step 2: Check dfx version
DFX_VERSION=$(dfx --version)
echo -e "${BLUE}Using dfx version: ${GREEN}$DFX_VERSION${NC}"

# Step 3: Check dfx.json configuration
echo -e "${BLUE}Checking dfx.json configuration...${NC}"
if [ ! -f "dfx.json" ]; then
    echo -e "${RED}dfx.json not found. Are you in the root of your Internet Computer project?${NC}"
    exit 1
fi

# Read frontend canister name from dfx.json
FRONTEND_CANISTER=$(cat dfx.json | grep -E "\"source\".*\[.*\"src\/evote_frontend\/src\"" -B 3 | grep -oP '(?<="canisters": {\s*")[^"]*' || echo "evote_frontend")
echo -e "${BLUE}Detected frontend canister name: ${GREEN}$FRONTEND_CANISTER${NC}"

# Step 4: Check frontend structure
echo -e "${BLUE}Checking frontend structure...${NC}"
if [ ! -d "src/evote_frontend/src" ]; then
    echo -e "${RED}Frontend source directory not found at src/evote_frontend/src${NC}"
    exit 1
fi

if [ ! -f "src/evote_frontend/src/index.js" ] && [ ! -f "src/evote_frontend/src/index.jsx" ]; then
    echo -e "${RED}Entry point (index.js/index.jsx) not found in frontend source directory${NC}"
    exit 1
fi

# Check if About component is imported in App.js
ABOUT_IMPORT=$(grep -E "import About from" src/evote_frontend/src/App.js 2>/dev/null || echo "")
if [ -z "$ABOUT_IMPORT" ]; then
    echo -e "${YELLOW}Warning: About component import not found in App.js${NC}"
    echo -e "Make sure you've imported it correctly:"
    echo -e "${GREEN}import About from './pages/About';${NC}"
fi

# Step 5: Check routing configuration
ROUTER_CONFIG=$(grep -E "<Route.*path=.*about" src/evote_frontend/src/App.js 2>/dev/null || echo "")
if [ -z "$ROUTER_CONFIG" ]; then
    echo -e "${YELLOW}Warning: Route for About page not found in App.js${NC}"
    echo -e "Make sure you've set up the route correctly, for example:"
    echo -e "${GREEN}<Route path=\"/about\" element={<About />} />${NC}"
fi

# Step 6: Check webpack configuration
echo -e "${BLUE}Checking webpack configuration...${NC}"
if [ ! -f "webpack.config.js" ]; then
    echo -e "${YELLOW}Warning: webpack.config.js not found${NC}"
else
    # Check for common issues in webpack config
    HISTORY_FALLBACK=$(grep -E "historyApiFallback" webpack.config.js 2>/dev/null || echo "")
    if [ -z "$HISTORY_FALLBACK" ]; then
        echo -e "${YELLOW}Warning: historyApiFallback not found in webpack.config.js${NC}"
        echo -e "For React Router to work correctly, add the following to your webpack devServer config:"
        echo -e "${GREEN}historyApiFallback: true,${NC}"
    fi
    
    OUTPUT_CONFIG=$(grep -E "publicPath" webpack.config.js 2>/dev/null || echo "")
    if [ -z "$OUTPUT_CONFIG" ]; then
        echo -e "${YELLOW}Warning: publicPath not found in webpack.config.js${NC}"
        echo -e "Consider setting output.publicPath in your webpack config:"
        echo -e "${GREEN}output: { publicPath: '/' },${NC}"
    fi
fi

# Step 7: Create a simplified webpack configuration for IC deployment
echo -e "${BLUE}Creating a simplified webpack configuration for IC deployment...${NC}"
cat > webpack.config.js.new << EOL
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

let localCanisters, prodCanisters, canisters;

function initCanisterIds() {
  try {
    localCanisters = require('./.dfx/local/canister_ids.json');
  } catch (error) {
    console.log('No local canister_ids.json found. Continuing production');
  }
  try {
    prodCanisters = require('./canister_ids.json');
  } catch (error) {
    console.log('No production canister_ids.json found. Continuing with local');
  }

  const network = process.env.DFX_NETWORK || (process.env.NODE_ENV === 'production' ? 'ic' : 'local');

  canisters = network === 'local' ? localCanisters : prodCanisters;

  for (const canister in canisters) {
    process.env['CANISTER_ID_' + canister.toUpperCase()] = canisters[canister][network];
  }
}
initCanisterIds();

const isDevelopment = process.env.NODE_ENV !== 'production';

const frontendDirectory = 'evote_frontend';
const asset_entry = path.join('src', frontendDirectory, 'src', 'index.js');

module.exports = {
  target: 'web',
  mode: isDevelopment ? 'development' : 'production',
  entry: {
    // The frontend.entrypoint points to the HTML file for this build, so we need
    // to replace the extension to `.js`.
    index: asset_entry,
  },
  devtool: isDevelopment ? 'source-map' : false,
  optimization: {
    minimize: !isDevelopment,
    minimizer: [new TerserPlugin()],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.ts'],
    fallback: {
      assert: require.resolve('assert/'),
      buffer: require.resolve('buffer/'),
      events: require.resolve('events/'),
      stream: require.resolve('stream-browserify/'),
      util: require.resolve('util/'),
    },
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist', frontendDirectory),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.(jpg|jpeg|png|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', frontendDirectory, 'src', 'index.html'),
      filename: 'index.html',
      cache: false,
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      CANISTER_ID_EVOTE_FRONTEND: canisters['evote_frontend']?.['local'],
    }),
    new webpack.ProvidePlugin({
      Buffer: [require.resolve('buffer/'), 'Buffer'],
      process: require.resolve('process/browser'),
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'src', frontendDirectory, 'assets'),
          to: path.join(__dirname, 'dist', frontendDirectory),
        },
      ],
    }),
  ],
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api',
        },
      },
    },
    static: {
      directory: path.resolve(__dirname, 'dist', frontendDirectory),
    },
    historyApiFallback: true,
    hot: true,
    watchFiles: [path.resolve(__dirname, 'src', frontendDirectory, 'src')],
    compress: true,
    port: 3000,
  },
};
EOL

# Step 8: Create a custom index.html for testing
echo -e "${BLUE}Creating a custom index.html for testing...${NC}"
mkdir -p src/evote_frontend/assets
cat > src/evote_frontend/assets/index.html.test << EOL
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EVote - Testing</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #2563eb;
        }
        .test-content {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .test-link {
            display: inline-block;
            padding: 10px 15px;
            background-color: #2563eb;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <h1>EVote Test Page</h1>
    <div class="test-content">
        <p>This is a test page to check if your Internet Computer canister is serving assets correctly.</p>
        <p>If you can see this page, static asset serving is working properly.</p>
        <a href="/" class="test-link">Go to Main Application</a>
    </div>
    <div class="test-content">
        <h2>About Component Test</h2>
        <p>Click the link below to test the About component:</p>
        <a href="/about" class="test-link">Go to About Page</a>
    </div>
</body>
</html>
EOL

# Step 9: Fix the About component CSS for compatibility
echo -e "${BLUE}Creating minimal About CSS file...${NC}"
cat > src/evote_frontend/src/pages/About.css << EOL
.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.about-container h1 {
  font-size: 2.5rem;
  color: #2563eb;
  margin-bottom: 1rem;
}

.about-container p {
  font-size: 1.125rem;
  line-height: 1.7;
  color: #4b5563;
  margin-bottom: 1.5rem;
}
EOL

# Step 10: Check network status
echo -e "${BLUE}Checking DFX network status...${NC}"
DFX_RUNNING=$(dfx info 2>/dev/null || echo "")

if [ -z "$DFX_RUNNING" ]; then
    echo -e "${YELLOW}DFX network doesn't appear to be running. Starting it...${NC}"
    dfx start --clean --background
    sleep 5
else
    echo -e "${GREEN}DFX network is running.${NC}"
fi

# Step 11: Update package.json with necessary IC dependencies
echo -e "${BLUE}Updating package.json with IC-specific dependencies...${NC}"

# Dependencies that are often needed for IC apps
npm install --save-dev \
  @dfinity/agent \
  @dfinity/auth-client \
  @dfinity/authentication \
  @dfinity/identity \
  @dfinity/principal

# Common webpack plugins and loaders
npm install --save-dev \
  html-webpack-plugin \
  terser-webpack-plugin \
  copy-webpack-plugin \
  webpack-cli \
  webpack-dev-server \
  css-loader \
  style-loader \
  postcss-loader \
  babel-loader \
  @babel/preset-env \
  @babel/preset-react

# Make sure React Router is correctly installed for proper navigation
npm install \
  react-router-dom

# Step 12: Create a deployment script specifically for IC with progressive enhancement
echo -e "${BLUE}Creating an IC-specific deployment script...${NC}"
cat > deploy-to-ic.sh << EOL
#!/bin/bash

# Colors for better output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting Internet Computer deployment process...${NC}"

# Step 1: Check if the local DFX network is running
dfx info &> /dev/null
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}DFX network doesn't appear to be running. Starting it...${NC}"
    dfx start --clean --background
    sleep 5
else
    echo -e "${GREEN}DFX network is running.${NC}"
fi

# Step 2: Deploy only a simple About component as a test
echo -e "${BLUE}First deploying a simplified version to test...${NC}"
cp src/evote_frontend/src/pages/About.js src/evote_frontend/src/pages/About.js.bak
cat > src/evote_frontend/src/pages/About.js << EOL
import React from 'react';
import './About.css';

// Simple component for initial testing
const About = () => {
  return (
    <div className="about-container">
      <h1>About EVote</h1>
      <p>This is the about page for EVote.</p>
    </div>
  );
};

export default About;
EOL

# Step 3: Build and deploy
echo -e "${BLUE}Building and deploying the application...${NC}"
dfx deploy

if [ $? -ne 0 ]; then
    echo -e "${RED}Deployment failed with simple About component. Check error messages above.${NC}"
    # Restore original About.js
    mv src/evote_frontend/src/pages/About.js.bak src/evote_frontend/src/pages/About.js
    exit 1
fi

echo -e "${GREEN}Simple About component deployed successfully!${NC}"

# Step 4: Validate deployment
CANISTER_ID=\$(dfx canister id evote_frontend)
echo -e "${BLUE}You can access the test deployment at:${NC}"
echo -e "${GREEN}http://localhost:8000/?canisterId=\${CANISTER_ID}${NC}"
echo -e "${GREEN}http://localhost:8000/about?canisterId=\${CANISTER_ID}${NC}"

# Step 5: Ask if user wants to proceed with full deployment
read -p "Do you want to deploy the full About component now? (y/n) " -n 1 -r
echo
if [[ \$REPLY =~ ^[Yy]$ ]]; then
    # Restore original About.js
    mv src/evote_frontend/src/pages/About.js.bak src/evote_frontend/src/pages/About.js
    
    echo -e "${BLUE}Deploying full About component...${NC}"
    dfx deploy
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Full About component deployed successfully!${NC}"
    else
        echo -e "${RED}Full deployment failed. You may need to simplify your About component.${NC}"
    fi
else
    echo -e "${YELLOW}Keeping the simple About component deployed.${NC}"
    rm src/evote_frontend/src/pages/About.js.bak
fi

echo -e "${BLUE}Deployment process completed.${NC}"
EOL

chmod +x deploy-to-ic.sh

echo -e "${GREEN}Configuration check complete!${NC}"
echo -e "${BLUE}To check your configuration and troubleshoot the About component:${NC}"
echo -e "1. Compare your webpack.config.js with the newly created webpack.config.js.new"
echo -e "2. Run ${GREEN}./deploy-to-ic.sh${NC} to deploy a simplified version and test it"
echo -e "3. Check the tips printed above for specific issues identified in your configuration"
echo -e "\nGood luck with your Internet Computer project!"
