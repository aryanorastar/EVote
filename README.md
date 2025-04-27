# EVote - Decentralized Governance Platform

A decentralized governance platform built on the Internet Computer blockchain that empowers local communities to make collective decisions transparently and securely.

## Features

- **Decentralized Voting**: Secure, transparent voting on the blockchain
- **Proposal Creation**: Community members can create proposals for local initiatives
- **Real-time Results**: See voting outcomes in real-time
- **Web3 Integration**: Connects to the Internet Computer blockchain
- **Mobile Responsive**: Works on all devices from desktop to mobile

## Technology Stack

- **Frontend**: React, React Router, Styled Components
- **Backend**: Internet Computer, Rust, Canister Smart Contracts
- **Authentication**: Internet Identity

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- DFX SDK (Internet Computer SDK)

### Installation and Setup

1. Install the Internet Computer SDK if you haven't already:
```bash
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
```

2. Make sure your project has all the necessary dependencies:
```bash
npm install
```

3. Start the local Internet Computer replica:
```bash
dfx start --background
```

4. Use our simplified deployment script:
```bash
./deploy.sh
```

This script will:
- Deploy the backend canister
- Generate the necessary declarations
- Build and deploy the frontend

5. Alternatively, you can manually deploy:
```bash
# Deploy the backend
dfx deploy evote_backend

# Generate declarations
dfx generate evote_backend

# Build the frontend
npm run build

# Deploy the frontend
dfx deploy evote_frontend
```

6. For development (after deployment), start the webpack dev server:
```bash
npm start
```

7. Access your application at:
- Development server: http://localhost:8080
- Deployed canister: http://<canister-id>.localhost:4943

## Troubleshooting

### Cannot find Cargo.toml
If you see this error:
```
Caused by: 'cargo locate-project' failed: error: could not find `Cargo.toml` in `/path/to/project` or any parent directory
```

Make sure your Rust canister has the proper structure:
```
src/
  evote_backend/
    Cargo.toml
    src/
      lib.rs
```

### Missing declarations error
If your frontend can't find the declarations, manually copy them:
```bash
mkdir -p src/evote_frontend/src/declarations/evote_backend/
cp .dfx/local/canisters/evote_backend/evote_backend.did.js src/evote_frontend/src/declarations/evote_backend/
```

## Project Structure

```
/
├── src/
│   ├── evote_backend/         # Rust canister code
│   │   ├── src/
│   │   │   └── lib.rs         # Backend implementation
│   │   └── evote_backend.did  # Candid interface
│   └── evote_frontend/        # React frontend
│       ├── assets/
│       │   └── main.css
│       └── src/
│           ├── components/    # React components
│           ├── pages/         # React pages
│           └── index.js       # Entry point
├── dfx.json                   # DFX configuration
├── package.json               # NPM configuration
└── webpack.config.js          # Webpack configuration
```

## License

This project is licensed under the MIT License.
