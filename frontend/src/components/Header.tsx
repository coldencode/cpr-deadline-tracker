import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <h1>CPR Calculator</h1>
        </Link>
        <nav className="header-nav">
          <Link 
            to="/particulars-of-claim" 
            className={`nav-item ${isActive('/particulars-of-claim') ? 'active' : ''}`}
          >
            Particulars of Claim
          </Link>
          <Link 
            to="/acknowledgment-of-service" 
            className={`nav-item ${isActive('/acknowledgment-of-service') ? 'active' : ''}`}
          >
            Acknowledgment of Service
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
