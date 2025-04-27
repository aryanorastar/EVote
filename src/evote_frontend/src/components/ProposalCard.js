import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProposalCard.css';
import { useAuth } from '../context/AuthContext';

// Array of placeholder images that match proposal categories
const categoryImages = {
  'Infrastructure': [
    '/images/proposals/infrastructure-1.jpg',
    '/images/proposals/infrastructure-2.jpg',
    '/images/proposals/infrastructure-3.jpg',
  ],
  'Education': [
    '/images/proposals/education-1.jpg',
    '/images/proposals/education-2.jpg',
    '/images/proposals/education-3.jpg',
  ],
  'Environment': [
    '/images/proposals/environment-1.jpg',
    '/images/proposals/environment-2.jpg',
    '/images/proposals/environment-3.jpg',
  ],
  'Safety': [
    '/images/proposals/safety-1.jpg',
    '/images/proposals/safety-2.jpg',
    '/images/proposals/safety-3.jpg',
  ],
  'Community Events': [
    '/images/proposals/events-1.jpg',
    '/images/proposals/events-2.jpg',
    '/images/proposals/events-3.jpg',
  ],
  'General': [
    '/images/proposals/general-1.jpg',
    '/images/proposals/general-2.jpg',
    '/images/proposals/general-3.jpg',
  ]
};

// Fallback image URLs for each category
const fallbackImages = {
  'Infrastructure': 'https://images.unsplash.com/photo-1486325212027-8081e485255e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
  'Education': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
  'Environment': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
  'Safety': 'https://images.unsplash.com/photo-1622037022824-0c71d511ef3c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
  'Community Events': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
  'General': 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
};

// Helper to get image based on proposal details
const getProposalImage = (proposal) => {
  const category = proposal.category || 'General';
  const categoryImageArray = categoryImages[category] || categoryImages.General;
  
  // If the proposal has a specific image, use that
  if (proposal.imageUrl) {
    return proposal.imageUrl;
  }
  
  // Otherwise create a deterministic choice from the available images
  const index = Math.abs(hashString(proposal.title || '') % categoryImageArray.length);
  
  // Try to use local image first, fallback to unsplash if not available
  try {
    return categoryImageArray[index];
  } catch (e) {
    return fallbackImages[category] || fallbackImages.General;
  }
};

// Simple string hash function
const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function ProposalCard({ proposal, featured = false }) {
  const { id, title, description, deadline, votesFor, votesAgainst, status } = proposal;
  const [isVoting, setIsVoting] = useState(false);
  const [localVotes, setLocalVotes] = useState({ 
    for: typeof votesFor === 'number' ? votesFor : Number(votesFor) || 0, 
    against: typeof votesAgainst === 'number' ? votesAgainst : Number(votesAgainst) || 0
  });
  const { isAuthenticated, login, principal, actor } = useAuth();
  const [hasVoted, setHasVoted] = useState(false);
  const [checkingVote, setCheckingVote] = useState(true);

  // Check if the user has already voted on this proposal
  useEffect(() => {
    let cancelled = false;
    const checkVoted = async () => {
      setCheckingVote(true);
      try {
        let voted = false;
        if (actor && principal) {
          // Use backend canister to check if principal has voted
          voted = await actor.hasVoted(BigInt(id), principal);
        }
        if (!cancelled) setHasVoted(voted);
      } catch (e) {
        if (!cancelled) setHasVoted(false);
      } finally {
        if (!cancelled) setCheckingVote(false);
      }
    };
    checkVoted();
    return () => { cancelled = true; };
  }, [id, principal, actor]);

  const handleVote = async (support) => {
    if (!isAuthenticated) {
      const success = await login();
      if (!success) return;
    }

    try {
      setIsVoting(true);
      if (actor && principal) {
        // Use the backend canister
        const success = await actor.castVote({ proposalId: BigInt(id), support });
        if (success) {
          setLocalVotes(prev => ({
            ...prev,
            [support ? 'for' : 'against']: prev[support ? 'for' : 'against'] + 1
          }));
          alert("Vote cast successfully!");
        } else {
          alert("Failed to cast vote. You may have already voted on this proposal.");
        }
      }
    } catch (error) {
      console.error("Error voting:", error);
      alert("An error occurred while voting. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };

  const getTimeRemaining = () => {
    if (!deadline) return 'Unknown deadline';
    
    const totalSeconds = Math.floor((deadline - Date.now()) / 1000);
    
    if (totalSeconds <= 0) return 'Voting closed';
    
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    
    return `${days}d ${hours}h remaining`;
  };

  const totalVotes = localVotes.for + localVotes.against || 1; // Avoid division by zero
  const forPercentage = (localVotes.for / totalVotes) * 100;

  // Get appropriate image for this proposal
  const imageUrl = getProposalImage(proposal);

  return (
    <div className={`proposal-card ${featured ? 'featured' : ''}`}>
      <div className="proposal-image-container">
        <img 
          src={imageUrl} 
          alt={proposal.title}
          className="proposal-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImages[proposal.category || 'General'];
          }}
        />
        
        <div className="proposal-category">
          <span>{proposal.category || 'General'}</span>
        </div>
      </div>
      
      <div className="proposal-content">
        <h3 className="proposal-title">{proposal.title}</h3>
        
        <p className="proposal-description">{proposal.description}</p>
        
        <div className="proposal-stats">
          <div className="proposal-deadline">
            <i className="fas fa-clock"></i>
            <span>Deadline: {getTimeRemaining()}</span>
          </div>
          
          <div className="proposal-votes">
            <div className="votes-count">
              <span className="for">{localVotes.for}</span>
              <span className="separator">/</span>
              <span className="against">{localVotes.against}</span>
            </div>
            <div className="votes-progress">
              <div 
                className="progress-bar"
                style={{ width: `${forPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <Link to={`/voting?proposal=${proposal.id}`} className="view-proposal-btn">
          <span>View Details</span>
          <i className="fas fa-arrow-right"></i>
        </Link>
      </div>
      

    </div>
  );
}

export default ProposalCard;
