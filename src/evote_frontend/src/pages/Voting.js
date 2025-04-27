import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Voting.css';

// New category mapping object
const CATEGORY_INFO = {
  'Infrastructure': { icon: 'fa-road', color: '#3b82f6' },
  'Education': { icon: 'fa-graduation-cap', color: '#10b981' },
  'Environment': { icon: 'fa-leaf', color: '#84cc16' },
  'Safety': { icon: 'fa-shield-alt', color: '#ef4444' },
  'Community Events': { icon: 'fa-calendar-alt', color: '#8b5cf6' },
  'General': { icon: 'fa-tag', color: '#6b7280' }
};

const Voting = () => {
  const { dao, isAuthenticated, login, user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [voteChoice, setVoteChoice] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voteHistory, setVoteHistory] = useState([]);
  const [voteStats, setVoteStats] = useState({
    totalVotes: 0,
    proposalsVoted: 0,
    impact: 0
  });
  const [activeTab, setActiveTab] = useState('active');
  const [expandedDescription, setExpandedDescription] = useState(false);
  
  // Community stats for visualization
  const communityStats = {
    totalVoters: 842,
    proposalsPassed: 37,
    currentlyVoting: 156,
    averageParticipation: 68
  };
  
  // Fetch proposals and voting history
  useEffect(() => {
    const fetchProposals = async () => {
      setIsLoading(true);
      try {
        let activeProposals = [];
        let pastVotes = [];
        
        if (dao && isAuthenticated) {
          activeProposals = await dao.getActiveProposals();
          // We would fetch vote history here from the DAO
        } else {
          // Mock data
          activeProposals = generateMockProposals(6);
          pastVotes = generateMockVoteHistory(8);
        }
        
        setProposals(activeProposals);
        setVoteHistory(pastVotes);
        
        if (activeProposals.length > 0 && !selectedProposal) {
          setSelectedProposal(activeProposals[0]);
        }
        
        // Calculate voting stats
        setVoteStats({
          totalVotes: pastVotes.length,
          proposalsVoted: new Set(pastVotes.map(v => v.proposalId)).size,
          impact: Math.floor(Math.random() * 30) + 40 // 40-70% mock impact score
        });
      } catch (error) {
        console.error("Error fetching voting data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProposals();
  }, [dao, isAuthenticated]);
  
  // Handle proposal selection
  const handleProposalSelect = (proposal) => {
    setSelectedProposal(proposal);
    setVoteChoice('');
  };
  
  // Handle vote submission
  const handleVoteSubmit = async () => {
    if (!isAuthenticated) {
      try {
        const loginSuccess = await login();
        if (!loginSuccess) {
          showNotification('Login required to vote', 'warning');
          return;
        }
        // If login succeeds, don't immediately vote - let the user confirm their choice
        showNotification('You are now logged in. Please confirm your vote.', 'success');
        return;
      } catch (error) {
        return;
      }
    }
    
    if (!voteChoice) {
      showNotification('Please select a voting option', 'warning');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Vote through DAO if available
      if (dao && selectedProposal) {
        await dao.castVote(
          selectedProposal.id,
          voteChoice === 'for',
          user?.id
        );
      }
      
      // Update UI optimistically
      const updatedProposal = { ...selectedProposal };
      if (voteChoice === 'for') {
        updatedProposal.votesFor += 1;
      } else {
        updatedProposal.votesAgainst += 1;
      }
      
      // Update proposals list
      setProposals(proposals.map(p => 
        p.id === selectedProposal.id ? updatedProposal : p
      ));
      setSelectedProposal(updatedProposal);
      
      // Add to vote history
      const newVote = {
        id: Date.now(),
        proposalId: selectedProposal.id,
        proposalTitle: selectedProposal.title,
        choice: voteChoice,
        timestamp: Date.now()
      };
      setVoteHistory([newVote, ...voteHistory]);
      
      // Update stats
      setVoteStats({
        totalVotes: voteStats.totalVotes + 1,
        proposalsVoted: new Set([...voteHistory.map(v => v.proposalId), selectedProposal.id]).size,
        impact: Math.min(voteStats.impact + 2, 100) // Increment impact score
      });
      
      // Show success message
      showNotification('Vote cast successfully!');
      
      // Reset vote choice
      setVoteChoice('');
    } catch (error) {
      console.error("Error casting vote:", error);
      showNotification('Failed to cast vote. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Format date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Format time
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  
  // Calculate time remaining
  const getTimeRemaining = (deadline) => {
    const now = Date.now();
    const remaining = deadline - now;
    
    if (remaining <= 0) return 'Voting closed';
    
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h remaining`;
    } else {
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m remaining`;
    }
  };
  
  // Show notification
  const showNotification = (message, type = 'success') => {
    // This would be replaced with a proper notification system
    if (type === 'warning') {
      alert(`⚠️ ${message}`);
    } else if (type === 'error') {
      alert(`❌ ${message}`);
    } else {
      alert(`✅ ${message}`);
    }
  };
  
  // Mock data generators
  const generateMockProposals = (count) => {
    const proposals = [];
    const titles = [
      "Community Park Renovation",
      "Public Library Expansion",
      "Traffic Management System",
      "Clean Energy Initiative",
      "Youth Education Program",
      "Street Lighting Upgrade"
    ];
    
    for (let i = 0; i < count; i++) {
      const daysRemaining = Math.floor(Math.random() * 14) + 1;
      proposals.push({
        id: i + 1,
        title: titles[i % titles.length] + (i >= titles.length ? ` ${Math.floor(i/titles.length) + 1}` : ''),
        description: `This proposal aims to improve the community through a collaborative effort. We believe this initiative will have significant positive impact.`,
        deadline: Date.now() + (daysRemaining * 24 * 60 * 60 * 1000),
        votesFor: Math.floor(Math.random() * 100) + 10,
        votesAgainst: Math.floor(Math.random() * 50) + 5,
        status: 'Active',
        submitter: 'Community Member',
        submittedAt: Date.now() - (Math.floor(Math.random() * 10) + 1) * 24 * 60 * 60 * 1000,
        category: ['Infrastructure', 'Education', 'Environment', 'Safety'][Math.floor(Math.random() * 4)]
      });
    }
    
    return proposals;
  };
  
  const generateMockVoteHistory = (count) => {
    const history = [];
    const proposalTitles = [
      "Bike Lane Implementation",
      "Community Garden Project",
      "Recycling Program Enhancement",
      "Local Business Support Fund",
      "Historical Building Preservation",
      "Public Transit Improvement"
    ];
    
    for (let i = 0; i < count; i++) {
      const daysAgo = Math.floor(Math.random() * 30) + 1;
      history.push({
        id: count - i,
        proposalId: 100 + i,
        proposalTitle: proposalTitles[i % proposalTitles.length] + (i >= proposalTitles.length ? ` ${Math.floor(i/proposalTitles.length) + 1}` : ''),
        choice: Math.random() > 0.3 ? 'for' : 'against', // 70% for, 30% against
        timestamp: Date.now() - (daysAgo * 24 * 60 * 60 * 1000),
        outcome: Math.random() > 0.2 ? 'passed' : 'failed' // 80% passed, 20% failed
      });
    }
    
    return history;
  };

  // Get category icon and color
  const getCategoryInfo = (category) => {
    return CATEGORY_INFO[category] || CATEGORY_INFO['General'];
  };

  // Toggle description expansion
  const toggleDescription = () => {
    setExpandedDescription(!expandedDescription);
  };
  
  // When proposal changes, reset expanded state
  useEffect(() => {
    setExpandedDescription(false);
  }, [selectedProposal?.id]);
  
  return (
    <div className="voting-container">
      {/* Hero Banner */}
      <div className="voting-hero">
        <div className="hero-text">
          <h1>Vote on Proposals</h1>
          <p>Shape the future of your community through secure decentralized voting</p>
        </div>
        
        <div className="community-stats">
          <div className="stat-item">
            <div className="stat-value">{communityStats.totalVoters}</div>
            <div className="stat-label">Active Voters</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-value">{communityStats.proposalsPassed}</div>
            <div className="stat-label">Proposals Passed</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-value">{communityStats.currentlyVoting}</div>
            <div className="stat-label">Currently Voting</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-value">{communityStats.averageParticipation}%</div>
            <div className="stat-label">Participation</div>
          </div>
        </div>
      </div>
      
      {/* Connect Prompt */}
      {!isAuthenticated && !selectedProposal && (
        <div className="connect-prompt">
          <div className="prompt-icon"><i className="fas fa-lock"></i></div>
          <div className="prompt-content">
            <h3>Authentication Required</h3>
            <p>Please connect your account to participate in voting</p>
            <button className="btn btn-auth" onClick={login}>
              <i className="fas fa-plug"></i> Connect to Vote
            </button>
          </div>
        </div>
      )}
      
      {/* Main Voting Interface Layout - Fixed Structure */}
      <div className="voting-layout">
        {/* Left Column - Proposals List */}
        <div className="proposals-column">
          <div className="proposals-tabs">
            <button 
              className={`tab ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              <i className="fas fa-clock"></i> Active Proposals
            </button>
            <button 
              className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              <i className="fas fa-check-circle"></i> Past Proposals
            </button>
          </div>
          
          <div className="proposals-list-container">
            {isLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading proposals...</p>
              </div>
            ) : (
              <div className="proposals-list">
                {activeTab === 'active' ? (
                  proposals.length > 0 ? (
                    proposals.map(proposal => {
                      const categoryInfo = getCategoryInfo(proposal.category);
                      return (
                        <div 
                          key={proposal.id}
                          className={`proposal-list-item ${selectedProposal?.id === proposal.id ? 'selected' : ''}`}
                          onClick={() => handleProposalSelect(proposal)}
                        >
                          <div className="proposal-category-indicator" style={{ backgroundColor: categoryInfo.color }}></div>
                          <div className="proposal-list-content">
                            <h3>{proposal.title}</h3>
                            <div className="proposal-list-meta">
                              <span className="category-indicator" style={{ color: categoryInfo.color }}>
                                <i className={`fas ${categoryInfo.icon}`}></i> 
                                {proposal.category}
                              </span>
                              <span className="time-remaining">{getTimeRemaining(proposal.deadline)}</span>
                            </div>
                          </div>
                          <div className="proposal-list-arrow">
                            <i className="fas fa-chevron-right"></i>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="empty-state">
                      <i className="fas fa-ballot"></i>
                      <p>No active proposals found</p>
                    </div>
                  )
                ) : (
                  <div className="past-proposals-list">
                    {voteHistory.length > 0 ? (
                      voteHistory.map(vote => (
                        <div 
                          key={vote.id}
                          className="proposal-list-item past"
                        >
                          <div className="proposal-list-content">
                            <h3>{vote.proposalTitle}</h3>
                            <div className="proposal-list-meta">
                              <span className={`vote-indicator ${vote.outcome}`}>
                                {vote.outcome === 'passed' ? 'Passed' : 'Failed'}
                              </span>
                              <span className="vote-date">{formatDate(vote.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">
                        <i className="fas fa-history"></i>
                        <p>No voting history found</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column - Voting Interface */}
        <div className="voting-column">
          {selectedProposal ? (
            <>
              <div className="proposal-details">
                <div className="proposal-header">
                  <h2 className="proposal-title">{selectedProposal.title}</h2>
                  <div className="proposal-status">
                    <span className="status-badge">
                      <i className="fas fa-circle"></i> {selectedProposal.status || 'Active'}
                    </span>
                  </div>
                </div>
                
                <div className="proposal-badges">
                  <span className="category-badge">
                    <i className={`fas ${getCategoryInfo(selectedProposal.category).icon}`}></i>
                    {selectedProposal.category || 'General'}
                  </span>
                  
                  <span className="deadline-badge">
                    <i className="fas fa-clock"></i>
                    {getTimeRemaining(selectedProposal.deadline)}
                  </span>
                </div>
                
                <div className={`proposal-description-container ${expandedDescription ? 'expanded' : ''}`}>
                  <p className="proposal-description">{selectedProposal.description}</p>
                  
                  {selectedProposal.description && selectedProposal.description.length > 150 && (
                    <button 
                      className="read-more-btn" 
                      onClick={toggleDescription}
                    >
                      {expandedDescription ? 'Show Less' : 'Read More'} <i className="fas fa-chevron-down"></i>
                    </button>
                  )}
                </div>
                
                <div className="proposal-meta-info">
                  <div className="meta-header">
                    <i className="fas fa-info-circle"></i> Proposal Information
                  </div>
                  <div className="meta-grid">
                    <div className="meta-item">
                      <div className="meta-label">Submitted by</div>
                      <div className="meta-value">
                        <i className="fas fa-user"></i> {selectedProposal.submitter}
                      </div>
                    </div>
                    
                    <div className="meta-item">
                      <div className="meta-label">Submission Date</div>
                      <div className="meta-value">
                        <i className="fas fa-calendar-alt"></i> {formatDate(selectedProposal.submittedAt)}
                      </div>
                    </div>
                    
                    <div className="meta-item">
                      <div className="meta-label">Voting Deadline</div>
                      <div className="meta-value">
                        <i className="fas fa-hourglass-end"></i> {formatDate(selectedProposal.deadline)}
                      </div>
                    </div>
                    
                    <div className="meta-item">
                      <div className="meta-label">Total Votes</div>
                      <div className="meta-value">
                        <i className="fas fa-vote-yea"></i> {selectedProposal.votesFor + selectedProposal.votesAgainst}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="vote-distribution">
                  <h3>Current Voting Results</h3>
                  <div className="vote-result">
                    <div className="result-label for">For</div>
                    <div className="result-bar">
                      <div 
                        className="result-progress for" 
                        style={{ 
                          width: `${(selectedProposal.votesFor / (selectedProposal.votesFor + selectedProposal.votesAgainst || 1)) * 100}%` 
                        }}
                      ></div>
                      <div 
                        className="result-progress against" 
                        style={{ 
                          width: `${(selectedProposal.votesAgainst / (selectedProposal.votesFor + selectedProposal.votesAgainst || 1)) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <div className="result-label against">Against</div>
                  </div>
                  
                  <div className="vote-counts">
                    <div className="vote-count for">
                      <strong>{selectedProposal.votesFor}</strong> votes for
                    </div>
                    <div className="vote-count against">
                      <strong>{selectedProposal.votesAgainst}</strong> votes against
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="voting-controls">
                <h3>Cast Your Vote</h3>
                
                {isAuthenticated ? (
                  <>
                    <div className="vote-options">
                      <label 
                        className={`vote-option ${voteChoice === 'for' ? 'selected' : ''}`}
                      >
                        <input 
                          type="radio" 
                          name="vote" 
                          value="for"
                          checked={voteChoice === 'for'}
                          onChange={() => setVoteChoice('for')}
                        />
                        <div className="option-content">
                          <div className="option-icon for">
                            <i className="fas fa-thumbs-up"></i>
                          </div>
                          <div className="option-text">
                            <strong>Vote For</strong>
                            <span>Support this proposal</span>
                          </div>
                        </div>
                      </label>
                      
                      <label 
                        className={`vote-option ${voteChoice === 'against' ? 'selected' : ''}`}
                      >
                        <input 
                          type="radio" 
                          name="vote" 
                          value="against"
                          checked={voteChoice === 'against'}
                          onChange={() => setVoteChoice('against')}
                        />
                        <div className="option-content">
                          <div className="option-icon against">
                            <i className="fas fa-thumbs-down"></i>
                          </div>
                          <div className="option-text">
                            <strong>Vote Against</strong>
                            <span>Oppose this proposal</span>
                          </div>
                        </div>
                      </label>
                    </div>
                    
                    <button 
                      className="submit-vote-btn"
                      disabled={!voteChoice || isSubmitting}
                      onClick={handleVoteSubmit}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="spinner-small"></div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-vote-yea"></i>
                          <span>Submit Vote</span>
                        </>
                      )}
                    </button>
                    
                    <div className="vote-note">
                      <i className="fas fa-info-circle"></i>
                      <span>All votes are recorded on the blockchain and cannot be changed once submitted.</span>
                    </div>
                  </>
                ) : (
                  <div className="voting-login-prompt">
                    <p>You need to be logged in to cast a vote on this proposal</p>
                    <button className="login-btn" onClick={login}>
                      <i className="fas fa-sign-in-alt"></i> Login to Continue
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="empty-interface">
              <div className="empty-illustration">
                <i className="fas fa-vote-yea"></i>
              </div>
              <h3>Select a Proposal to Vote</h3>
              <p>Choose an active proposal from the list to review details and cast your vote.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* User Voting Stats & History */}
      {isAuthenticated && (
        <div className="voting-history-section">
          <h2 className="history-title">Your Voting History</h2>
          
          <div className="voting-stats-cards">
            <div className="stats-card">
              <div className="stats-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stats-content">
                <div className="stats-value">{voteStats.totalVotes}</div>
                <div className="stats-label">Total Votes Cast</div>
              </div>
            </div>
            
            <div className="stats-card">
              <div className="stats-icon">
                <i className="fas fa-clipboard-list"></i>
              </div>
              <div className="stats-content">
                <div className="stats-value">{voteStats.proposalsVoted}</div>
                <div className="stats-label">Proposals Voted</div>
              </div>
            </div>
            
            <div className="stats-card">
              <div className="stats-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="stats-content">
                <div className="stats-value">{voteStats.impact}%</div>
                <div className="stats-label">Community Impact</div>
              </div>
            </div>
          </div>
          
          <div className="history-table-container">
            <h3>Recent Votes</h3>
            
            {voteHistory.length > 0 ? (
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Proposal</th>
                    <th>Vote</th>
                    <th>Date</th>
                    <th>Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {voteHistory.map(vote => (
                    <tr key={vote.id}>
                      <td>{vote.proposalTitle}</td>
                      <td>
                        <span className={`vote-badge ${vote.choice}`}>
                          {vote.choice === 'for' ? (
                            <><i className="fas fa-thumbs-up"></i> For</>
                          ) : (
                            <><i className="fas fa-thumbs-down"></i> Against</>
                          )}
                        </span>
                      </td>
                      <td>{formatDate(vote.timestamp)} at {formatTime(vote.timestamp)}</td>
                      <td>
                        <span className={`outcome-badge ${vote.outcome}`}>
                          {vote.outcome === 'passed' ? (
                            <><i className="fas fa-check"></i> Passed</>
                          ) : (
                            <><i className="fas fa-times"></i> Failed</>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-history">
                <i className="fas fa-history"></i>
                <p>You haven't cast any votes yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Voting;
