// Mock implementation of the DAO backend
export default class MockDAO {
  constructor() {
    // Try to load any previously saved proposals from localStorage
    try {
      const savedProposals = localStorage.getItem('evote_proposals');
      this.proposals = savedProposals ? JSON.parse(savedProposals) : [];
    } catch (e) {
      console.error("Error loading saved proposals:", e);
      this.proposals = [];
    }
    
    // If no proposals exist yet, create some demo proposals
    if (this.proposals.length === 0) {
      this.proposals = [
        {
          id: 1,
          title: "Community Park Renovation",
          description: "Proposal to allocate funds for renovating the central community park with new playground equipment and green spaces.",
          deadline: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
          votesFor: 120,
          votesAgainst: 45,
          status: "Active",
          creator: "Demo User"
        },
        {
          id: 2,
          title: "Traffic Reduction Plan",
          description: "Implementation of a new traffic management system to reduce congestion during peak hours in the downtown area.",
          deadline: Date.now() + 5 * 24 * 60 * 60 * 1000, // 5 days from now
          votesFor: 89,
          votesAgainst: 32,
          status: "Active",
          creator: "Demo User"
        },
        {
          id: 3,
          title: "Public Library Expansion",
          description: "Proposal to expand the public library with a new digital learning center and additional study areas.",
          deadline: Date.now() + 10 * 24 * 60 * 60 * 1000, // 10 days from now
          votesFor: 56,
          votesAgainst: 12,
          status: "Active",
          creator: "Demo User"
        }
      ];
      this._saveProposals();
    }
    
    // Track user votes (in a real app, this would be on the blockchain)
    this.userVotes = new Map();
  }
  
  // Save proposals to localStorage
  _saveProposals() {
    try {
      localStorage.setItem('evote_proposals', JSON.stringify(this.proposals));
    } catch (e) {
      console.error("Error saving proposals:", e);
    }
  }
  
  // Get active proposals
  async getActiveProposals() {
    const now = Date.now();
    return this.proposals.filter(p => p.deadline > now && p.status === "Active");
  }
  
  // Get a proposal by ID
  async getProposal(id) {
    return this.proposals.find(p => p.id === id) || null;
  }
  
  // Create a new proposal
  async createProposal(title, description, durationInDays) {
    const newId = this.proposals.length > 0 
      ? Math.max(...this.proposals.map(p => p.id)) + 1 
      : 1;
      
    const newProposal = {
      id: newId,
      title,
      description,
      deadline: Date.now() + (durationInDays * 24 * 60 * 60 * 1000),
      votesFor: 0,
      votesAgainst: 0,
      status: "Active",
      creator: "Current User" // In a real app, this would be the authenticated user
    };
    
    this.proposals.push(newProposal);
    this._saveProposals();
    
    return newId;
  }
  
  // Cast a vote
  async castVote(proposalId, isSupport, userId = "current-user") {
    const proposal = this.proposals.find(p => p.id === proposalId);
    if (!proposal) return false;
    
    // Check if deadline passed
    if (proposal.deadline < Date.now()) return false;
    
    // Check if user already voted
    const voteKey = `${proposalId}-${userId}`;
    if (this.userVotes.has(voteKey)) return false;
    
    // Record vote
    if (isSupport) {
      proposal.votesFor += 1;
    } else {
      proposal.votesAgainst += 1;
    }
    
    this.userVotes.set(voteKey, isSupport);
    this._saveProposals();
    
    return true;
  }
  
  // Check if user has voted
  hasVoted(proposalId, userId = "current-user") {
    return this.userVotes.has(`${proposalId}-${userId}`);
  }
}
