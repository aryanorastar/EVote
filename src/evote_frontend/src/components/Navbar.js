import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../context/AuthContext';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';

function Navbar() {
  const { t } = useTranslation();
  const { isAuthenticated, login, logout, principal, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const handleAuthClick = async () => {
    if (isAuthenticated) {
      await logout();
    } else {
      await login();
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Check if the current path matches the given path
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <>
      <div className="navbar-language-bar">
        <LanguageSelector />
      </div>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            {t('app_title')} <i className="fas fa-vote-yea"></i>
          </Link>
          <div className="navbar-spacer" />
          <div className="menu-icon" onClick={toggleMenu}>
            <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
            <li className="nav-item">
              <Link 
                to="/" 
                className={`nav-links ${isActive('/') ? 'active' : ''}`} 
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-home mr-2"></i> {t('nav.home')}
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/proposals" 
                className={`nav-links ${isActive('/proposals') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-clipboard-list mr-2"></i> {t('nav.proposals')}
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/voting" 
                className={`nav-links ${isActive('/voting') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-vote-yea mr-2"></i> {t('nav.voting')}
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/about" 
                className={`nav-links ${isActive('/about') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-info-circle mr-2"></i> {t('nav.about')}
              </Link>
            </li>
          </ul>
          {!isAuthenticated ? (
            <button 
              className="btn btn-auth"
              onClick={login}
              aria-label={t('nav.login')}
              disabled={isLoading}
            >
              <i className="fas fa-sign-in-alt mr-2"></i>
              {isLoading ? 'Loading...' : t('nav.login')}
            </button>
          ) : (
            <button 
              className={`btn btn-auth btn-success`} 
              onClick={logout}
              aria-label={t('nav.logout')}
              disabled={isLoading}
            >
              <i className="fas fa-user-check mr-2"></i>
              {principal ? (
                <span className="wallet-info" title={`Principal: ${principal}`}>
                  <i className="fas fa-id-badge mr-1"></i>
                  {principal.slice(0, 8)}...{principal.slice(-4)}
                </span>
              ) : t('nav.connected')}
            </button>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
