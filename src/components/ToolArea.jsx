import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import PDFToolkit from './tools/PDFToolkit/index';
import ImageToolkit from './tools/ImageToolkit/index';
import WordToolkit from './tools/WordToolkit/index';
import ExcelToolkit from './tools/ExcelToolkit/index';
import PowerPointToolkit from './tools/PowerPointToolkit/index';

const ACCEPTED_FILE_TYPES = {
  images: {
    'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  },
  pdf: {
    'application/pdf': ['.pdf']
  },
  word: {
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/msword': ['.doc']
  },
  excel: {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'application/vnd.ms-excel': ['.xls']
  },
  powerpoint: {
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
    'application/vnd.ms-powerpoint': ['.ppt']
  }
};

const FILE_TYPE_ICONS = {
  pdf: '📄',
  doc: '📝',
  docx: '📝',
  xls: '📊',
  xlsx: '📊',
  ppt: '📽️',
  pptx: '📽️',
  default: '📄'
};

export default function ToolArea({ section, darkMode, files, onFilesChange }) {
  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: file.type.startsWith('image/') 
        ? URL.createObjectURL(file)
        : null
    }));
    onFilesChange([...files, ...newFiles]);
  }, [files, onFilesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES[section] || {},
    multiple: true
  });

  const getFileIcon = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    return FILE_TYPE_ICONS[extension] || FILE_TYPE_ICONS.default;
  };

  const getToolkit = () => {
    switch (section) {
      case 'images':
        return <ImageToolkit files={files} darkMode={darkMode} onFilesChange={onFilesChange} />;
      case 'pdf':
        return <PDFToolkit files={files} darkMode={darkMode} onFilesChange={onFilesChange} />;
      case 'word':
        return <WordToolkit files={files} darkMode={darkMode} onFilesChange={onFilesChange} />;
      case 'excel':
        return <ExcelToolkit files={files} darkMode={darkMode} onFilesChange={onFilesChange} />;
      case 'powerpoint':
        return <PowerPointToolkit files={files} darkMode={darkMode} onFilesChange={onFilesChange} />;
      default:
        return null;
    }
  };

  if (files.length > 0) {
    return getToolkit();
  }

  return (
    <div className="p-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors
          ${isDragActive
            ? darkMode
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-blue-500 bg-blue-50'
            : darkMode
              ? 'border-gray-700 hover:border-gray-600'
              : 'border-gray-300 hover:border-gray-400'
          }`}
      >
        <input {...getInputProps()} />
        <div className={`text-lg mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag & drop files here, or click to select files</p>
          )}
        </div>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {section === 'images' && 'Supports: JPG, JPEG, PNG, GIF, WebP'}
          {section === 'pdf' && 'Supports: PDF'}
          {section === 'word' && 'Supports: DOC, DOCX'}
          {section === 'excel' && 'Supports: XLS, XLSX'}
          {section === 'powerpoint' && 'Supports: PPT, PPTX'}
        </p>
      </div>
    </div>
  );
} 