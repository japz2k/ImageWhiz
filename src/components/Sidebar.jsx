import { Link } from 'react-router-dom';
import { FiImage, FiFile, FiFileText, FiGrid, FiMonitor } from 'react-icons/fi';

const sections = [
  { id: 'images', label: 'Images', icon: <FiImage />, path: '/images' },
  { id: 'pdf', label: 'PDF', icon: <FiFile />, path: '/pdf' },
  { id: 'word', label: 'Word', icon: <FiFileText />, path: '/word' },
  { id: 'excel', label: 'Excel', icon: <FiGrid />, path: '/excel' },
  { id: 'powerpoint', label: 'PowerPoint', icon: <FiMonitor />, path: '/powerpoint' }
];

export default function Sidebar({ selectedSection, onSectionChange, darkMode }) {
  return (
    <aside className={`w-64 min-h-screen p-4 ${darkMode ? 'bg-gray-800' : 'bg-white border-r border-gray-200'}`}>
      <nav>
        <ul className="space-y-2">
          {sections.map(section => (
            <li key={section.id}>
              <Link
                to={section.path}
                onClick={() => onSectionChange(section.id)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  selectedSection === section.id
                    ? darkMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-700'
                    : darkMode
                      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl mr-3">{section.icon}</span>
                <span>{section.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
} 