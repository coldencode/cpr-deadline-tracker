import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'What is this for?',
      answer: 'This is a CPR (Civil Procedure Rules) deadline calculator for legal professionals. It helps calculate the deadline to serve Particulars of Claim when served separately from the Claim Form, based on various court types and service conditions.'
    },
    {
      question: 'How does the calculator work?',
      answer: 'The calculator follows a flowchart-based decision tree. You answer questions about the court type, when the claim form was issued/served, and other relevant details. The system then calculates the appropriate deadline based on CPR rules.'
    },
    {
      question: 'Which courts are supported?',
      answer: 'The calculator supports standard courts, Commercial Court, Circuit Commercial Court, and Admiralty Court. Each court type has different calculation rules based on CPR regulations.'
    },
    {
      question: 'What information do I need?',
      answer: 'You\'ll need to know: (1) The type of court, (2) When the Claim Form was issued, (3) When the Claim Form was served, (4) Whether service was within or outside England, and (5) If applicable, when the Acknowledgment of Service was filed.'
    },
    {
      question: 'Are weekends and bank holidays included?',
      answer: 'No, according to CPR rules, there is no need to take into account weekends or bank holidays when calculating these deadlines. The calculator provides the exact date without adjustments.'
    },
    {
      question: 'Can I save my calculations?',
      answer: 'Currently, calculations are performed in real-time and displayed immediately. The results are not saved automatically, but you can note down the calculated deadline for your records.'
    },
    {
      question: 'Is this legally binding?',
      answer: 'This calculator is a tool to assist with deadline calculations based on CPR rules. Always verify critical deadlines with your legal team or refer to the official CPR documentation. This tool is provided for convenience and should not be the sole basis for legal decisions.'
    },
    {
      question: 'What if I get an error?',
      answer: 'If you encounter an error, make sure all required fields are filled correctly. Check that dates are in the correct format (YYYY-MM-DD) and that you\'ve selected the appropriate options for your court type.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`faq-item ${openIndex === index ? 'open' : ''}`}
          >
            <button 
              className="faq-question"
              onClick={() => toggleFAQ(index)}
              aria-expanded={openIndex === index}
            >
              <span className="faq-question-text">{faq.question}</span>
              <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
            </button>
            <div className="faq-answer-wrapper">
              <div className="faq-answer">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
