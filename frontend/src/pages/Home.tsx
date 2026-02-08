import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>CPR Deadline Calculator</h1>
        <p className="home-subtitle">Calculate legal deadlines based on Civil Procedure Rules</p>
        
        <div className="home-cards">
          <Link to="/particulars-of-claim" className="home-card">
            <h2>Particulars of Claim</h2>
            <p>Calculate the deadline to serve Particulars of Claim when served separately from the Claim Form</p>
          </Link>
          
          <Link to="/acknowledgment-of-service" className="home-card">
            <h2>Acknowledgment of Service</h2>
            <p>Calculate deadlines for Acknowledgment of Service</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
