import React, { createContext, useState, useEffect, useContext } from 'react';
import { isWalletConnected, connectWallet, getCurrentAccount } from '../utils/web3';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      const connected = await isWalletConnected();
      setIsConnected(connected);
      
      if (connected) {
        const currentAccount = await getCurrentAccount();
        setAccount(currentAccount);
      }
      
      setIsLoading(false);
    };
    
    checkConnection();
    
    // Set up listeners for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);
  
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // User has disconnected their wallet
      setIsConnected(false);
      setAccount(null);
    } else if (accounts[0] !== account) {
      // User has switched accounts
      setAccount(accounts[0]);
      setIsConnected(true);
    }
  };
  
  const connect = async () => {
    try {
      const success = await connectWallet();
      if (success) {
        const currentAccount = await getCurrentAccount();
        setAccount(currentAccount);
        setIsConnected(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error in connect function:", error);
      return false;
    }
  };
  
  const disconnect = () => {
    // There's no standard way to disconnect in Web3, but we can reset our state
    setAccount(null);
    setIsConnected(false);
  };
  
  // Shortened account address for display
  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const value = {
    account,
    isConnected,
    isLoading,
    connect,
    disconnect,
    shortenAddress
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
