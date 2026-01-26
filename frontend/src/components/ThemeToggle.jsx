import React from 'react';
import './ThemeToggle.css';

const ThemeToggle = ({ isDark, toggleTheme }) => {
  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
      <div className={`toggle-slider ${isDark ? 'dark' : 'light'}`}>
        <span className="toggle-icon">{isDark ? '🌙' : '☀️'}</span>
      </div>
    </button>
  );
};

export default ThemeToggle;
