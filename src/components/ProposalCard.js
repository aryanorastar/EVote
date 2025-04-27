import React, { useState } from 'react';
import './ProposalCard.css';
import { useWeb3 } from '../context/Web3Context';
import { castVote } from '../utils/web3';

function ProposalCard({ proposal }) {
  const { id, title, description, deadline, votesFor, votesAgainst, status } = proposal;
  const [isVoting, setIsVoting] = useState(false);
  const [localVotes, setLocalVotes] = useState({ for: votesFor, against: votesAgainst });
  const { isConnected, connect } = useWeb3();

  const handleVote = async (support) => {
    if (!isConnected) {
      const connected = await connect();
      if (!connected) return;
    }

    try {
      setIsVoting(true);
      const success = await castVote(id, support);
      
      if (success) {
        // Update UI with the new vote
        setLocalVotes(prev => ({
          ...prev,
          [support ? 'for' : 'against']: prev[support ? 'for' : 'against'] + 1
        }));
      } else {
        alert("Failed to cast vote. Please try again.");
      }
    } catch (error) {
      console.error("Error voting:", error);
      alert("An error occurred while voting. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };

  const getTimeRemaining = () => {
    const totalSeconds = Math.floor((deadline - Date.now()) / 1000);
    
    if (totalSeconds <= 0) return 'Voting closed';
    
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    
    return `${days}d ${hours}h remaining`;
  };

  const totalVotes = localVotes.for + localVotes.against || 1; // Avoid division by zero
  const forPercentage = (localVotes.for / totalVotes) * 100;

  return (
    <div className="proposal-card">
      <div className="proposal-header">
        <h3>{title}</h3>
        <span className={`status ${status?.toLowerCase() || 'active'}`}>{status || 'Active'}</span>
      </div>
      <p className="proposal-description">{description}</p>
      <div className="proposal-meta">
        <span className="deadline">{getTimeRemaining()}</span>
      </div>
      <div className="voting-stats">
        <div className="votes-container">
          <div className="vote-bar">
            <div 
              className="votes-for" 
              style={{ width: `${forPercentage}%` }}
            ></div>
          </div>
          <div className="vote-counts">
            <span className="for">For: {localVotes.for}</span>
            <span className="against">Against: {localVotes.against}</span>
          </div>
        </div>
      </div>
      <div className="proposal-actions">
        <button 
          className="vote-button for" 
          onClick={() => handleVote(true)}
          disabled={isVoting}
        >
          {isVoting ? 'Voting...' : 'Vote For'}
        </button>
        <button 
          className="vote-button against" 
          onClick={() => handleVote(false)}
          disabled={isVoting}
        >
          {isVoting ? 'Voting...' : 'Vote Against'}
        </button>
      </div>
    </div>
  );
}

export default ProposalCard;
