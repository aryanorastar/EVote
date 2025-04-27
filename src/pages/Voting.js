import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Voting.css';
import { useWeb3 } from '../context/Web3Context';
import { getActiveProposals, castVote } from '../utils/web3';
import LoadingSpinner from '../components/LoadingSpinner';

function Voting() {
  const [activeProposals, setActiveProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [voteChoice, setVoteChoice] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const { isConnected, connect } = useWeb3();

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setIsLoading(true);
        const fetchedProposals = await getActiveProposals();
        
        // If we have real data, use it. Otherwise, fall back to mock data.
        if (fetchedProposals.length > 0) {
          setActiveProposals(fetchedProposals);
        } else {
          // Mock data for testing/development
          setActiveProposals([
            {
              id: 1,
              title: "Community Park Renovation",
              description: "Proposal to allocate funds for renovating the central community park with new playground equipment and green spaces.",
              deadline: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
              votesFor: 120,
              votesAgainst: 45
            },
            {
              id: 2,
              title: "Traffic Reduction Plan",
              description: "Implementation of a new traffic management system to reduce congestion during peak hours in the downtown area.",
              deadline: Date.now() + 5 * 24 * 60 * 60 * 1000, // 5 days from now
              votesFor: 89,
              votesAgainst: 32
            },
            {
              id: 3,
              title: "Public Library Expansion",
              description: "Proposal to expand the public library with a new digital learning center and additional study areas.",
              deadline: Date.now() + 10 * 24 * 60 * 60 * 1000, // 10 days from now
              votesFor: 56,
              votesAgainst: 12
            }
          ]);
        }
      } catch (error) {
        console.error("Error fetching proposals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProposals();
  }, []);

  const handleProposalSelect = (proposal) => {
    setSelectedProposal(proposal);
    setVoteChoice('');
  };

  const handleVoteChoiceChange = (choice) => {
    setVoteChoice(choice);
  };

  const handleVoteSubmit = async () => {
    if (!isConnected) {
      const connected = await connect();
      if (!connected) {
        alert('Please connect your wallet to vote.');
        return;
      }
    }
    
    if (!voteChoice) {
      alert('Please select a voting option.');
      return;
    }

    try {
      setIsVoting(true);
      
      // Cast vote on blockchain
      const success = await castVote(selectedProposal.id, voteChoice === 'for');
      
      if (success) {
        // Update local state for immediate UI feedback
        const updatedProposals = activeProposals.map(proposal => {
          if (proposal.id === selectedProposal.id) {
            if (voteChoice === 'for') {
              return { ...proposal, votesFor: proposal.votesFor + 1 };
            } else {
              return { ...proposal, votesAgainst: proposal.votesAgainst + 1 };
            }
          }
          return proposal;
        });

        setActiveProposals(updatedProposals);
        
        // Update the selected proposal as well
        const updatedSelectedProposal = updatedProposals.find(
          proposal => proposal.id === selectedProposal.id
        );
        setSelectedProposal(updatedSelectedProposal);
        
        alert('Your vote has been recorded!');
        setVoteChoice('');
      } else {
        alert('Failed to record your vote. Please try again.');
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
      alert('There was an error submitting your vote. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };

  const getTimeRemaining = (deadline) => {
    const totalSeconds = Math.floor((deadline - Date.now()) / 1000);
    
    if (totalSeconds <= 0) return 'Voting closed';
    
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    
    return `${days}d ${hours}h ${t('voting.remaining')}`;
  };

  return (
    <div className="voting-page">
      <h1>{t('voting.title')}</h1>
      
      {!isConnected && (
        <div className="wallet-notice">
          <p>{t('voting.connectWalletNotice')}</p>
          <button className="connect-wallet-btn" onClick={connect}>{t('voting.connectWallet')}</button>
        </div>
      )}

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="voting-container">
          <div className="proposals-list">
            <h2>{t('voting.activeProposals')}</h2>
            {activeProposals.length > 0 ? (
              <ul>
                {activeProposals.map(proposal => (
                  <li 
                    key={proposal.id} 
                    className={selectedProposal && selectedProposal.id === proposal.id ? 'selected' : ''}
                    onClick={() => handleProposalSelect(proposal)}
                  >
                    <h3>{proposal.title}</h3>
                    <p className="time-remaining">{getTimeRemaining(proposal.deadline)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-proposals">{t('voting.noProposals')}</p>
            )}
          </div>

          <div className="voting-details">
            {selectedProposal ? (
              <>
                <div className="proposal-details">
                  <h2>{selectedProposal.title}</h2>
                  <p className="proposal-description">{selectedProposal.description}</p>
                  <div className="proposal-stats">
                    <div className="stats-item">
                      <span className="label">{t('voting.deadline')}:</span>
                      <span className="value">{new Date(selectedProposal.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="stats-item">
                      <span className="label">{t('voting.timeRemaining')}:</span>
                      <span className="value">{getTimeRemaining(selectedProposal.deadline)}</span>
                    </div>
                  </div>

                  <div className="vote-distribution">
                    <h3>{t('voting.currentVotes')}</h3>
                    <div className="vote-bar">
                      <div 
                        className="votes-for" 
                        style={{ 
                          width: `${(selectedProposal.votesFor / (selectedProposal.votesFor + selectedProposal.votesAgainst || 1)) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <div className="vote-counts">
                      <span>{t('voting.for')}: {selectedProposal.votesFor}</span>
                      <span>{t('voting.against')}: {selectedProposal.votesAgainst}</span>
                    </div>
                  </div>
                </div>

                <div className="voting-actions">
                  <h3>{t('voting.castVote')}</h3>
                  <div className="vote-options">
                    <label className={`vote-option ${voteChoice === 'for' ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name="vote" 
                        value="for" 
                        checked={voteChoice === 'for'} 
                        onChange={() => handleVoteChoiceChange('for')} 
                      />
                      <span className="option-text">{t('voting.voteFor')}</span>
                    </label>
                    <label className={`vote-option ${voteChoice === 'against' ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name="vote" 
                        value="against" 
                        checked={voteChoice === 'against'} 
                        onChange={() => handleVoteChoiceChange('against')} 
                      />
                      <span className="option-text">{t('voting.voteAgainst')}</span>
                    </label>
                  </div>
                  <button 
                    className="vote-submit-btn" 
                    onClick={handleVoteSubmit}
                    disabled={!isConnected || !voteChoice || isVoting}
                  >
                    {isVoting ? t('voting.submittingVote') : t('voting.submitVote')}
                  </button>
                </div>
              </>
            ) : (
              <div className="no-selection">
                <p>{t('voting.selectProposal')}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Voting;
