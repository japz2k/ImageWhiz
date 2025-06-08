import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ImageToolkit from './components/tools/ImageToolkit';
import Header from './components/Header';
import ComingSoon from './components/ComingSoon';
import PDFToolkit from './components/tools/PDFToolkit';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [files, setFiles] = useState([]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen font-sans relative ${darkMode ? 'dark bg-slate-900' : 'bg-gray-50'}`}>
       {darkMode && (
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(220,38,38,0.3),rgba(255,255,255,0))] opacity-70 animate-aurora pointer-events-none" />
      )}
      <div className="relative z-10">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/image" replace />} />
            <Route path="/image" element={
                <ImageToolkit
                  files={files}
                  darkMode={darkMode}
                onFilesChange={setFiles} 
                isPro={false} // This can be controlled by auth state later
              />
            }/>
            <Route path="/pdf" element={<PDFToolkit darkMode={darkMode} />} />
            <Route path="/more" element={<ComingSoon />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App; 