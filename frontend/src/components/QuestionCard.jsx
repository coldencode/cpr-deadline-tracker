import React from 'react';
import './QuestionCard.css';

const QuestionCard = ({ question, children, required = false }) => {
  return (
    <div className="question-card">
      <h3 className="question-title">
        {question}
        {required && <span className="required">*</span>}
      </h3>
      <div className="question-content">
        {children}
      </div>
    </div>
  );
};

export default QuestionCard;
