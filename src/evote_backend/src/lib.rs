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

// Removed the problematic export_candid macro
