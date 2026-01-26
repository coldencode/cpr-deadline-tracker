import React from 'react';
import { formatDate } from '../utils/dateCalculations';
import './ResultDisplay.css';

interface ResultDisplayProps {
  deadline: Date | null;
  calculationDetails: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ deadline, calculationDetails }) => {
  if (!deadline) return null;

  return (
    <div className="result-display">
      <div className="result-header">
        <h2>Calculated Deadline</h2>
      </div>
      <div className="result-content">
        <div className="deadline-date">
          {formatDate(deadline)}
        </div>
        {calculationDetails && (
          <div className="calculation-details">
            <h4>Calculation Details:</h4>
            <p>{calculationDetails}</p>
          </div>
        )}
        <div className="result-note">
          <p><strong>Note:</strong> No need to take into account weekends or bank holidays.</p>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
