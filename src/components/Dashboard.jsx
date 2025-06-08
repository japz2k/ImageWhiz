import React from 'react';
import { FiZap, FiImage, FiFileText, FiGitMerge, FiScissors, FiMinimize2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const imageFeatures = [
  {
    title: 'Compress Image',
    description: 'Reduce image file size with minimal quality loss.',
    icon: <FiZap className="text-cyan-500" />, path: '/image', pro: false
  },
  {
    title: 'Crop Image',
    description: 'Cut out unwanted parts of your images.',
    icon: <FiImage className="text-cyan-500" />, path: '/image', pro: false
  }
];

const pdfFeatures = [
  {
    title: 'Merge PDFs',
    description: 'Combine multiple PDF files into one.',
    icon: <FiGitMerge className="text-violet-500" />, path: '/pdf', tool: 'merge-pdf'
  },
  {
    title: 'Split PDF',
    description: 'Extract selected pages into a new PDF.',
    icon: <FiScissors className="text-violet-500" />, path: '/pdf', tool: 'split-pdf'
  },
  {
    title: 'Compress PDF',
    description: 'Reduce the file size of your PDF document.',
    icon: <FiMinimize2 className="text-violet-500" />, path: '/pdf', tool: 'compress-pdf'
  }
];

export default function Dashboard() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12 bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="text-center mb-12 bg-white/80 dark:bg-transparent rounded-2xl shadow-md p-8 md:p-12 mb-16 border border-gray-200 dark:border-none">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-cyan-500 via-cyan-400 to-violet-500 bg-clip-text text-transparent dark:from-cyan-400 dark:to-violet-400 drop-shadow font-sans" style={{ fontFamily: `'Space Grotesk', 'Inter', 'Poppins', 'Segoe UI', 'sans-serif'` }}>Welcome to ImageWhiz</h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
          Your all-in-one toolkit for fast, secure, and beautiful image & PDF editing. No sign-up required.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Link to="/pdf" className="px-6 py-3 bg-violet-500 text-white rounded-lg font-semibold shadow transition border-4 border-violet-500 hover:border-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 hover:bg-gradient-to-r hover:from-violet-500 hover:to-violet-700 hover:text-white dark:border-transparent dark:hover:bg-violet-700">Try PDF Tools</Link>
          <Link to="/image" className="px-6 py-3 bg-cyan-500 text-white rounded-lg font-semibold shadow transition border-4 border-cyan-500 hover:border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-cyan-700 hover:text-white dark:border-transparent dark:hover:bg-cyan-700">Try Image Tools</Link>
        </div>
      </section>

      {/* PDF Tools Quick Access */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-violet-500 to-violet-700 bg-clip-text text-transparent flex items-center gap-2 justify-center dark:from-violet-400 dark:to-violet-600">
          <FiFileText /> Popular PDF Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* PDF Tool Cards */}
          {pdfFeatures.map((tool, i) => (
            <Link
              to={{ pathname: tool.path, state: { tool: tool.tool } }}
              key={i}
              className="group bg-white/90 dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-xl border-4 border-violet-500 hover:border-violet-700 dark:border-slate-700 transition-transform hover:-translate-y-1 flex flex-col items-center focus:outline-none focus:ring-2 focus:ring-violet-500 hover:bg-gradient-to-br hover:from-violet-500/10 hover:to-violet-700/10 dark:hover:bg-slate-800"
              aria-label={tool.title}
            >
              <div className="text-4xl mb-3 text-primary dark:text-primary-light">{tool.icon}</div>
              <h3 className="font-semibold text-lg mb-1 text-gray-800 dark:text-slate-100">{tool.title}</h3>
              <p className="text-gray-500 dark:text-gray-300 text-sm mb-2 text-center">{tool.description}</p>
              <span className="mt-auto inline-block px-4 py-2 bg-violet-500 text-white rounded-lg text-xs font-semibold border-4 border-violet-500 group-hover:border-violet-700 transition group-hover:bg-gradient-to-r group-hover:from-violet-500 group-hover:to-violet-700 group-hover:text-white dark:border-transparent dark:group-hover:bg-violet-700">Open</span>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/pdf" className="inline-block px-6 py-2 bg-violet-500 text-white rounded-lg font-semibold shadow border-4 border-violet-500 hover:border-violet-700 hover:bg-gradient-to-r hover:from-violet-500 hover:to-violet-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition dark:bg-violet-700 dark:border-violet-700">
            See all PDF Tools
          </Link>
        </div>
      </section>

      {/* Image Tools Section */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-500 to-cyan-700 bg-clip-text text-transparent flex items-center gap-2 justify-center dark:from-cyan-400 dark:to-cyan-600">
          <FiImage /> Image Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Image Tool Cards */}
          {imageFeatures.map((f, i) => (
            <Link
              to={f.path}
              key={i}
              className="card p-6 shadow-lg bg-white/90 dark:bg-slate-800 rounded-2xl border-4 border-cyan-500 hover:border-cyan-700 dark:border-slate-700 group transition-transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-cyan-500 hover:bg-gradient-to-br hover:from-cyan-500/10 hover:to-cyan-700/10 dark:hover:bg-slate-800"
              aria-label={f.title}
            >
              <div className="flex items-center mb-2">
                {f.icon}
                <span className="ml-2 text-xl font-semibold">{f.title}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{f.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Pro Upsell Section */}
      <section className="mt-8 text-center bg-white/80 dark:bg-transparent rounded-2xl shadow p-8 border border-gray-200 dark:border-none">
        <p className="text-gray-500 dark:text-gray-400">Upgrade to Pro for AI-powered tools and advanced features!</p>
        <button className="mt-4 px-6 py-2 bg-accent text-white rounded-lg shadow transition border-4 border-accent hover:border-primary focus:outline-none focus:ring-2 focus:ring-accent hover:bg-gradient-to-r hover:from-accent hover:to-primary hover:text-white dark:border-transparent dark:hover:bg-accent/90" aria-label="Upgrade to Pro">
          Upgrade to Pro
        </button>
      </section>
    </main>
  );
}
