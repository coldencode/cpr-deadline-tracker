import React from 'react';
import './DateInput.css';

const DateInput = ({ label, value, onChange, required = false, helpText }) => {
  return (
    <div className="date-input-group">
      <label className="date-input-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        type="date"
        className="date-input"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
      {helpText && <p className="date-input-help">{helpText}</p>}
    </div>
  );
};

export default DateInput;
