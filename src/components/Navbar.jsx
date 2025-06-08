import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiImage, FiFileText, FiGrid, FiHome } from 'react-icons/fi';

const NAV_ITEMS = [
  { to: '/', text: 'Home', icon: <FiHome /> },
  { to: '/image', text: 'Image Tools', icon: <FiImage /> },
  { to: '/pdf', text: 'PDF Tools', icon: <FiFileText /> },
  { to: '/more', text: 'More Tools', icon: <FiGrid /> },
];

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block w-full text-center px-4 py-2 rounded-full text-sm font-semibold transition-colors text-gray-700 dark:text-gray-200 ${
        isActive 
          ? 'bg-primary text-white' 
          : 'hover:bg-gray-300/60 dark:hover:bg-dark-surface'
      }`
    }
  >
    {children}
  </NavLink>
);

const Navbar = ({ darkMode, isMobile = false }) => {
  if (isMobile) {
    return (
      <nav className="flex flex-col items-center space-y-2 py-2">
        <NavItem to="/">Home</NavItem>
        <NavItem to="/image">Image Tools</NavItem>
        <NavItem to="/pdf">PDF Tools</NavItem>
        <NavItem to="/more">More Tools</NavItem>
      </nav>
    );
  }

  return (
    <nav className="flex items-center space-x-2 rounded-full bg-gray-200/80 dark:bg-dark-surface/80 p-1.5 backdrop-blur-sm">
      <NavItem to="/"><FiHome /> Home</NavItem>
      <NavItem to="/image"><FiImage /> Image</NavItem>
      <NavItem to="/pdf"><FiFileText /> PDF</NavItem>
      <NavItem to="/more"><FiGrid /> More</NavItem>
    </nav>
  );
};

export default Navbar; 