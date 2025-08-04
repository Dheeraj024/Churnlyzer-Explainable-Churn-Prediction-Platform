import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="navigation">
      <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
        Upload Dataset
      </Link>
      <Link to="/cleaning" className={location.pathname === '/cleaning' ? 'active' : ''}>
        Data Cleaning
      </Link>
      <Link to="/training" className={location.pathname === '/training' ? 'active' : ''}>
        Train Models
      </Link>
      <Link to="/prediction" className={location.pathname === '/prediction' ? 'active' : ''}>
        Predict Churn
      </Link>
    </nav>
  );
};

export default Navigation;