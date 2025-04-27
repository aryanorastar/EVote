import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

// Component imports
import ProposalCard from '../components/ProposalCard';
import ActivityFeed from '../components/ActivityFeed';
import CategoryBrowser from '../components/CategoryBrowser';
import BlockchainAnimation from '../components/BlockchainAnimation';

const Home = () => {
  const { dao, isAuthenticated } = useAuth();
  const [featuredProposals, setFeaturedProposals] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Categories for proposal browsing
  const categories = [
    { id: 'infrastructure', name: 'Infrastructure', icon: 'fas fa-road', color: '#3b82f6' },
    { id: 'education', name: 'Education', icon: 'fas fa-graduation-cap', color: '#10b981' },
    { id: 'environment', name: 'Environment', icon: 'fas fa-leaf', color: '#84cc16' },
    { id: 'safety', name: 'Safety', icon: 'fas fa-shield-alt', color: '#ef4444' },
    { id: 'events', name: 'Community Events', icon: 'fas fa-calendar-alt', color: '#8b5cf6' },
    { id: 'all', name: 'View All', icon: 'fas fa-th-large', color: '#6b7280' }
  ];
  
  // Recent activities
  const activities = [
    { id: 1, type: 'vote', user: 'Alex P.', action: 'voted on', target: 'Traffic Reduction Plan', time: '5 minutes ago', icon: 'fas fa-vote-yea', iconColor: '#3b82f6' },
    { id: 2, type: 'create', user: 'Maria S.', action: 'created', target: 'New Public Library Proposal', time: '2 hours ago', icon: 'fas fa-plus-circle', iconColor: '#10b981' },
    { id: 3, type: 'comment', user: 'John D.', action: 'commented on', target: 'Park Renovation', time: '4 hours ago', icon: 'fas fa-comment', iconColor: '#f59e0b' },
    { id: 4, type: 'vote', user: 'Sarah K.', action: 'voted on', target: 'School Budget Increase', time: '1 day ago', icon: 'fas fa-vote-yea', iconColor: '#3b82f6' },
    { id: 5, type: 'complete', user: 'Community Council', action: 'marked complete', target: 'Bike Lane Installation', time: '2 days ago', icon: 'fas fa-check-circle', iconColor: '#10b981' },
  ];

  const generateFeaturedProposals = (count) => {
    const categories = ['Infrastructure', 'Education', 'Environment', 'Safety', 'Community Events', 'General'];
    const titles = [
      "Community Park Renovation",
      "Public Library Expansion",
      "Traffic Management System",
      "Clean Energy Initiative",
      "Youth Education Program",
      "Street Lighting Upgrade",
      "Community Garden Project",
      "Recycling Program Enhancement",
      "Local Business Support Fund",
      "Historical Building Preservation"
    ];
    
    const proposalDescriptions = [
      "This proposal aims to renovate our community park with new playground equipment, improved walking paths, and additional seating areas for families to enjoy.",
      "Help us expand our public library to accommodate more books, create a digital media center, and provide community meeting spaces.",
      "Implementing smart traffic lights and pedestrian crossings to improve safety and reduce congestion in our busiest intersections.",
      "Transition our community buildings to solar power and implement energy-efficient lighting in all public spaces.",
      "Create after-school programs focused on STEM education, arts, and sports to support our youth's development.",
      "Replace outdated street lighting with energy-efficient LED lights and improve coverage in residential neighborhoods.",
      "Transform vacant lots into community gardens where residents can grow fresh produce and learn about sustainable agriculture.",
      "Enhance our current recycling program with additional collection points, educational campaigns, and expanded accepted materials.",
      "Establish a fund to provide grants and low-interest loans to help local businesses recover and grow.",
      "Preserve and restore historical buildings in our town center to maintain our community's unique character and history."
    ];
    
    const featuredProposals = [];
    
    for (let i = 0; i < count; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const randomDays = Math.floor(Math.random() * 14) + 3; // 3 to 16 days
      
      featuredProposals.push({
        id: i + 1,
        title: titles[i % titles.length],
        description: proposalDescriptions[i % proposalDescriptions.length],
        category: category,
        deadline: Date.now() + (randomDays * 24 * 60 * 60 * 1000),
        votesFor: Math.floor(Math.random() * 100) + 20,
        votesAgainst: Math.floor(Math.random() * 30) + 5,
        featured: true,
        // Set up image URLs for proposals to be used if local images aren't available
        imageUrl: `https://source.unsplash.com/featured/800x600/?${category.toLowerCase().replace(/\s+/g, '-')}`
      });
    }
    
    return featuredProposals;
  };

  useEffect(() => {
    const fetchFeaturedProposals = async () => {
      setIsLoading(true);
      try {
        // Fetch proposals from DAO if available
        if (dao) {
          const proposals = await dao.getActiveProposals();
          setFeaturedProposals(proposals.slice(0, 5)); // Get up to 5 proposals
        } else {
          // Mock data if DAO is not available
          setFeaturedProposals(generateFeaturedProposals(3));
        }
      } catch (error) {
        console.error("Error fetching featured proposals:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeaturedProposals();
    
    // Carousel auto-scroll
    const interval = setInterval(() => {
      setCurrentSlide((prev) => 
        prev === (featuredProposals.length - 1) ? 0 : prev + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [dao, featuredProposals.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="home-container">
      {/* Hero section with enhanced blockchain visualization */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            <span className="hero-title-bold">Community Decisions,</span>
            <br />
            <span className="hero-title-gradient">Blockchain Secured</span>
          </h1>
          
          <div className="hero-animation">
            <div className="animated-text-container">
              <p className="animated-text">
                <span className="text-highlight">Transparent</span> voting for modern communities
              </p>
              <p className="animated-text">
                <span className="text-highlight">Secure</span> blockchain-based governance
              </p>
              <p className="animated-text">
                <span className="text-highlight">Inclusive</span> decision-making for everyone
              </p>
            </div>
          </div>
          
          <p className="hero-description">
            A decentralized platform that empowers communities to make collective decisions with transparency and security.
          </p>
        </div>
        
        <div className="hero-visual expanded">
          {/* Enhanced blockchain visualization with larger circle */}
          <div className="blockchain-visual">
            {/* Moving particles inside the circle */}
            <div className="blockchain-particle"></div>
            <div className="blockchain-particle"></div>
            <div className="blockchain-particle"></div>
            
            <div className="blockchain-node node1">
              <i className="fas fa-vote-yea"></i>
              <span className="node-label">Voting</span>
            </div>
            <div className="blockchain-node node2">
              <i className="fas fa-users"></i>
              <span className="node-label">Community</span>
            </div>
            <div className="blockchain-node node3">
              <i className="fas fa-file-alt"></i>
              <span className="node-label">Proposals</span>
            </div>
            <div className="blockchain-node node4">
              <i className="fas fa-lock"></i>
              <span className="node-label">Security</span>
            </div>
            
            <div className="blockchain-connection connection1"></div>
            <div className="blockchain-connection connection2"></div>
            <div className="blockchain-connection connection3"></div>
            <div className="blockchain-connection connection4"></div>
            
            <div className="blockchain-central">
              <div className="central-icon">
                <i className="fas fa-cubes"></i>
              </div>
              <span className="central-label">Blockchain</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats section - moved up to replace the removed CTA */}
      <section className="stats-highlight-section">
        <div className="stats-container">
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-file-alt"></i>
              </div>
              <div className="stat-value">150+</div>
              <div className="stat-label">Active Proposals</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-vote-yea"></i>
              </div>
              <div className="stat-value">5.2k+</div>
              <div className="stat-label">Votes Cast</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-chart-pie"></i>
              </div>
              <div className="stat-value">92%</div>
              <div className="stat-label">Participation Rate</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-value">45+</div>
              <div className="stat-label">Communities</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Proposals Carousel */}
      <section className="featured-section">
        <h2 className="section-title">Featured Proposals</h2>
        
        <div className="carousel-container">
          <div className="carousel-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {featuredProposals.map((proposal, index) => (
              <div className="carousel-slide" key={proposal.id}>
                <div className="carousel-card" style={{
                  backgroundImage: proposal.image ? `url(${proposal.image})` : 'none'
                }}>
                  <div className="carousel-content">
                    <h3>{proposal.title}</h3>
                    <p>{proposal.description}</p>
                    <Link to={`/proposals/${proposal.id}`} className="carousel-btn">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="carousel-indicators">
            {featuredProposals.map((_, index) => (
              <button
                key={index}
                className={`carousel-indicator ${currentSlide === index ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          <button className="carousel-control prev" onClick={() => 
            goToSlide(currentSlide === 0 ? featuredProposals.length - 1 : currentSlide - 1)
          }>
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <button className="carousel-control next" onClick={() => 
            goToSlide(currentSlide === featuredProposals.length - 1 ? 0 : currentSlide + 1)
          }>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </section>
      
      {/* Two-column layout for categories and activity feed */}
      <div className="two-column-section">
        {/* Category-based browsing */}
        <section className="categories-section">
          <h2 className="section-title">Browse by Category</h2>
          <CategoryBrowser categories={categories} />
        </section>
        
        {/* Community Activity Feed */}
        <section className="activity-section">
          <div>
            <h2 className="section-title">Recent Activity</h2>
            <ActivityFeed activities={activities} />
          </div>
        </section>
      </div>

      {/* Call to action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to make a difference in your community?</h2>
          <p>Join thousands of citizens who are shaping the future through transparent governance.</p>
          <Link to="/proposals" className="cta-button">Get Started</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
