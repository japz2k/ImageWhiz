import { useState } from 'react';
import { motion } from 'framer-motion';
import { PDF_TOOLS } from './constants';
import ComingSoon from '../../ComingSoon';

const PDFToolCard = ({ tool, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -5 }}
    className="group relative cursor-pointer"
    onClick={() => onClick(tool.id)}
  >
    <div className="p-6 rounded-xl text-center transition-all duration-300 backdrop-blur-sm bg-light-surface/60 border-2 border-slate-300 hover:border-primary dark:bg-dark-surface/70 dark:border-2 dark:border-transparent dark:hover:border-primary-light h-full flex flex-col justify-center items-center">
      <div className="text-4xl mb-4 mx-auto text-primary dark:text-primary-light transition-colors">{tool.icon}</div>
      <h3 className="font-semibold text-md text-light-text-primary dark:text-dark-text-primary">{tool.label}</h3>
      <div className="absolute inset-0 top-auto p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 bg-gray-200/80 dark:bg-gray-900/80 rounded-md px-2 py-1">
          {tool.description}
        </p>
      </div>
    </div>
  </motion.div>
);

export default function PDFToolkit({ darkMode }) {
  const [activeTool, setActiveTool] = useState(null);

  if (activeTool) {
    return (
      <div>
        <button 
          onClick={() => setActiveTool(null)}
          className="mb-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          &larr; Back to PDF Tools
        </button>
        <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-800/50 backdrop-blur-lg border border-gray-400/80 dark:border-slate-700/50 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">{PDF_TOOLS.find(t => t.id === activeTool)?.label}</h2>
          <ComingSoon />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-12">
        <h1 className={`text-4xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          PDF Toolkit
        </h1>
        <p className={`mt-4 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          A comprehensive suite of tools to manage and manipulate your PDF files.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {PDF_TOOLS.map(tool => (
          <PDFToolCard key={tool.id} tool={tool} onClick={setActiveTool} />
        ))}
      </div>
    </div>
  );
} 