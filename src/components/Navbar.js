import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { useWeb3 } from '../context/Web3Context';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';

function Navbar() {
  const { isConnected, connect, disconnect, shortenAddress, account } = useWeb3();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  
  const handleConnectClick = async () => {
    if (isConnected) {
      disconnect();
    } else {
      await connect();
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          {t('app_title')} <i className="fas fa-vote-yea"></i>
        </Link>
        <LanguageSelector />
        
        <div className="menu-icon" onClick={toggleMenu}>
          <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
        
        <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={() => setIsMenuOpen(false)}>{t('nav.home')}</Link>
          </li>
          <li className="nav-item">
            <Link to="/proposals" className="nav-links" onClick={() => setIsMenuOpen(false)}>{t('nav.proposals')}</Link>
          </li>
          <li className="nav-item">
            <Link to="/voting" className="nav-links" onClick={() => setIsMenuOpen(false)}>{t('nav.voting')}</Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-links" onClick={() => setIsMenuOpen(false)}>{t('nav.about')}</Link>
          </li>
        </ul>
        
        <button 
          className={`connect-wallet ${isConnected ? 'connected' : ''}`} 
          onClick={handleConnectClick}
        >
          {isConnected ? `${shortenAddress(account)}` : 'Connect Wallet'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
