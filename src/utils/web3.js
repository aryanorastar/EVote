import { ethers } from 'ethers';

// ABI for the EVote governance contract
const contractABI = [
  // This would be the actual ABI from your compiled contract
  // The following is a simplified example
  {
    "inputs": [],
    "name": "getActiveProposals",
    "outputs": [{"components": [
      {"name": "id", "type": "uint256"},
      {"name": "title", "type": "string"},
      {"name": "description", "type": "string"},
      {"name": "deadline", "type": "uint256"},
      {"name": "votesFor", "type": "uint256"},
      {"name": "votesAgainst", "type": "uint256"},
      {"name": "executed", "type": "bool"}
    ], "name": "proposals", "type": "tuple[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "proposalId", "type": "uint256"}, {"name": "support", "type": "bool"}],
    "name": "castVote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "title", "type": "string"}, {"name": "description", "type": "string"}, {"name": "durationInDays", "type": "uint256"}],
    "name": "createProposal",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Contract address would be the deployed governance contract
const contractAddress = "0x123..."; // Placeholder for the actual contract address

// Connect to provider and contract
const getContract = async () => {
  if (window.ethereum) {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
  } else {
    throw new Error("Ethereum provider not found. Please install MetaMask.");
  }
};

// Get all active proposals
export const getActiveProposals = async () => {
  try {
    const contract = await getContract();
    const proposals = await contract.getActiveProposals();
    return proposals;
  } catch (error) {
    console.error("Error fetching active proposals:", error);
    return [];
  }
};

// Cast a vote on a proposal
export const castVote = async (proposalId, support) => {
  try {
    const contract = await getContract();
    const tx = await contract.castVote(proposalId, support);
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Error casting vote:", error);
    return false;
  }
};

// Create a new proposal
export const createProposal = async (title, description, durationInDays) => {
  try {
    const contract = await getContract();
    const tx = await contract.createProposal(title, description, durationInDays);
    const receipt = await tx.wait();
    // Extract the proposal ID from event logs or return value
    return receipt;
  } catch (error) {
    console.error("Error creating proposal:", error);
    throw error;
  }
};

// Check if wallet is connected
export const isWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      return accounts.length > 0;
    } catch (error) {
      console.error("Error checking wallet connection:", error);
      return false;
    }
  }
  return false;
};

// Connect wallet
export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      return true;
    } catch (error) {
      console.error("Error connecting wallet:", error);
      return false;
    }
  } else {
    alert("MetaMask is not installed. Please install it to use this dApp.");
    return false;
  }
};

// Get current account
export const getCurrentAccount = async () => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      return accounts[0];
    } catch (error) {
      console.error("Error getting current account:", error);
      return null;
    }
  }
  return null;
};
