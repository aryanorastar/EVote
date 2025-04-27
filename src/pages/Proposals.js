import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ProposalCard from '../components/ProposalCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './Proposals.css';
import { useWeb3 } from '../context/Web3Context';
import { getActiveProposals, createProposal } from '../utils/web3';

function Proposals() {
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    durationInDays: 7
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isConnected, connect } = useWeb3();

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setIsLoading(true);
        const fetchedProposals = await getActiveProposals();
        
        // If we have real data, use it. Otherwise, fall back to mock data.
        if (fetchedProposals.length > 0) {
          setProposals(fetchedProposals);
        } else {
          // Mock data for testing/development
          setProposals([
            {
              id: 1,
              title: "Community Park Renovation",
              description: "Proposal to allocate funds for renovating the central community park with new playground equipment and green spaces.",
              deadline: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
              votesFor: 120,
              votesAgainst: 45,
              status: "Active"
            },
            {
              id: 2,
              title: "Traffic Reduction Plan",
              description: "Implementation of a new traffic management system to reduce congestion during peak hours in the downtown area.",
              deadline: Date.now() + 5 * 24 * 60 * 60 * 1000, // 5 days from now
              votesFor: 89,
              votesAgainst: 32,
              status: "Active"
            },
            {
              id: 3,
              title: "Public Library Expansion",
              description: "Proposal to expand the public library with a new digital learning center and additional study areas.",
              deadline: Date.now() + 10 * 24 * 60 * 60 * 1000, // 10 days from now
              votesFor: 56,
              votesAgainst: 12,
              status: "Active"
            }
          ]);
        }
      } catch (error) {
        console.error("Error fetching proposals:", error);
        // Show a user-friendly error message
      } finally {
        setIsLoading(false);
      }
    };

    fetchProposals();
  }, []);

  const handleShowForm = async () => {
    if (!isConnected) {
      const connected = await connect();
      if (!connected) return;
    }
    setShowForm(!showForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProposal({
      ...newProposal,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isConnected) {
      alert("Please connect your wallet to create a proposal.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Try to create proposal on the blockchain
      await createProposal(
        newProposal.title, 
        newProposal.description, 
        parseInt(newProposal.durationInDays, 10)
      );
      
      // For demo purposes, add the proposal to the UI immediately
      const newProposalObj = {
        id: proposals.length + 1,
        title: newProposal.title,
        description: newProposal.description,
        deadline: Date.now() + parseInt(newProposal.durationInDays, 10) * 24 * 60 * 60 * 1000,
        votesFor: 0,
        votesAgainst: 0,
        status: "Active"
      };
      
      setProposals([...proposals, newProposalObj]);
      setNewProposal({
        title: '',
        description: '',
        durationInDays: 7
      });
      setShowForm(false);
      
      alert("Proposal created successfully!");
    } catch (error) {
      console.error("Error creating proposal:", error);
      alert("Failed to create proposal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="proposals-page">
      <div className="proposals-header">
        <h1>{t('proposals.community_proposals')}</h1>
        <button className="create-proposal-btn" onClick={handleShowForm}>
          {showForm ? t('proposals.cancel') : t('proposals.create')}
        </button>
      </div>

      {showForm && (
        <div className="proposal-form-container">
          <form className="proposal-form" onSubmit={handleSubmit}>
            <h2>{t('proposals.create_new_proposal')}</h2>
            <div className="form-group">
              <label htmlFor="title">{t('proposals.title')}</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newProposal.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">{t('proposals.description')}</label>
              <textarea
                id="description"
                name="description"
                value={newProposal.description}
                onChange={handleChange}
                rows="4"
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="durationInDays">{t('proposals.duration')}</label>
              <input
                type="number"
                id="durationInDays"
                name="durationInDays"
                min="1"
                max="30"
                value={newProposal.durationInDays}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-actions">
              <button 
                type="submit" 
                className="submit-proposal-btn" 
                disabled={isSubmitting}
              >
                {isSubmitting ? t('proposals.submitting') : t('proposals.submit_proposal')}
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="proposals-grid">
          {proposals.length > 0 ? (
            proposals.map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))
          ) : (
            <div className="no-proposals-message">
              <p>{t('proposals.no_proposals')}</p>
              <p>{t('proposals.create_first_proposal')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Proposals;
