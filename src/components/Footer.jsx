import React from 'react';

export default function Footer({ darkMode }) {
  return (
    <footer
      className={`w-full border-t ${
        darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      } px-6 py-4 text-center`}
    >
      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
        © 2025 ImageWhiz. All rights reserved.
      </p>
    </footer>
  );
} 