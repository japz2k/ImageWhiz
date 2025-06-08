import { useState } from 'react';
import { motion } from 'framer-motion';
import { PDF_TOOLS } from './constants';
import ComingSoon from '../../ComingSoon';
import MergePdf from './MergePdf';
import SplitPdf from './SplitPdf';
import CompressPdf from './CompressPdf';


const PDFToolCard = ({ tool, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.07, y: -7 }}
    whileTap={{ scale: 0.97 }}
    className="group relative cursor-pointer focus-within:ring-2 focus-within:ring-primary outline-none"
    onClick={() => onClick(tool.id)}
    tabIndex={0}
    aria-label={tool.label}
    title={tool.description}
    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick(tool.id); }}
    role="button"
  >
    <div className="p-7 rounded-2xl text-center shadow-lg transition-all duration-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/70 hover:border-primary dark:hover:border-primary h-full flex flex-col justify-center items-center group-focus:ring-2 group-focus:ring-primary">
      <div className="text-4xl mb-4 mx-auto text-primary dark:text-primary-light transition-colors drop-shadow">{tool.icon}</div>
      <h3 className="font-semibold text-lg text-gray-800 dark:text-slate-100 mb-1">{tool.label}</h3>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute left-1/2 -translate-x-1/2 bottom-2 w-48 pointer-events-none z-10">
        <span className="block text-xs text-center text-white bg-primary/90 rounded px-2 py-1 shadow-lg">
          {tool.description}
        </span>
      </div>
    </div>
  </motion.div>
);

export default function PDFToolkit({ darkMode }) {
  const [activeTool, setActiveTool] = useState(null);

  const renderActiveTool = () => {
    switch (activeTool) {
      case 'merge-pdf':
        return <MergePdf darkMode={darkMode} />;
      case 'split-pdf':
        return <SplitPdf darkMode={darkMode} />;
      case 'compress-pdf':
        return <CompressPdf darkMode={darkMode} />;

      default:
        return <ComingSoon />;
    }
  };

  if (activeTool) {
    return (
      <div>
        <motion.button
          onClick={() => setActiveTool(null)}
          className="mb-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary shadow transition-transform"
          aria-label="Back to PDF Tools"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
        >
          &larr; Back to PDF Tools
        </motion.button>
        <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-800/50 backdrop-blur-lg border border-gray-400/80 dark:border-slate-700/50 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">{PDF_TOOLS.find(t => t.id === activeTool)?.label}</h2>
          {renderActiveTool()}
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