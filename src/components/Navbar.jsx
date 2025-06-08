import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiImage, FiFileText, FiGrid } from 'react-icons/fi';

const NAV_ITEMS = [
  { to: '/image', text: 'Image Tools', icon: <FiImage /> },
  { to: '/pdf', text: 'PDF Tools', icon: <FiFileText /> },
  { to: '/more', text: 'More Tools', icon: <FiGrid /> },
];

const Navbar = ({ darkMode }) => {
  const linkStyle = "flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200";
  const activeLinkStyle = "bg-primary text-white";
  const inactiveLinkStyle = darkMode ? "text-dark-text-secondary hover:bg-dark-surface" : "text-neutral-dark hover:bg-primary/10";

  return (
    <nav className="flex items-center space-x-2">
      {NAV_ITEMS.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle}`}
        >
          {item.icon}
          <span className="font-semibold">{item.text}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Navbar; 