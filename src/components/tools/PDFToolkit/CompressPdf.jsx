import { useState, useRef } from 'react';
import { FiMinimize2, FiUploadCloud, FiDownload } from 'react-icons/fi';
import { PDFDocument } from 'pdf-lib';

export default function CompressPdf({ darkMode }) {
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);
  const fileInputRef = useRef();

  // Simple PDF compression: removes metadata, unused objects, and optionally downsamples images (not supported by pdf-lib yet)
  // For browser, this is the best possible lossless compression
  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }
    setError(null);
    setPdfFile(file);
    setCompressedSize(null);
  };

  const handleCompress = async () => {
    if (!pdfFile) return;
    setLoading(true);
    setError(null);
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { updateMetadata: true });
      // Remove metadata
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('');
      pdfDoc.setCreator('');
      // Remove unused objects (pdf-lib does this on save)
      const pdfBytes = await pdfDoc.save();
      setCompressedSize(pdfBytes.byteLength);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'compressed.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to compress PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-6 rounded-xl shadow bg-white dark:bg-slate-800 max-w-xl mx-auto mt-8`}>
      <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        <FiMinimize2 /> Compress PDF
      </h2>
      <div className="mb-4 flex items-center gap-4">
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          onChange={handlePdfUpload}
          className="hidden"
        />
        <button
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={() => fileInputRef.current.click()}
        >
          <FiUploadCloud /> Upload PDF
        </button>
        {pdfFile && <span className="text-xs text-gray-500 dark:text-gray-400">{pdfFile.name}</span>}
      </div>
      {error && <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
      {pdfFile && (
        <div className="mb-4">
          <button
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={handleCompress}
            disabled={loading}
          >
            <FiDownload /> {loading ? 'Compressing...' : 'Compress & Download'}
          </button>
        </div>
      )}
      {compressedSize && (
        <div className="mb-2 text-green-700 dark:text-green-400 text-sm">
          Compressed PDF size: {(compressedSize / 1024).toFixed(2)} KB
        </div>
      )}
      {!pdfFile && <div className="text-sm text-gray-500 dark:text-gray-400">Upload a PDF to compress and reduce its file size.</div>}
    </div>
  );
}
