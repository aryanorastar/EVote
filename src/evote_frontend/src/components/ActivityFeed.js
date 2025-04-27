import React from 'react';
import './ActivityFeed.css';

const ActivityFeed = ({ activities }) => {
  return (
    <div className="activity-feed">
      <div className="activity-header">
        <h3>Latest Updates</h3>
        <span className="activity-badge">Live</span>
      </div>
      
      <div className="activity-list">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <div 
              className="activity-icon" 
              style={{ backgroundColor: `${activity.iconColor}25` }}
            >
              <i className={activity.icon} style={{ color: activity.iconColor }}></i>
            </div>
            <div className="activity-content">
              <p>
                <span className="activity-user">{activity.user}</span>
                {' '}{activity.action}{' '}
                <span className="activity-target">{activity.target}</span>
              </p>
              <span className="activity-time">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="activity-footer">
        <button className="view-all-btn">
          View All Activity
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;
