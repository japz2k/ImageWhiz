import React from 'react';
import Navbar from './Navbar';

const Header = ({ darkMode, setDarkMode }) => {
  const logoUrl = `${import.meta.env.BASE_URL}logo.png`;

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-300 ${darkMode ? 'bg-dark-surface/70 backdrop-blur-xl border-b border-dark-border' : 'bg-white/70 backdrop-blur-xl border-b border-gray-300'}`}>
      <div className="container mx-auto px-6 py-3 flex items-center">
        <div className="flex-1 flex items-center space-x-4">
          <img src={logoUrl} alt="ImageWhiz Logo" className="h-10 w-10" />
          <h1 className="text-2xl font-bold text-dark-text-primary">ImageWhiz</h1>
        </div>
        
        <div className="flex-1 flex justify-center">
          <Navbar darkMode={darkMode} />
        </div>

        <div className="flex-1 flex justify-end">
      <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full transition-colors ${darkMode ? 'text-dark-text-secondary hover:bg-dark-surface' : 'text-gray-600 hover:bg-gray-200'}`}
      >
            {darkMode ? '☀️' : '🌙'}
      </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 