#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Directly deploying to Internet Computer using HTTP API...${NC}"

# Make sure dfx is running
if ! dfx ping &>/dev/null; then
    echo -e "${RED}DFX is not running. Starting dfx...${NC}"
    dfx start --background
    sleep 5
fi

# Reset state
echo -e "${BLUE}Stopping dfx and cleaning up state...${NC}"
dfx stop
rm -rf .dfx
rm -rf canister_ids.json
dfx start --clean --background
sleep 5

# Create simplified index.html
echo -e "${BLUE}Creating simplified index.html...${NC}"
mkdir -p temp_deploy
cat > temp_deploy/index.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EVote App</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }
        h1 {
            color: #2563eb;
        }
        .success {
            padding: 20px;
            background-color: #ecfdf5;
            border-radius: 8px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <h1>EVote Application</h1>
    <div class="success">
        <h2>Deployment Successful!</h2>
        <p>Your Internet Computer canister is now running.</p>
        <p>This is a minimal page to verify the deployment works.</p>
    </div>
    <p>Now you can proceed with deploying your full React application.</p>
</body>
</html>
EOL

# Create wallet for the current identity if it doesn't exist
echo -e "${BLUE}Creating wallet if needed...${NC}"
dfx identity get-wallet --network=local

# Create the new canister
echo -e "${BLUE}Creating a new canister...${NC}"
WALLET_ID=$(dfx identity get-wallet --network=local)
CANISTER_ID=$(dfx ledger --network=local create-canister $(dfx identity get-principal) --amount 1T)

# Extract the actual canister ID
CANISTER_ID=$(echo $CANISTER_ID | grep -o "Principal: [a-z0-9\-]*" | cut -d' ' -f2)

if [ -z "$CANISTER_ID" ]; then
    echo -e "${RED}Failed to create canister. Using dfx to create it instead.${NC}"
    dfx canister create evote_frontend
    CANISTER_ID=$(dfx canister id evote_frontend)
fi

echo -e "${BLUE}Created canister with ID: $CANISTER_ID${NC}"

# Install the assets using the HTTP API
echo -e "${BLUE}Installing index.html using HTTP API...${NC}"
INDEX_HTML=$(cat temp_deploy/index.html | xxd -p | tr -d '\n')

curl -X PUT \
     -H "Content-Type: application/cbor" \
     "http://localhost:4943/api/v2/canister/$CANISTER_ID/asset" \
     --data-binary @- \
     <<< $(echo -e "\x64index.html\x74text/html\x58${#INDEX_HTML}${INDEX_HTML}")

# Clean up
rm -rf temp_deploy

echo -e "${GREEN}Deployment successful!${NC}"
echo -e "${BLUE}Access your app at: ${GREEN}$CANISTER_ID.localhost:4943${NC}"
