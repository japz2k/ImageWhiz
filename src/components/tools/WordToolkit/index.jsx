import React from 'react';

export default function WordToolkit({ files, onFilesChange, darkMode }) {
  return (
    <div className="p-6">
      <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Word Tools
      </h2>
      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Word document tools coming soon...
      </p>
    </div>
  );
} 