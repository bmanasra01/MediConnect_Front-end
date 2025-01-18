// DashboardCard.js
import React from 'react';
import './DashboardCard.css';

const DashboardCard = ({ title, value, percentage, icon: Icon, iconColor, percentageColor }) => {
  return (
    <div className="dashboard-card">
      <div className="card-header">
        <span>{title}</span>
        <button className="more-options">...</button>
      </div>
      <div className="card-content">
        <h2>{value}</h2>
        <Icon className="card-icon" style={{ color: iconColor }} />
      </div>
      <div className="card-footer" style={{ color: percentageColor }}>
        <span>{percentage > 0 ? '+' : ''}{percentage}%</span>
      </div>
    </div>
  );
};

export default DashboardCard;
