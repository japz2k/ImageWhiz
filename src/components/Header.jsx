import { useState } from 'react';
import Navbar from './Navbar';
import { FiMenu, FiX } from 'react-icons/fi';

const Header = ({ darkMode, setDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const logoUrl = `${import.meta.env.BASE_URL}logo.png`;

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-300 ${darkMode ? 'bg-dark-surface/70 backdrop-blur-xl border-b border-dark-border' : 'bg-white/70 backdrop-blur-xl border-b border-gray-300'}`}>
      <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <img src={logoUrl} alt="ImageWhiz Logo" className="h-10 w-10" />
          <h1 className="text-2xl font-bold text-dark-text-primary">ImageWhiz</h1>
        </div>

        {/* Desktop Navbar */}
        <div className="hidden md:flex flex-1 justify-center">
          <Navbar darkMode={darkMode} />
        </div>

        {/* Right side icons (Theme switcher and Mobile Menu Button) */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full transition-colors ${darkMode ? 'text-dark-text-secondary hover:bg-dark-surface' : 'text-gray-600 hover:bg-gray-200'}`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="p-2 rounded-md text-dark-text-primary"
              aria-label="Open menu"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 border-t border-gray-300 dark:border-dark-border">
          <Navbar darkMode={darkMode} isMobile={true} />
        </div>
      )}
    </header>
  );
};

export default Header; 