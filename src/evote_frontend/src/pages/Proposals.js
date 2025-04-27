import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Proposals.css';

const Proposals = () => {
  const { dao, isAuthenticated, login } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [filteredProposals, setFilteredProposals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeStatus, setActiveStatus] = useState('all');
  const [sortOption, setSortOption] = useState('deadline');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    category: 'infrastructure',
    duration: 7,
  });
  
  // Extract query params
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');
  
  // Define available categories with their metadata
  const categoryOptions = [
    { id: 'all', name: 'All Categories', icon: 'fa-th-large', color: '#6b7280' },
    { id: 'infrastructure', name: 'Infrastructure', icon: 'fa-road', color: '#3b82f6' },
    { id: 'education', name: 'Education', icon: 'fa-graduation-cap', color: '#10b981' },
    { id: 'environment', name: 'Environment', icon: 'fa-leaf', color: '#84cc16' },
    { id: 'safety', name: 'Safety', icon: 'fa-shield-alt', color: '#ef4444' },
    { id: 'events', name: 'Community Events', icon: 'fa-calendar-alt', color: '#8b5cf6' },
    { id: 'governance', name: 'Governance', icon: 'fa-landmark', color: '#f59e0b' },
    { id: 'technology', name: 'Technology', icon: 'fa-microchip', color: '#06b6d4' },
    { id: 'other', name: 'Other', icon: 'fa-cubes', color: '#6b7280' },
  ];
  
  // Status options
  const statusOptions = [
    { id: 'all', name: 'All Status' },
    { id: 'active', name: 'Active' },
    { id: 'completed', name: 'Completed' },
    { id: 'expired', name: 'Expired' },
  ];
  
  // Sort options
  const sortOptions = [
    { id: 'deadline', name: 'Deadline (Nearest)' },
    { id: 'votes', name: 'Most Votes' },
    { id: 'newest', name: 'Newest First' },
  ];
  
  // Set initial category from URL parameter
  useEffect(() => {
    if (categoryParam && categoryParam !== 'all') {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);
  
  // Fetch proposals
  useEffect(() => {
    const fetchProposals = async () => {
      setIsLoading(true);
      try {
        let fetchedProposals = [];
        
        if (dao) {
          fetchedProposals = await dao.getActiveProposals();
          
          // Add some completed and expired proposals for demo
          const completedProposals = generateSampleProposals(3, 'completed');
          const expiredProposals = generateSampleProposals(2, 'expired');
          fetchedProposals = [...fetchedProposals, ...completedProposals, ...expiredProposals];
        } else {
          // Mock data if DAO is not available
          fetchedProposals = generateSampleProposals(12);
        }
        
        // Extract all unique categories
        const uniqueCategories = [...new Set(fetchedProposals.map(p => p.category))];
        setCategories(uniqueCategories);
        
        setProposals(fetchedProposals);
      } catch (error) {
        console.error("Error fetching proposals:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProposals();
  }, [dao]);
  
  // Filter and sort proposals
  useEffect(() => {
    let result = [...proposals];
    
    // Filter by category
    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }
    
    // Filter by status
    if (activeStatus !== 'all') {
      result = result.filter(p => p.status.toLowerCase() === activeStatus);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        p => p.title.toLowerCase().includes(term) || 
             p.description.toLowerCase().includes(term)
      );
    }
    
    // Sort proposals
    switch(sortOption) {
      case 'deadline':
        result.sort((a, b) => a.deadline - b.deadline);
        break;
      case 'votes':
        result.sort((a, b) => (b.votesFor + b.votesAgainst) - (a.votesFor + a.votesAgainst));
        break;
      case 'newest':
        result.sort((a, b) => b.id - a.id);
        break;
      default:
        // Default sort by deadline
        result.sort((a, b) => a.deadline - b.deadline);
    }
    
    setFilteredProposals(result);
  }, [proposals, activeCategory, activeStatus, sortOption, searchTerm]);
  
  // Generate sample proposals for demo purposes
  const generateSampleProposals = (count, forcedStatus = null) => {
    const sampleProposals = [];
    const categories = ['infrastructure', 'education', 'environment', 'safety', 'events', 'governance', 'technology', 'other'];
    const titles = [
      "Community Park Renovation",
      "Public Library Expansion",
      "Traffic Management System",
      "Clean Energy Initiative",
      "Youth Education Program",
      "Street Lighting Upgrade",
      "Public Safety Committee",
      "Community Garden Project",
      "Recycling Program Enhancement",
      "Local Business Support Fund",
      "Historical Building Preservation",
      "Public Transit Improvement"
    ];
    
    for (let i = 0; i < count; i++) {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomTitle = titles[Math.floor(Math.random() * titles.length)];
      const randomDays = Math.floor(Math.random() * 30) + 1;
      const randomVotesFor = Math.floor(Math.random() * 200);
      const randomVotesAgainst = Math.floor(Math.random() * 100);
      
      let status;
      if (forcedStatus) {
        status = forcedStatus;
      } else if (i % 5 === 0) {
        status = 'completed';
      } else if (i % 7 === 0) {
        status = 'expired';
      } else {
        status = 'active';
      }
      
      sampleProposals.push({
        id: 100 + i,
        title: randomTitle + (i > 0 ? ` - ${i}` : ''),
        description: `This proposal aims to improve the community through ${randomTitle.toLowerCase()}. We believe this initiative will have significant positive impact on all residents.`,
        deadline: Date.now() + (randomDays * 24 * 60 * 60 * 1000),
        votesFor: randomVotesFor,
        votesAgainst: randomVotesAgainst,
        status: status,
        category: randomCategory,
        creator: 'Community Member',
        createdAt: Date.now() - (Math.random() * 30 * 24 * 60 * 60 * 1000)
      });
    }
    
    return sampleProposals;
  };
  
  // Create new proposal
  const handleCreateProposal = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      await login();
      return;
    }
    
    try {
      if (dao) {
        await dao.createProposal(
          newProposal.title,
          newProposal.description,
          parseInt(newProposal.duration, 10)
        );
        
        // Refresh proposals
        const updatedProposals = await dao.getActiveProposals();
        setProposals(updatedProposals);
      } else {
        // Mock for demo
        const newId = Math.max(...proposals.map(p => p.id)) + 1;
        const createdProposal = {
          id: newId,
          title: newProposal.title,
          description: newProposal.description,
          deadline: Date.now() + (parseInt(newProposal.duration, 10) * 24 * 60 * 60 * 1000),
          votesFor: 0,
          votesAgainst: 0,
          status: 'active',
          category: newProposal.category,
          creator: 'You',
          createdAt: Date.now()
        };
        
        setProposals([createdProposal, ...proposals]);
      }
      
      // Reset form
      setNewProposal({
        title: '',
        description: '',
        category: 'infrastructure',
        duration: 7,
      });
      setShowForm(false);
      
      // Show success message
      alert('Proposal created successfully!');
    } catch (error) {
      console.error("Error creating proposal:", error);
      alert('Failed to create proposal. Please try again.');
    }
  };
  
  // Format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  // Calculate time remaining
  const getTimeRemaining = (deadline) => {
    const now = Date.now();
    const remaining = deadline - now;
    
    if (remaining <= 0) return 'Expired';
    
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h remaining`;
  };
  
  // Get category metadata
  const getCategoryInfo = (categoryId) => {
    return categoryOptions.find(cat => cat.id === categoryId) || 
           { name: 'Unknown', icon: 'fa-question', color: '#6b7280' };
  };
  
  // Get progress percentage
  const getProgress = (deadline) => {
    const total = deadline - Date.now();
    const elapsed = total / (7 * 24 * 60 * 60 * 1000); // Assuming 7 days default
    return Math.max(0, Math.min(100, elapsed * 100));
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProposal({
      ...newProposal,
      [name]: value
    });
  };
  
  // Generate gradient based on votes
  const getVoteGradient = (votesFor, votesAgainst) => {
    const total = votesFor + votesAgainst || 1; // Avoid division by zero
    const forPercentage = (votesFor / total) * 100;
    return `linear-gradient(90deg, #10b981 ${forPercentage}%, #ef4444 ${forPercentage}%)`;
  };
  
  return (
    <div className="proposals-container">
      {/* Hero Banner */}
      <div className="proposals-hero">
        <h1>Community Proposals</h1>
        <p>Discover, vote, and create proposals to shape the future of our community</p>
        <button 
          className="create-proposal-button"
          onClick={() => setShowForm(!showForm)}
        >
          <i className="fas fa-plus-circle"></i>
          {showForm ? 'Cancel' : 'Create Proposal'}
        </button>
      </div>
      
      {/* Create Proposal Form */}
      {showForm && (
        <div className="proposal-form-container">
          <form onSubmit={handleCreateProposal} className="proposal-form">
            <div className="proposal-form-header">
              <h3>Create New Proposal</h3>
              <p>Share your idea with the community</p>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="title">
                  <i className="fas fa-heading"></i> Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newProposal.title}
                  onChange={handleInputChange}
                  placeholder="Give your proposal a clear title"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="category">
                  <i className="fas fa-tag"></i> Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={newProposal.category}
                  onChange={handleInputChange}
                  required
                >
                  {categoryOptions.filter(cat => cat.id !== 'all').map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group full-width">
                <label htmlFor="description">
                  <i className="fas fa-align-left"></i> Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newProposal.description}
                  onChange={handleInputChange}
                  rows="5"
                  placeholder="Describe your proposal in detail. What problem does it solve? How will it benefit the community?"
                  required
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="duration">
                  <i className="fas fa-clock"></i> Voting Duration (days)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={newProposal.duration}
                  onChange={handleInputChange}
                  min="1"
                  max="30"
                  required
                />
              </div>
              
              <div className="form-group form-actions">
                <button type="button" onClick={() => setShowForm(false)} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  <i className="fas fa-paper-plane"></i> Submit Proposal
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      
      {/* Filters and Search */}
      <div className="filters-container">
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search proposals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="clear-search" 
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              <i className="fas fa-times-circle"></i>
            </button>
          )}
        </div>
        
        <div className="filter-options">
          <div className="filter-group">
            <label>Category:</label>
            <select 
              value={activeCategory} 
              onChange={(e) => setActiveCategory(e.target.value)}
              className="filter-select"
            >
              {categoryOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Status:</label>
            <select 
              value={activeStatus} 
              onChange={(e) => setActiveStatus(e.target.value)}
              className="filter-select"
            >
              {statusOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Sort By:</label>
            <select 
              value={sortOption} 
              onChange={(e) => setSortOption(e.target.value)}
              className="filter-select"
            >
              {sortOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Results Stats */}
      <div className="results-stats">
        <p>
          {filteredProposals.length} {filteredProposals.length === 1 ? 'proposal' : 'proposals'} found
        </p>
        
        {searchTerm && (
          <div className="search-term">
            <span>Search: "{searchTerm}"</span>
            <button onClick={() => setSearchTerm('')}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
      </div>
      
      {/* Proposals Grid */}
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading proposals...</p>
        </div>
      ) : filteredProposals.length === 0 ? (
        <div className="no-results">
          <i className="fas fa-search"></i>
          <h3>No proposals found</h3>
          <p>Try adjusting your filters or create a new proposal</p>
          <button 
            className="create-proposal-button"
            onClick={() => setShowForm(true)}
          >
            Create a Proposal
          </button>
        </div>
      ) : (
        <div className="proposals-grid">
          {filteredProposals.map(proposal => {
            const categoryInfo = getCategoryInfo(proposal.category);
            return (
              <div 
                key={proposal.id} 
                className={`proposal-card ${proposal.status.toLowerCase()}`}
              >
                <div className="proposal-header">
                  <div 
                    className="category-badge"
                    style={{ backgroundColor: `${categoryInfo.color}20`, color: categoryInfo.color }}
                  >
                    <i className={`fas ${categoryInfo.icon}`}></i>
                    <span>{categoryInfo.name}</span>
                  </div>
                  
                  <div className={`status-badge ${proposal.status.toLowerCase()}`}>
                    {proposal.status === 'active' && <i className="fas fa-circle"></i>}
                    {proposal.status === 'completed' && <i className="fas fa-check-circle"></i>}
                    {proposal.status === 'expired' && <i className="fas fa-clock"></i>}
                    {proposal.status}
                  </div>
                </div>
                
                <h3 className="proposal-title">{proposal.title}</h3>
                <p className="proposal-description">{proposal.description}</p>
                
                <div className="proposal-meta">
                  <div className="meta-item">
                    <i className="fas fa-calendar-alt"></i>
                    <span>Ends: {formatDate(proposal.deadline)}</span>
                  </div>
                  
                  <div className="meta-item">
                    <i className="fas fa-user"></i>
                    <span>By: {proposal.creator}</span>
                  </div>
                </div>
                
                <div className="vote-stats">
                  <div className="vote-bar" style={{ background: getVoteGradient(proposal.votesFor, proposal.votesAgainst) }}></div>
                  <div className="vote-counts">
                    <span className="votes-for">
                      <i className="fas fa-thumbs-up"></i> {proposal.votesFor}
                    </span>
                    <span className="votes-against">
                      <i className="fas fa-thumbs-down"></i> {proposal.votesAgainst}
                    </span>
                  </div>
                </div>
                
                {proposal.status === 'active' && (
                  <div className="time-remaining">
                    <div className="progress-bar">
                      <div 
                        className="progress" 
                        style={{ width: `${getProgress(proposal.deadline)}%` }}
                      ></div>
                    </div>
                    <span>{getTimeRemaining(proposal.deadline)}</span>
                  </div>
                )}
                
                <div className="proposal-actions">
                  <button className="view-details-btn">
                    View Details
                  </button>
                  
                  
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Pagination */}
      {filteredProposals.length > 0 && (
        <div className="pagination">
          <button className="pagination-btn" disabled>
            <i className="fas fa-chevron-left"></i> Previous
          </button>
          <div className="pagination-pages">
            <button className="pagination-page active">1</button>
            <button className="pagination-page">2</button>
            <button className="pagination-page">3</button>
          </div>
          <button className="pagination-btn">
            Next <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default Proposals;
