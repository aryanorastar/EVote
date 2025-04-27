#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Building and deploying EVote project...${NC}"

# Make sure dfx is running
if ! dfx ping &>/dev/null; then
    echo -e "${RED}DFX is not running. Starting dfx...${NC}"
    dfx start --background
    sleep 5
fi

# Ask if we should clean and recreate the canisters
read -p "Do you want to clean and recreate the canisters? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Cleaning up existing canisters...${NC}"
    # Remove local dfx state
    rm -rf .dfx
    # Recreate dfx directories
    mkdir -p .dfx/local
fi

# Check if the directory structure is correct for the backend
if [ ! -d "src/evote_backend/src" ]; then
    echo -e "${RED}Creating backend directory structure...${NC}"
    mkdir -p src/evote_backend/src
fi

# Check if Cargo.toml exists, if not create it
if [ ! -f "src/evote_backend/Cargo.toml" ]; then
    echo -e "${RED}Creating Cargo.toml...${NC}"
    cat > src/evote_backend/Cargo.toml << EOL
[package]
name = "evote_backend"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
candid = "0.8.4"
ic-cdk = "0.7.4"
ic-cdk-macros = "0.6.10"
serde = "1.0.152"
EOL
fi

# Check if lib.rs exists, if not create it
if [ ! -f "src/evote_backend/src/lib.rs" ]; then
    echo -e "${RED}Creating lib.rs...${NC}"
    cat > src/evote_backend/src/lib.rs << EOL
use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::time;
use ic_cdk_macros::*;
use std::cell::RefCell;
use std::collections::HashMap;

// Define data structures
#[derive(CandidType, Deserialize, Clone)]
pub struct Proposal {
    pub id: u64,
    pub title: String,
    pub description: String,
    pub deadline: u64, // Timestamp in nanoseconds
    pub votes_for: u64,
    pub votes_against: u64,
    pub status: String,
    pub creator: Principal,
}

#[derive(CandidType, Deserialize)]
pub struct CreateProposalArgs {
    pub title: String,
    pub description: String,
    pub duration_in_days: u64,
}

#[derive(CandidType, Deserialize)]
pub struct VoteArgs {
    pub proposal_id: u64,
    pub support: bool,
}

// State management
thread_local! {
    static PROPOSALS: RefCell<HashMap<u64, Proposal>> = RefCell::new(HashMap::new());
    static NEXT_PROPOSAL_ID: RefCell<u64> = RefCell::new(1);
    static VOTES: RefCell<HashMap<(u64, Principal), bool>> = RefCell::new(HashMap::new());
}

// Create a new proposal
#[update]
fn create_proposal(args: CreateProposalArgs) -> u64 {
    let caller = ic_cdk::caller();
    
    // Calculate deadline in nanoseconds
    let deadline = time() + (args.duration_in_days * 24 * 60 * 60 * 1_000_000_000);
    
    // Get next proposal ID
    let proposal_id = NEXT_PROPOSAL_ID.with(|id| {
        let current_id = *id.borrow();
        *id.borrow_mut() = current_id + 1;
        current_id
    });
    
    // Create the proposal
    let proposal = Proposal {
        id: proposal_id,
        title: args.title,
        description: args.description,
        deadline,
        votes_for: 0,
        votes_against: 0,
        status: "Active".to_string(),
        creator: caller,
    };
    
    // Store the proposal
    PROPOSALS.with(|proposals| {
        proposals.borrow_mut().insert(proposal_id, proposal);
    });
    
    proposal_id
}

// Cast a vote on a proposal
#[update]
fn cast_vote(args: VoteArgs) -> bool {
    let caller = ic_cdk::caller();
    let proposal_id = args.proposal_id;
    let support = args.support;
    
    // Check if proposal exists and is active
    let proposal_option = PROPOSALS.with(|proposals| {
        proposals.borrow().get(&proposal_id).cloned()
    });
    
    if let Some(mut proposal) = proposal_option {
        // Check if voting period is over
        if time() > proposal.deadline {
            return false;
        }
        
        // Check if user has already voted
        let has_voted = VOTES.with(|votes| {
            votes.borrow().contains_key(&(proposal_id, caller))
        });
        
        if has_voted {
            return false;
        }
        
        // Record the vote
        if support {
            proposal.votes_for += 1;
        } else {
            proposal.votes_against += 1;
        }
        
        // Update the proposal
        PROPOSALS.with(|proposals| {
            proposals.borrow_mut().insert(proposal_id, proposal);
        });
        
        // Record that this user has voted
        VOTES.with(|votes| {
            votes.borrow_mut().insert((proposal_id, caller), support);
        });
        
        true
    } else {
        false
    }
}

