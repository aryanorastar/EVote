import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthAlert.css';

const AuthAlert = () => {
  const { authError, clearAuthError, isAuthenticated, user } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hideForSession, setHideForSession] = useState(
    sessionStorage.getItem('hideLoginSuccess') === 'true'
  );
  const [loginSession, setLoginSession] = useState(
    sessionStorage.getItem('loginSession') || ''
  );

  useEffect(() => {
    // Only show success message once per login session
    if (
      isAuthenticated && user &&
      !showSuccess &&
      !hideForSession &&
      loginSession !== user.name
    ) {
      setShowSuccess(true);
      setIsVisible(true);
      sessionStorage.setItem('loginSession', user.name);
      // Hide success message after 2 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setShowSuccess(false), 300); // After fade out animation
      }, 2000);
      return () => clearTimeout(timer);
    }
    // Show error message when there is an auth error
    if (authError) {
      setIsVisible(true);
    }
  }, [isAuthenticated, user, authError, showSuccess, hideForSession, loginSession]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (authError) clearAuthError();
      if (showSuccess) setShowSuccess(false);
    }, 300); // After fade out animation
  };

  const handleHideForSession = () => {
    setHideForSession(true);
    sessionStorage.setItem('hideLoginSuccess', 'true');
    handleClose();
  };

  if ((!authError && !showSuccess) || hideForSession) return null;

  return (
    <div 
      className={`auth-alert auth-alert-bottom ${isVisible ? 'visible' : 'hidden'} ${showSuccess ? 'success' : 'error'}`}
    >
      <div className="auth-alert-icon">
        {showSuccess ? (
          <i className="fas fa-check-circle"></i>
        ) : (
          <i className="fas fa-exclamation-circle"></i>
        )}
      </div>
      <div className="auth-alert-content">
        {showSuccess ? (
          <>
            <p style={{ fontSize: '1rem', margin: 0 }}>
              Successfully logged in as <strong>{user?.name}</strong>
            </p>
            <button className="auth-alert-hide" onClick={handleHideForSession}>
              Don&apos;t show again this session
            </button>
          </>
        ) : (
          <p>{authError}</p>
        )}
      </div>
      <button className="auth-alert-close" onClick={handleClose}>
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

export default AuthAlert;
