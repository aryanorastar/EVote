use crate::{create_proposal, CreateProposalArgs};
use ic_cdk::api::management_canister::main::{CanisterId, CanisterIdRecord};
use ic_cdk_macros::*;

#[post_upgrade]
fn post_upgrade() {
    // Add sample proposals after upgrade
    initialize_sample_data();
}

#[init]
fn init() {
    // Initialize with sample data
    initialize_sample_data();
}

fn initialize_sample_data() {
    // Only for development purposes
    #[cfg(debug_assertions)]
    {
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

        let _ = create_proposal(CreateProposalArgs {
            title: "Public Library Expansion".to_string(),
            description: "Proposal to expand the public library with a new digital learning center and additional study areas.".to_string(),
            duration_in_days: 10,
        });
    }
}
