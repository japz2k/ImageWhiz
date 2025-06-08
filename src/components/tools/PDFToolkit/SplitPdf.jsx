import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import { renderPdfToImages } from './pdfUtils';
import { FiFile, FiUploadCloud, FiScissors, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Thumbnail = ({ src, pageNum, isSelected, onSelect }) => (
  <motion.div
    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200
      ${isSelected ? 'border-primary shadow-lg' : 'border-transparent hover:border-primary/50'}`}
    onClick={() => onSelect(pageNum - 1)}
    whileHover={{ y: -5 }}
  >
    <img src={src} alt={`Page ${pageNum}`} className="w-full h-auto" />
    <div className="absolute bottom-0 left-0 bg-black/50 text-white text-xs px-2 py-1 rounded-tr-lg">
      {pageNum}
    </div>
    {isSelected && (
      <div className="absolute inset-0 bg-primary/70 flex items-center justify-center">
        <FiCheckCircle className="text-white text-4xl" />
      </div>
    )}
  </motion.div>
);

export default function SplitPdf({ darkMode }) {
  const [file, setFile] = useState(null);
  const [thumbnails, setThumbnails] = useState([]);
  const [selectedPages, setSelectedPages] = useState(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      setFile(uploadedFile);
      setError(null);
      setThumbnails([]);
      setSelectedPages(new Set());
      setIsGenerating(true);
      try {
        const images = await renderPdfToImages(uploadedFile);
        setThumbnails(images);
      } catch (e) {
        console.error("Failed to render PDF thumbnails:", e);
        setError("Could not render the PDF. It may be corrupted or protected.");
        setFile(null);
      } finally {
        setIsGenerating(false);
      }
    } else {
      setError("Please upload a valid PDF file.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] }, multiple: false });

  const togglePageSelection = (pageIndex) => {
    const newSelection = new Set(selectedPages);
    if (newSelection.has(pageIndex)) {
      newSelection.delete(pageIndex);
    } else {
      newSelection.add(pageIndex);
    }
    setSelectedPages(newSelection);
  };

  const handleSplit = async () => {
    if (!file || selectedPages.size === 0) {
      setError("Please select at least one page to split.");
      return;
    }
    setIsProcessing(true);
    setError(null);

    try {
      const pageIndices = Array.from(selectedPages).sort((a, b) => a - b);
      const pdfBytes = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(pdfBytes);
      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(originalPdf, pageIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));
      
      const newPdfBytes = await newPdf.save();
      const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.name.replace('.pdf', '')}_split.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      setError("An error occurred while splitting the PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <div {...getRootProps()} className={`p-10 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-slate-400/80 hover:border-primary'}`}>
          <input {...getInputProps()} />
          <FiUploadCloud className="mx-auto text-4xl text-slate-500 mb-2" />
          <p className="font-semibold text-slate-700 dark:text-slate-300">Drag & drop a single PDF here, or click to select</p>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <FiFile className="text-red-500 flex-shrink-0" />
              <span className="font-medium text-slate-700 dark:text-slate-300">{file.name}</span>
            </div>
            <button onClick={() => setFile(null)} className="font-bold text-slate-500 hover:text-red-500">Change File</button>
          </div>
          
          {isGenerating && <div className="text-center p-8"><div className="w-8 h-8 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin"></div><p className="mt-2">Generating Thumbnails...</p></div>}
          
          {thumbnails.length > 0 &&
            <div>
              <p className="text-center text-sm text-slate-600 dark:text-slate-400 mb-4">Click on the pages to select them for your new PDF.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {thumbnails.map((src, index) => (
                  <Thumbnail key={index} src={src} pageNum={index + 1} isSelected={selectedPages.has(index)} onSelect={togglePageSelection} />
                ))}
              </div>
            </div>
          }
        </div>
      )}

      {error && <div className="p-3 my-4 rounded-lg bg-red-100 border border-red-400 text-red-700">{error}</div>}

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSplit}
          disabled={selectedPages.size === 0 || isProcessing || isGenerating}
          className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isProcessing ? 'Splitting...' : `Split & Download (${selectedPages.size} pages)`}
          {isProcessing ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FiScissors />}
        </button>
      </div>
    </div>
  );
} 