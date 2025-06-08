import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PDFDocument } from 'pdf-lib';
import { FiFile, FiUploadCloud, FiMove, FiX, FiCheckCircle } from 'react-icons/fi';

const SortablePdfItem = ({ id, file, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 p-3 bg-white/80 dark:bg-slate-800/80 rounded-lg border border-slate-300 dark:border-slate-700">
      <div {...attributes} {...listeners} className="cursor-move text-slate-500"><FiMove /></div>
      <FiFile className="text-red-500 flex-shrink-0" />
      <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{file.name}</span>
      <span className="text-xs text-slate-500 dark:text-slate-400">{(file.size / 1024).toFixed(1)} KB</span>
      <button onClick={() => onRemove(id)} className="p-1 text-slate-500 hover:text-red-500"><FiX /></button>
    </div>
  );
};

export default function MergePdf({ darkMode }) {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback(acceptedFiles => {
    const newFiles = acceptedFiles
      .filter(file => file.type === 'application/pdf')
      .map(file => ({
        id: `${file.path}-${file.lastModified}`,
        file
      }));
    setFiles(f => [...f, ...newFiles]);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] }
  });

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setFiles((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const removeFile = (id) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError("Please upload at least two PDF files to merge.");
      return;
    }
    setIsProcessing(true);
    setError(null);

    try {
      const mergedPdf = await PDFDocument.create();
      for (const { file } of files) {
        const pdfBytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      
      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (e) {
      console.error(e);
      setError("An error occurred while merging the PDFs. Please ensure all files are valid PDFs.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div {...getRootProps()} className={`p-10 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/10' : 'border-slate-400/80 hover:border-primary'}`}>
        <input {...getInputProps()} />
        <FiUploadCloud className="mx-auto text-4xl text-slate-500 dark:text-slate-400 mb-2" />
        <p className="font-semibold text-slate-700 dark:text-slate-300">Drag & drop some PDF files here, or click to select</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">Only .pdf files will be accepted</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">Files to Merge ({files.length})</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Drag and drop the files to set the merge order.</p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={files.map(f => f.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {files.map(({ id, file }) => <SortablePdfItem key={id} id={id} file={file} onRemove={removeFile} />)}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {error && <div className="p-3 rounded-lg bg-red-100 border border-red-400 text-red-700">{error}</div>}

      <div className="flex justify-end pt-4">
        <button
          onClick={handleMerge}
          disabled={files.length < 2 || isProcessing}
          className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isProcessing ? 'Merging...' : 'Merge PDFs and Download'}
          {isProcessing && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
          {!isProcessing && <FiCheckCircle />}
        </button>
      </div>
    </div>
  );
} 