// Get all active proposals
#[query]
fn get_active_proposals() -> Vec<Proposal> {
    let current_time = time();
    
    PROPOSALS.with(|proposals| {
        proposals
            .borrow()
            .values()
            .filter(|p| p.deadline > current_time)
            .cloned()
            .collect()
    })
}

// Get a specific proposal
#[query]
fn get_proposal(proposal_id: u64) -> Option<Proposal> {
    PROPOSALS.with(|proposals| {
        proposals.borrow().get(&proposal_id).cloned()
    })
}

// Check if a user has voted on a proposal
#[query]
fn has_voted(proposal_id: u64, user: Principal) -> bool {
    VOTES.with(|votes| {
        votes.borrow().contains_key(&(proposal_id, user))
    })
}

#[init]
fn init() {
    // Initialize with sample proposals
    let _ = create_proposal(CreateProposalArgs {
        title: "Community Park Renovation".to_string(),
        description: "Proposal to allocate funds for renovating the central community park with new playground equipment and green spaces.".to_string(),
        duration_in_days: 7,
    });

    let _ = create_proposal(CreateProposalArgs {
        title: "Traffic Reduction Plan".to_string(),
        description: "Implementation of a new traffic management system to reduce congestion during peak hours in the downtown area.".to_string(),
        duration_in_days: 5,
    });
}

// For candid interface generation
ic_cdk::export_candid!();
EOL
fi

# Check if the DID file exists, if not create it
if [ ! -f "src/evote_backend/evote_backend.did" ]; then
    echo -e "${RED}Creating DID file...${NC}"
    cat > src/evote_backend/evote_backend.did << EOL
type Proposal = record {
  id: nat64;
  title: text;
  description: text;
  deadline: nat64;
  votesFor: nat64;
  votesAgainst: nat64;
  status: text;
  creator: principal;
};

type CreateProposalArgs = record {
  title: text;
  description: text;
  durationInDays: nat64;
};

type VoteArgs = record {
  proposalId: nat64;
  support: bool;
};

service : {
  "createProposal": (CreateProposalArgs) -> (nat64);
  "castVote": (VoteArgs) -> (bool);
  "getActiveProposals": () -> (vec Proposal) query;
  "getProposal": (nat64) -> (opt Proposal) query;
  "hasVoted": (nat64, principal) -> (bool) query;
}
EOL
fi

# Ensure frontend assets directory exists
mkdir -p src/evote_frontend/assets

# Build and deploy the backend canister
echo -e "${BLUE}Building and deploying backend canister...${NC}"
dfx deploy evote_backend

# Generate candid declarations for frontend
echo -e "${BLUE}Generating declarations for frontend...${NC}"
mkdir -p src/evote_frontend/src/declarations/evote_backend/
dfx generate evote_backend

# If the generation was successful, copy the declarations
if [ -f ".dfx/local/canisters/evote_backend/evote_backend.did.js" ]; then
    cp .dfx/local/canisters/evote_backend/evote_backend.did.js src/evote_frontend/src/declarations/evote_backend/
    echo -e "${GREEN}Declarations copied successfully!${NC}"
else
    echo -e "${RED}Failed to generate declarations. Continuing anyway...${NC}"
fi

# Build and deploy the frontend canister
echo -e "${BLUE}Building and deploying frontend canister...${NC}"
npm run build
dfx deploy evote_frontend

# Print the URLs
echo -e "${GREEN}Deployment complete!${NC}"
echo -e "${BLUE}Access your frontend canister at:${NC}"
FRONTEND_ID=$(dfx canister id evote_frontend)
echo -e "$FRONTEND_ID.localhost:4943"
echo -e "${BLUE}For local development, run:${NC}"
echo -e "npm start"
