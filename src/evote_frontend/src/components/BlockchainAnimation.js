import React, { useEffect, useRef } from 'react';
import './BlockchainAnimation.css';

const BlockchainAnimation = () => {
  const containerRef = useRef(null);
  
  // Animation setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Create nodes (blocks)
    const numBlocks = 12;
    const blocks = [];
    
    for (let i = 0; i < numBlocks; i++) {
      const block = document.createElement('div');
      block.className = 'blockchain-block';
      
      // Randomize position within container boundaries
      const randomX = Math.random() * 80; // % of container width
      const randomY = Math.random() * 80; // % of container height
      
      block.style.left = `${randomX}%`;
      block.style.top = `${randomY}%`;
      block.style.animationDelay = `${Math.random() * 2}s`;
      
      // Add glowing effect to some blocks
      if (i % 3 === 0) {
        block.classList.add('glow');
      }
      
      // Add block icon
      const icon = document.createElement('i');
      
      // Use different icons for variety
      const icons = ['fas fa-cube', 'fas fa-link', 'fas fa-database', 'fas fa-vote-yea'];
      icon.className = icons[i % icons.length];
      
      block.appendChild(icon);
      container.appendChild(block);
      blocks.push(block);
    }
    
    // Create connections (lines) between blocks
    for (let i = 0; i < blocks.length - 1; i++) {
      createConnection(container, blocks[i], blocks[i + 1]);
      
      // Add some cross connections for a more mesh-like appearance
      if (i < blocks.length - 3 && i % 2 === 0) {
        createConnection(container, blocks[i], blocks[i + 2]);
      }
    }
    
    // Create 3 floating data packets that travel along the connections
    for (let i = 0; i < 3; i++) {
      const packet = document.createElement('div');
      packet.className = 'data-packet';
      
      // Random start position from one of the blocks
      const startBlock = blocks[Math.floor(Math.random() * blocks.length)];
      const rect = startBlock.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      packet.style.left = `${(rect.left - containerRect.left) + rect.width / 2}px`;
      packet.style.top = `${(rect.top - containerRect.top) + rect.height / 2}px`;
      packet.style.animationDelay = `${i * 2}s`;
      
      container.appendChild(packet);
    }
    
    return () => {
      // Clean up animation elements if component unmounts
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);
  
  // Helper function to create a visual connection between two blocks
  function createConnection(container, block1, block2) {
    const connection = document.createElement('div');
    connection.className = 'blockchain-connection';
    
    // Position and size calculations will be handled by CSS
    connection.dataset.from = Array.from(container.children).indexOf(block1);
    connection.dataset.to = Array.from(container.children).indexOf(block2);
    
    container.appendChild(connection);
  }

  return (
    <div className="blockchain-animation-container" ref={containerRef}>
      {/* Blocks and connections will be created by JavaScript */}
    </div>
  );
};

export default BlockchainAnimation;
