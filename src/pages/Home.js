import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const { t } = useTranslation();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>{t('home.title')}</h1>
          <p>{t('home.description')}</p>
          <div className="hero-buttons">
            <Link to="/proposals" className="btn btn-primary">{t('home.viewProposals')}</Link>
            <Link to="/voting" className="btn btn-outline">{t('home.voteNow')}</Link>
          </div>
        </div>
      </section>
      
      <section className="features">
        <div className="feature-container">
          <div className="feature">
            <i className="fas fa-lock feature-icon"></i>
            <h2>{t('home.secureVoting')}</h2>
            <p>{t('home.secureVotingDescription')}</p>
          </div>
          <div className="feature">
            <i className="fas fa-users feature-icon"></i>
            <h2>{t('home.communityDriven')}</h2>
            <p>{t('home.communityDrivenDescription')}</p>
          </div>
          <div className="feature">
            <i className="fas fa-check-circle feature-icon"></i>
            <h2>Transparent Results</h2>
            <p>All voting results are publicly verifiable and cannot be tampered with.</p>
          </div>
        </div>
      </section>
      
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Connect Your Wallet</h3>
            <p>Connect your Ethereum wallet to participate in governance.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Browse Proposals</h3>
            <p>View current community proposals and their details.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Cast Your Vote</h3>
            <p>Vote on proposals to have your say in community decisions.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
