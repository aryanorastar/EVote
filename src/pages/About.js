import React from 'react';
import { useTranslation } from 'react-i18next';
import './About.css';

function About() {
  const { t } = useTranslation();

  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>{t('about.title')} EVote</h1>
        <p>{t('about.tagline')}</p>
      </section>
      
      <section className="about-content">
        <div className="about-section">
          <h2>{t('about.mission.title')}</h2>
          <p>
            {t('about.mission.description')}
          </p>
        </div>
        
        <div className="about-section">
          <h2>{t('about.how.title')}</h2>
          <div className="about-steps">
            <div className="about-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>{t('about.how.step1.title')}</h3>
                <p>
                  {t('about.how.step1.description')}
                </p>
              </div>
            </div>
            
            <div className="about-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>{t('about.how.step2.title')}</h3>
                <p>
                  {t('about.how.step2.description')}
                </p>
              </div>
            </div>
            
            <div className="about-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>{t('about.how.step3.title')}</h3>
                <p>
                  {t('about.how.step3.description')}
                </p>
              </div>
            </div>
            
            <div className="about-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>{t('about.how.step4.title')}</h3>
                <p>
                  {t('about.how.step4.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="about-section">
          <h2>{t('about.technology.title')}</h2>
          <p>
            {t('about.technology.description')}
          </p>
          <div className="tech-stack">
            <div className="tech-item">
              <i className="fab fa-ethereum"></i>
              <span>{t('about.technology.ethereum')}</span>
            </div>
            <div className="tech-item">
              <i className="fas fa-file-contract"></i>
              <span>{t('about.technology.smartContracts')}</span>
            </div>
            <div className="tech-item">
              <i className="fab fa-react"></i>
              <span>{t('about.technology.react')}</span>
            </div>
            <div className="tech-item">
              <i className="fas fa-shield-alt"></i>
              <span>{t('about.technology.web3')}</span>
            </div>
          </div>
        </div>
        
        <div className="about-section">
          <h2>{t('about.team.title')}</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar"></div>
              <h3>Alex Johnson</h3>
              <p>{t('about.team.blockchainDeveloper')}</p>
            </div>
            <div className="team-member">
              <div className="member-avatar"></div>
              <h3>Maria Rodriguez</h3>
              <p>{t('about.team.frontendEngineer')}</p>
            </div>
            <div className="team-member">
              <div className="member-avatar"></div>
              <h3>David Chen</h3>
              <p>{t('about.team.smartContractSpecialist')}</p>
            </div>
            <div className="team-member">
              <div className="member-avatar"></div>
              <h3>Sarah Williams</h3>
              <p>{t('about.team.communityManager')}</p>
            </div>
          </div>
        </div>
        
        <div className="about-section contact-section">
          <h2>Get Involved</h2>
          <p>
            Interested in bringing EVote to your community? Have suggestions or want to contribute?
            We'd love to hear from you!
          </p>
          <div className="contact-button">
            <a href="mailto:contact@evote.org">Contact Us</a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
