import { FiX, FiCheck } from 'react-icons/fi';

export default function ProModal({ onClose, darkMode }) {
  const features = [
    'Batch resize multiple images',
    'Add text or image watermarks',
    'AI-powered background removal',
    'Smart auto-compress',
    'Cloud storage upload',
    'History & restore functionality',
    'Face detection & blur',
    'Auto image enhancement',
    'Color palette extraction'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`relative w-full max-w-lg p-6 rounded-xl shadow-xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${
            darkMode
              ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
              : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          <FiX className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Upgrade to Pro
          </h2>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Get access to all premium features and unlock the full potential of ImageWhiz
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              <FiCheck className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="text-center space-y-4">
          <button
            onClick={() => {/* Implement payment logic */}}
            className="w-full py-3 px-6 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Upgrade Now - $9.99/month
          </button>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            30-day money-back guarantee. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
} 