import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  // Interactive state
  const [activeValue, setActiveValue] = useState('transparency');
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const [visibleSections, setVisibleSections] = useState({
    mission: false,
    values: false,
    features: false
  });
  const timelineRef = useRef(null);

  // Simplified intersection observer effect using scroll event
  useEffect(() => {
    const handleScroll = () => {
      // Check if sections are in view
      const missionSection = document.querySelector('.mission-section');
      const valuesSection = document.querySelector('.values-section');
      const featuresSection = document.querySelector('.features-section');
      
      if (missionSection) {
        const rect = missionSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) {
          setVisibleSections(prev => ({ ...prev, mission: true }));
        }
      }
      
      if (valuesSection) {
        const rect = valuesSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) {
          setVisibleSections(prev => ({ ...prev, values: true }));
        }
      }
      
      if (featuresSection) {
        const rect = featuresSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) {
          setVisibleSections(prev => ({ ...prev, features: true }));
        }
      }
      
      // Timeline animation
      if (timelineRef.current) {
        const timeline = timelineRef.current;
        const timelineItems = timeline.querySelectorAll('.timeline-item');
        
        timelineItems.forEach(item => {
          const rect = item.getBoundingClientRect();
          const isVisible = (rect.top >= 0) && (rect.bottom <= window.innerHeight);
          
          if (isVisible) {
            item.classList.add('animate');
          }
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  // Generate background color based on name
  const getAvatarColor = (name) => {
    const colors = [
      '#4F46E5', '#10B981', '#F59E0B', '#EF4444', 
      '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
    ];
    
    // Simple hash function to get consistent color for same name
    const hash = name.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    return colors[hash % colors.length];
  };

  // Team members data with expanded details
  const teamMembers = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Project Lead",
      bio: "Alex has over 10 years of experience in blockchain development and community governance systems. Previously led development at BlockVote and contributed to several open-source voting systems.",
      extendedBio: "With a background in cryptography and distributed systems, Alex became fascinated with the potential for blockchain to revolutionize democratic processes. After completing a PhD in Computer Science at MIT, Alex spent five years developing secure voting systems before founding EVote to make decentralized governance accessible to all communities.",
      skills: ["Blockchain Architecture", "Smart Contract Development", "System Security", "Project Management"],
      funFact: "Once advised a small island nation on implementing blockchain voting for national elections.",
      links: {
        linkedin: "#",
        github: "#",
        twitter: "#"
      }
    },
    {
      id: 2,
      name: "Sarah Chen",
      role: "UX Designer",
      bio: "Sarah specializes in creating intuitive interfaces for decentralized applications and governance platforms.",
      extendedBio: "Sarah's journey into UX design began with a passion for making complex technologies accessible to everyone. After graduating with a design degree from RISD, she worked with multiple fintech startups before joining EVote to ensure that the democratic power of blockchain technology could be wielded by users of all technical backgrounds.",
      skills: ["User Research", "Interface Design", "Accessibility", "Usability Testing"],
      funFact: "Creates hand-drawn wireframes exclusively using vintage fountain pens.",
      links: {
        linkedin: "#",
        dribbble: "#",
        twitter: "#"
      }
    },
    {
      id: 3,
      name: "Marcus Taylor",
      role: "Blockchain Developer",
      bio: "Marcus focuses on smart contract development and secure voting mechanisms for blockchain applications.",
      extendedBio: "With a background in applied mathematics and cryptography, Marcus brings security-first thinking to every line of code he writes. Having previously worked at ConsenSys developing smart contracts for enterprise clients, he joined EVote to help build a secure foundation for decentralized decision making that communities can trust with their most important choices.",
      skills: ["Solidity", "Smart Contract Security", "Cryptography", "System Architecture"],
      funFact: "Runs a validator node for three different blockchain networks from a custom-built home server.",
      links: {
        linkedin: "#",
        github: "#",
        medium: "#"
      }
    },
    {
      id: 4,
      name: "Leila Patel",
      role: "Community Manager",
      bio: "Leila builds and nurtures community relationships, ensuring EVote meets the needs of diverse stakeholders.",
      extendedBio: "After working in international development for several years, Leila developed a passion for how technology could empower communities to self-govern. She joined EVote after experiencing firsthand the challenges of implementing fair voting systems in her previous role at a global NGO. She now leads our efforts to make EVote a tool for positive social change.",
      skills: ["Community Building", "User Research", "Strategic Partnerships", "Product Feedback"],
      funFact: "Has facilitated community decision-making processes in over 20 countries.",
      links: {
        linkedin: "#",
        twitter: "#",
        instagram: "#"
      }
    }
  ];
  
  // Core values with visual representation
  const coreValues = [
    {
      id: 'transparency',
      name: 'Transparency',
      description: 'Every vote and decision process is fully transparent and auditable on the blockchain.',
      icon: 'fa-eye',
      color: '#3b82f6',
      pattern: 'radial-gradient(circle at 100% 100%, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0) 50%)'
    },
    // ... existing core values ...
    {
      id: 'security',
      name: 'Security',
      description: 'State-of-the-art cryptographic protocols ensure vote integrity and user privacy.',
      icon: 'fa-shield-alt',
      color: '#10b981',
      pattern: 'repeating-linear-gradient(45deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.1) 10%, transparent 10%, transparent 20%)'
    },
    {
      id: 'accessibility',
      name: 'Accessibility',
      description: 'Designed for users of all technical abilities, making participation possible for everyone.',
      icon: 'fa-universal-access',
      color: '#8b5cf6',
      pattern: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 25%, transparent 25%, transparent 50%, rgba(139, 92, 246, 0.15) 50%, rgba(139, 92, 246, 0.15) 75%, transparent 75%, transparent)'
    },
    {
      id: 'community',
      name: 'Community',
      description: 'Empowering communities to make collective decisions and shape their shared future.',
      icon: 'fa-users',
      color: '#f59e0b',
      pattern: 'radial-gradient(circle at 10px 10px, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.1) 5%, transparent 5%, transparent)',
      patternSize: '20px 20px'
    }
  ];

  // Platform features with visual examples
  const features = [
    {
      title: "Decentralized Governance",
      description: "Community-driven decision making without central authorities",
      icon: "fa-landmark",
      animation: "fade-right"
    },
    // ... existing features ...
    {
      title: "Transparent Voting",
      description: "All votes are recorded on the blockchain for verification",
      icon: "fa-vote-yea",
      animation: "fade-up"
    },
    {
      title: "Secure Identity",
      description: "Cryptographic verification ensures vote authenticity",
      icon: "fa-fingerprint",
      animation: "fade-up"
    },
    {
      title: "Proposal Management",
      description: "Create, track, and implement community proposals",
      icon: "fa-tasks",
      animation: "fade-up"
    },
    {
      title: "Real-time Results",
      description: "See vote counts and proposal status in real-time",
      icon: "fa-chart-pie",
      animation: "fade-up"
    },
    {
      title: "Community Insights",
      description: "Analyze voting patterns and community engagement",
      icon: "fa-chart-line",
      animation: "fade-left"
    }
  ];
  
  // Timeline events with enhanced details
  const timelineEvents = [
    {
      date: "Q1 2023",
      title: "Project Inception",
      description: "EVote concept developed and initial research conducted",
      icon: "fa-lightbulb",
      color: "#3b82f6",
      details: "After identifying gaps in existing governance solutions, our founding team began researching blockchain-based voting mechanisms that could provide the security and transparency needed for community decision-making."
    },
    // ... existing timeline events ...
    {
      date: "Q2 2023",
      title: "Alpha Development",
      description: "Core voting mechanisms and blockchain integration implemented",
      icon: "fa-code",
      color: "#8b5cf6",
      details: "Our development team built the foundational smart contracts that would power secure voting, focusing on gas optimization, security audits, and creating a robust API for frontends to interact with the blockchain."
    },
    {
      date: "Q3 2023",
      title: "Beta Testing",
      description: "Community testing with initial set of governance features",
      icon: "fa-flask",
      color: "#10b981",
      details: "We invited 12 different community organizations to test the platform, gathering critical feedback on usability and feature requests that shaped our development roadmap ahead of public launch."
    },
    {
      date: "Q4 2023",
      title: "Official Launch",
      description: "Public release of the EVote platform",
      icon: "fa-rocket",
      color: "#f59e0b",
      details: "The platform officially launched with support for custom proposal creation, secure voting, and basic analytics. Within the first month, over 200 communities started using EVote for their governance needs."
    },
    {
      date: "Q1 2024",
      title: "Enhanced Features",
      description: "Additional governance tools and community analytics",
      icon: "fa-chart-bar",
      color: "#ef4444",
      details: "Based on user feedback, we implemented advanced analytics, delegation mechanisms, and improved visualization tools to help communities better understand their collective decision-making."
    },
    {
      date: "Q2 2024",
      title: "Mobile App",
      description: "Native mobile applications for iOS and Android",
      icon: "fa-mobile-alt",
      color: "#6366f1",
      details: "Launching native mobile apps dramatically increased participation rates, with a 47% increase in voting activity as users could now participate in governance on the go."
    }
  ];
  
  // Stats with animations
  const stats = [
    { value: '10K+', label: 'Community Members', icon: 'fa-users' },
    { value: '50K+', label: 'Votes Cast', icon: 'fa-vote-yea' },
    { value: '500+', label: 'Communities', icon: 'fa-globe' },
    { value: '2K+', label: 'Proposals Created', icon: 'fa-file-alt' }
  ];

  // Handle team member selection
  const handleTeamMemberClick = (member) => {
    if (selectedTeamMember && selectedTeamMember.id === member.id) {
      setSelectedTeamMember(null);
    } else {
      setSelectedTeamMember(member);
    }
  };

  return (
    <div className="about-container">
      {/* Hero Section with Animated Particles */}
      <section className="about-hero">
        <div className="particle particle1"></div>
        <div className="particle particle2"></div>
        <div className="particle particle3"></div>
        <div className="particle particle4"></div>
        <div className="particle particle5"></div>
        
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="text-gradient">Revolutionizing</span> Community Governance
          </h1>
          <p className="hero-subtitle">
            Empowering communities with transparent, secure blockchain voting technology
          </p>
        </div>
        
        <div className="blockchain-nodes">
          <div className="node node1">
            <i className="fas fa-vote-yea"></i>
          </div>
          <div className="node node2">
            <i className="fas fa-users"></i>
          </div>
          <div className="node node3">
            <i className="fas fa-shield-alt"></i>
          </div>
          <div className="node-connection connection1"></div>
          <div className="node-connection connection2"></div>
          <div className="node-connection connection3"></div>
        </div>
      </section>
      
      {/* Mission Section with Animation */}
      <section 
        className={`mission-section ${visibleSections.mission ? 'visible' : ''}`}
      >
        <div className="section-header">
          <span className="section-tagline">Our Mission</span>
          <h2>Building the Future of Collective Decision-Making</h2>
          <div className="header-underline"></div>
        </div>
        
        <div className="mission-content">
          <div className="mission-statement">
            <p className="mission-quote">
              <span className="quote-mark">"</span>
              We believe that decisions affecting communities should be made by the communities themselves, in a transparent and equitable way.
              <span className="quote-mark">"</span>
            </p>
            <p>
              EVote aims to revolutionize community governance by leveraging blockchain technology to create a transparent, secure, and accessible platform for collective decision-making. We envision a future where every voice matters and every vote counts.
            </p>
            <p>
              By eliminating barriers to participation and ensuring the integrity of the voting process, we're building not just a platform, but a new paradigm for how communities govern themselves in the digital age.
            </p>
          </div>
          
          <div className="mission-illustration">
            <div className="illustration-circle"></div>
            <img src="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" alt="Community decision making" />
            <div className="floating-icon icon1">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="floating-icon icon2">
              <i className="fas fa-globe"></i>
            </div>
            <div className="floating-icon icon3">
              <i className="fas fa-shield-alt"></i>
            </div>
          </div>
        </div>
      </section>
      
      {/* Core Values with Interactive Elements */}
      <section 
        className={`values-section ${visibleSections.values ? 'visible' : ''}`}
      >
        <div className="section-header">
          <span className="section-tagline">Our Values</span>
          <h2>The Principles That Guide Us</h2>
          <div className="header-underline"></div>
        </div>
        
        <div className="values-interactive">
          <div className="values-tabs">
            {coreValues.map((value) => (
              <button 
                key={value.id}
                className={`value-tab ${activeValue === value.id ? 'active' : ''}`}
                onClick={() => setActiveValue(value.id)}
              >
                <i className={`fas ${value.icon}`} style={{color: value.color}}></i>
                <span>{value.name}</span>
              </button>
            ))}
          </div>
          
          <div className="value-content-wrapper">
            {coreValues.map((value) => (
              <div 
                key={value.id}
                className={`value-content ${activeValue === value.id ? 'active' : ''}`}
                style={{
                  backgroundImage: value.pattern,
                  backgroundSize: value.patternSize || '50px 50px'
                }}
              >
                <div className="value-icon" style={{backgroundColor: `${value.color}20`, color: value.color}}>
                  <i className={`fas ${value.icon}`}></i>
                </div>
                <h3 style={{color: value.color}}>{value.name}</h3>
                <p>{value.description}</p>
                
                <div className="value-visual">
                  {/* Value visualizations - placeholder */}
                  {value.id === 'transparency' && (
                    <div className="transparency-visual"></div>
                  )}
                </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
                
                {/* Additional sections would go here */}
                
              </div>
            );
          };
          
          export default About;
                   