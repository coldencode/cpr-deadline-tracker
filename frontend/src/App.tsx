import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ThemeToggle from './components/ThemeToggle';
import Home from './pages/Home';
import ParticularsOfClaim from './pages/ParticularsOfClaim';
import AcknowledgmentOfService from './pages/AcknowledgmentOfService';
import './App.css';

function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Check localStorage or default to light mode
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : false;
  });

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = (): void => {
    setIsDark(!isDark);
  };

  return (
    <Router>
      <div className="App">
        <Header />
        <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/particulars-of-claim" element={<ParticularsOfClaim />} />
          <Route path="/acknowledgment-of-service" element={<AcknowledgmentOfService />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
