import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { getBackendActor } from '../utils/ic';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState(null);
  const [actor, setActor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authClient, setAuthClient] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const client = await AuthClient.create();
        setAuthClient(client);
        if (await client.isAuthenticated()) {
          const identity = client.getIdentity();
          setPrincipal(identity.getPrincipal().toText());
          setIsAuthenticated(true);
          const backendActor = await getBackendActor(client);
          setActor(backendActor);
        }
      } catch (error) {
        setAuthError("Failed to initialize authentication.");
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async () => {
    setAuthError(null);
    setIsLoading(true);
    try {
      if (!authClient) return false;
      await authClient.login({
        identityProvider: "https://identity.ic0.app/#authorize",
        onSuccess: async () => {
          const identity = authClient.getIdentity();
          setPrincipal(identity.getPrincipal().toText());
          setIsAuthenticated(true);
          const backendActor = await getBackendActor(authClient);
          setActor(backendActor);
          setIsLoading(false);
        },
        onError: (err) => {
          setAuthError("Login failed: " + err?.message);
          setIsLoading(false);
        }
      });
      return true;
    } catch (error) {
      setAuthError("Login failed: " + error?.message);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (authClient) await authClient.logout();
      setPrincipal(null);
      setIsAuthenticated(false);
      setActor(null);
    } catch (error) {
      setAuthError("Logout failed: " + error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    principal,
    actor,
    isLoading,
    authError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
