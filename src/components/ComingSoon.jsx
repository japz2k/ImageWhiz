import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

const ComingSoon = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-10 bg-gray-100 dark:bg-gray-800 rounded-2xl">
    <FiAlertTriangle className="text-5xl text-yellow-500 mb-4" />
    <h2 className="text-4xl font-bold text-gray-800 dark:text-white">Coming Soon!</h2>
    <p className="text-lg mt-2 text-gray-600 dark:text-gray-300">This set of tools is under active development. Please check back later.</p>
  </div>
);

export default ComingSoon; 