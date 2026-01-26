import { useState, useEffect } from 'react';
import DeadlineCalculator from './components/DeadlineCalculator';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

function App() {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage or default to light mode
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : false;
  });

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className="App">
      <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
      <DeadlineCalculator />
    </div>
  );
}

export default App;
