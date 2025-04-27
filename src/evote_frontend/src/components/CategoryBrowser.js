import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryBrowser.css';

const CategoryBrowser = ({ categories }) => {
  return (
    <div className="category-browser">
      <div className="category-grid">
        {categories.map((category) => (
          <Link 
            to={`/proposals?category=${category.id}`} 
            key={category.id}
            className="category-card"
          >
            <div 
              className="category-icon"
              style={{ backgroundColor: `${category.color}25` }}
            >
              <i className={category.icon} style={{ color: category.color }}></i>
            </div>
            <span className="category-name">{category.name}</span>
            <i className="fas fa-arrow-right category-arrow"></i>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryBrowser;
