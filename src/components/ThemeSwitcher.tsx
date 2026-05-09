import { useState, useEffect } from 'react';
import './ThemeSwitcher.css';

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    window.dispatchEvent(new CustomEvent('app-announce', { 
      detail: `Theme changed to ${newTheme} mode` 
    }));
  };

  return (
    <button 
      onClick={toggleTheme} 
      className="theme-switcher"
      role="switch"
      aria-checked={theme === 'light'}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <span className="icon" aria-hidden="true">☀️</span>
      ) : (
        <span className="icon" aria-hidden="true">🌙</span>
      )}
    </button>
  );
};

export default ThemeSwitcher;
