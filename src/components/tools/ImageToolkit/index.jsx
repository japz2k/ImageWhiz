import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import imageCompression from 'browser-image-compression';
import JSZip from 'jszip';
import jsPDF from 'jspdf';
import { FREE_TOOLS, OUTPUT_FORMATS, ROTATE_OPTIONS } from './constants.jsx';
import { FiPlus, FiX } from 'react-icons/fi';
import CropPreview from './CropPreview';

function FileCard({ file, darkMode, isSelected, onClick, onRemove }) {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      onClick={onClick}
      className={`relative group cursor-pointer rounded-lg overflow-hidden transition-shadow ${
        darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
      } ${isSelected ? 'ring-4 ring-primary-dark shadow-lg' : ''}`}
    >
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(file.id);
        }}
        className="absolute top-2 right-2 z-10 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Remove image"
        whileHover={{ scale: 1.2, backgroundColor: '#ef4444' }}
        whileTap={{ scale: 0.9 }}
    >
        <FiX size={16} />
      </motion.button>
      {isSelected && <div className="absolute inset-0 bg-primary bg-opacity-20" />}
      <div className="aspect-square relative">
        <img
          src={file.preview}
          alt={file.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <div className={`text-sm font-medium truncate ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {file.name}
        </div>
        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {formatFileSize(file.size)}
        </div>
      </div>
    </motion.div>
  );
}

function AddImageButton({ darkMode, getRootProps, getInputProps, isDragActive }) {
  return (
    <div
      {...getRootProps()}
      className={`aspect-square flex items-center justify-center rounded-lg cursor-pointer transition-colors ${
        isDragActive
          ? darkMode
            ? 'bg-blue-500/20 border-blue-500'
            : 'bg-blue-50 border-blue-500'
          : darkMode
            ? 'bg-gray-800 hover:bg-gray-700 border-gray-700'
            : 'bg-white hover:bg-gray-50 border-gray-200'
      } border-2 border-dashed`}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        <FiPlus className={`w-8 h-8 mx-auto mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        <p className={`text-sm ${darkMode ? 'text-neutral' : 'text-neutral-dark/70'}`}>
          {isDragActive ? 'Drop them here!' : 'Drag & drop or click to upload'}
        </p>
      </div>
    </div>
  );
}

export default function ImageToolkit({ files, darkMode, onFilesChange }) {
  const [selectedTools, setSelectedTools] = useState(new Set());
  const [toolSettings, setToolSettings] = useState({
    compress: { quality: 80 },
    convert: { format: 'original' },
    rotate: { option: 'rotate90' },
    crop: { rect: null },
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [activeTool, setActiveTool] = useState(null);

  const modalPreviewFile = selectedImages.size > 0 
    ? files.find(f => f.id === Array.from(selectedImages)[0]) 
    : files[0] || null;

  const handleToolClick = (tool) => {
    if (files.length === 0) {
      setError('Please upload an image before selecting a tool.');
      return;
    }
    setActiveTool(tool.id);
  };

  useEffect(() => {
    setError(null);
    setSelectedImages(new Set());
  }, [files]);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type,
      width: 0,
      height: 0,
    }));

    const loadPromises = newFiles.map(f => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = f.preview;
        img.onload = () => {
          resolve({ ...f, width: img.width, height: img.height });
        };
      });
    });

    Promise.all(loadPromises).then(loadedFiles => {
      onFilesChange(prev => [...prev, ...loadedFiles]);
    });
  }, [onFilesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'] },
    multiple: true
  });

  const toggleImageSelection = (imageId) => {
    const newSelection = new Set(selectedImages);
    if (newSelection.has(imageId)) {
      newSelection.delete(imageId);
    } else {
      newSelection.add(imageId);
    }
    setSelectedImages(newSelection);
  };

  const selectAllImages = () => setSelectedImages(new Set(files.map(file => file.id)));
  const deselectAllImages = () => setSelectedImages(new Set());
  const onClearAll = () => {
    onFilesChange([]);
    setSelectedImages(new Set());
    setSelectedTools(new Set());
  };

  const removeFile = (fileId) => {
    onFilesChange(prev => prev.filter(f => f.id !== fileId));
    const newSelection = new Set(selectedImages);
    if (newSelection.has(fileId)) {
      newSelection.delete(fileId);
      setSelectedImages(newSelection);
    }
  };

  const updateToolSettings = (toolId, settings) => {
    setToolSettings(prev => ({
      ...prev,
      [toolId]: { ...prev[toolId], ...settings }
    }));
  };

  const applyCompression = async (images, settings) => {
    console.log(`[Compression] Starting for ${images.length} images.`);
    return Promise.all(images.map(async (img, i) => {
      if (!(img.blob instanceof Blob)) { console.error(`[Compression] Invalid input for image ${i}.`, img); return img; }
      console.log(`[Compression] Input ${i}:`, img.blob.type, `${(img.blob.size / 1024).toFixed(2)} KB`);
      
      const compressedBlob = await imageCompression(img.blob, { 
        initialQuality: settings.quality / 100, useWebWorker: true 
      });
      
      console.log(`[Compression] Output ${i}:`, compressedBlob.type, `${(compressedBlob.size / 1024).toFixed(2)} KB`);
      return { ...img, blob: compressedBlob };
    }));
  };

  const applyConvert = async (images, settings) => {
    console.log(`[Convert] Starting for ${images.length} images.`);
    return Promise.all(images.map(async (img, i) => {
      if (!(img.blob instanceof Blob)) { console.error(`[Convert] Invalid input for image ${i}.`, img); return img; }
      console.log(`[Convert] Input ${i}:`, img.blob.type, `${(img.blob.size / 1024).toFixed(2)} KB`);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const imageEl = document.createElement('img');
      const objectUrl = URL.createObjectURL(img.blob);
      imageEl.src = objectUrl;
      await new Promise(res => { imageEl.onload = res; });
      URL.revokeObjectURL(objectUrl);
      canvas.width = imageEl.width;
      canvas.height = imageEl.height;
      ctx.drawImage(imageEl, 0, 0);
      const format = settings.format;
      const mimeType = format === 'original' ? img.blob.type : `image/${format}`;
      const blob = await new Promise(resolve => {
        if (format === 'original') resolve(img.blob);
        else canvas.toBlob(resolve, mimeType, 0.92);
      });
      const ext = format === 'original' ? (img.blob.type.split('/')[1] || 'bin') : format;
      const finalBlob = blob || img.blob;
      console.log(`[Convert] Output ${i}:`, finalBlob.type, `${(finalBlob.size / 1024).toFixed(2)} KB`);
      return { ...img, name: img.name.replace(/(\.[^/.]+)?$/, `_converted.${ext}`), blob: finalBlob };
    }));
  };

  const applyRotate = async (images, settings) => {
    console.log(`[Rotate] Starting for ${images.length} images.`);
    return Promise.all(images.map(async (img, i) => {
      if (!(img.blob instanceof Blob)) { console.error(`[Rotate] Invalid input for image ${i}.`, img); return img; }
      console.log(`[Rotate] Input ${i}:`, img.blob.type, `${(img.blob.size / 1024).toFixed(2)} KB`);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const image = document.createElement('img');
      const objectUrl = URL.createObjectURL(img.blob);
      image.src = objectUrl;
      await new Promise(res => { image.onload = res; });
      URL.revokeObjectURL(objectUrl);

      let rotate = 0, flipH = false, flipV = false;
      const option = settings.option;
      if (option === 'rotate90') rotate = 90;
      if (option === 'rotate180') rotate = 180;
      if (option === 'rotate270') rotate = 270;
      if (option === 'flipH') flipH = true;
      if (option === 'flipV') flipV = true;

      if (rotate % 180 === 90) {
        canvas.width = image.height;
        canvas.height = image.width;
      } else {
        canvas.width = image.width;
        canvas.height = image.height;
      }

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotate * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(image, -image.width / 2, -image.height / 2);
      ctx.restore();

      const blob = await new Promise(res => canvas.toBlob(res, img.blob.type));
      const finalBlob = blob || img.blob;
      console.log(`[Rotate] Output ${i}:`, finalBlob.type, `${(finalBlob.size / 1024).toFixed(2)} KB`);
      return { ...img, blob: finalBlob };
    }));
  };

  const applyCrop = async (images, settings) => {
    console.log(`[Crop] Starting for ${images.length} images.`);
    const rect = settings.rect;
    // If no crop rectangle is defined or it has no area, do nothing.
    if (!rect || rect.w === 0 || rect.h === 0) {
      console.warn('Crop tool selected without a valid crop area. Skipping crop operation.');
      return images;
    }

    return Promise.all(images.map(async (img, i) => {
      try {
        if (!(img.blob instanceof Blob)) { console.error(`[Crop] Invalid input for image ${i}.`, img); return img; }
        console.log(`[Crop] Input ${i}:`, img.blob.type, `${(img.blob.size / 1024).toFixed(2)} KB`);
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const image = document.createElement('img');
        
        const objectUrl = URL.createObjectURL(img.blob);
        image.src = objectUrl;
        await new Promise((resolve, reject) => {
          image.onload = resolve;
          image.onerror = (err) => reject(new Error(`Failed to load image for cropping: ${img.name}`));
        });
        URL.revokeObjectURL(objectUrl);

        // Clamp the crop rectangle to the image's dimensions to prevent errors
        const cropX = Math.max(0, rect.x);
        const cropY = Math.max(0, rect.y);
        const cropW = Math.min(rect.w, image.width - cropX);
        const cropH = Math.min(rect.h, image.height - cropY);

        if (cropW <= 0 || cropH <= 0) {
          console.warn(`Invalid crop for image ${img.name}, returning original.`);
          return img;
        }

        canvas.width = cropW;
        canvas.height = cropH;
        ctx.drawImage(image, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

        const blob = await new Promise(res => canvas.toBlob(res, img.blob.type));
        
        if (!blob) {
          console.warn(`[Crop] Could not create blob for cropped image ${img.name}, returning original.`);
          return img;
        }
        console.log(`[Crop] Output ${i}:`, blob.type, `${(blob.size / 1024).toFixed(2)} KB`);
        return { ...img, blob };
      } catch(e) {
        console.error(`[Crop] An error occurred while cropping ${img.name}:`, e);
        return img; // Return original image if any error occurs
      }
    }));
  };

  const processAllTools = async () => {
    setError(null);
    setProcessing(true);
    try {
      let processableImages = files
        .filter(f => selectedImages.size === 0 || selectedImages.has(f.id))
        .map(f => ({ id: f.id, name: f.name, type: f.type, blob: f.file }));

      console.log('[Processing] Starting with:', processableImages);
      const toolFunctions = Array.from(selectedTools);
      console.log('[Processing] Applying tools:', toolFunctions);

      for (const toolId of toolFunctions) {
        switch (toolId) {
          case 'compress':
            processableImages = await applyCompression(processableImages, toolSettings.compress);
            break;
          case 'convert':
            processableImages = await applyConvert(processableImages, toolSettings.convert);
            break;
          case 'rotate':
            processableImages = await applyRotate(processableImages, toolSettings.rotate);
            break;
          case 'crop':
            if (processableImages.length > 1) {
              console.warn("Crop tool is applied with the same settings to all selected images in batch mode.");
            }
            processableImages = await applyCrop(processableImages, toolSettings.crop);
            break;
          default:
            break;
        }
      }
      console.log('[Processing] Finished. Results:', processableImages);
      return processableImages;
    } catch (e) {
      console.error(e);
      setError('Processing failed: ' + e.message);
    } finally {
      setProcessing(false);
    }
  };

  const processAndDownload = async () => {
    const results = await processAllTools();
    if (!results) return;

    const isPdfConversion = toolSettings.convert.format === 'pdf' && selectedTools.has('convert');

    if (isPdfConversion) {
      const doc = new jsPDF();
      for (let i = 0; i < results.length; i++) {
        const item = results[i];

        if (!item || !(item.blob instanceof Blob)) {
          console.warn(`Skipping invalid item in PDF generation:`, item);
          continue;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const imageEl = new Image();
        
        const objectUrl = URL.createObjectURL(item.blob);
        imageEl.src = objectUrl;
        
        await new Promise((resolve, reject) => {
          imageEl.onload = resolve;
          imageEl.onerror = reject;
        });

        URL.revokeObjectURL(objectUrl);
        
        canvas.width = imageEl.width;
        canvas.height = imageEl.height;
        ctx.drawImage(imageEl, 0, 0);
        
        const imgData = canvas.toDataURL('image/jpeg', 0.9);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = doc.internal.pageSize.getHeight();
        const imgProps = doc.getImageProperties(imgData);
        const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
        const w = imgProps.width * ratio;
        const h = imgProps.height * ratio;
        const x = (pdfWidth - w) / 2;
        const y = (pdfHeight - h) / 2;

        if (i > 0) doc.addPage();
        doc.addImage(imgData, 'JPEG', x, y, w, h);
      }
      doc.save('converted_images.pdf');
      return;
    }

    if (results.length === 1) {
      const item = results[0];
      const url = URL.createObjectURL(item.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      const zip = new JSZip();
      results.forEach(item => {
        if (item && item.blob instanceof Blob) {
          zip.file(item.name, item.blob)
        } else {
          console.warn(`Skipping invalid item in zip generation:`, item);
        }
      });
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'processed_images.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="p-4 flex flex-col items-center font-sans">
      {error && (
        <div className="w-full max-w-7xl mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-700 dark:text-red-300 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold text-lg">×</button>
        </div>
      )}
      
      <div className="w-full max-w-7xl mb-12 p-6 rounded-2xl bg-white/60 dark:bg-slate-800/50 backdrop-blur-lg border border-gray-400/80 dark:border-slate-700/50 shadow-lg">
        <h2 className={`text-2xl font-bold mb-6 text-center ${darkMode ? 'text-dark-text-primary' : 'text-gray-800'}`}>
          1. Upload Your Images
        </h2>
        {files.length === 0 ? (
          <div className="flex justify-center mb-8">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors w-full max-w-lg cursor-pointer
                ${isDragActive
                  ? 'border-primary bg-primary/10'
                  : darkMode
                    ? 'border-dark-border hover:border-primary-light hover:bg-primary/5'
                    : 'border-gray-400/80 hover:border-primary'
                }`}
            >
              <input {...getInputProps()} />
              <div className={`text-3xl mb-3 text-primary`}>
                <FiPlus size={48} className="mx-auto" />
              </div>
              <p className={`text-lg font-semibold mb-2 ${darkMode ? 'text-dark-text-primary' : 'text-gray-700'}`}>
                {isDragActive ? 'Drop them here!' : 'Drag & drop or click to upload'}
              </p>
              <p className={`text-sm ${darkMode ? 'text-dark-text-secondary' : 'text-gray-500'}`}>
                Supports all major image formats
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-2">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={selectAllImages} className="px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary-dark/90">Select All</motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={deselectAllImages} className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600">Deselect All</motion.button>
              </div>
              <div className="flex space-x-2">
                {selectedTools.size > 0 && !processing && (
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={processAndDownload} className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90">Download</motion.button>
                )}
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClearAll} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Clear All</motion.button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } },
                  hidden: {},
                }}
              >
                {files.map(file => (
                  <FileCard
                    key={file.id}
                    file={file}
                    darkMode={darkMode}
                    isSelected={selectedImages.has(file.id)}
                    onClick={() => toggleImageSelection(file.id)}
                    onRemove={removeFile}
                  />
                ))}
                <AddImageButton darkMode={darkMode} getRootProps={getRootProps} getInputProps={getInputProps} isDragActive={isDragActive} />
              </motion.div>
            </div>
          </>
        )}
      </div>

      <div className="w-full max-w-7xl mb-8 p-6 rounded-2xl bg-white/60 dark:bg-red-950/20 backdrop-blur-lg border border-gray-400/80 dark:border-red-800/20 shadow-lg">
        <div className="relative mb-8 text-center">
          <hr className={`absolute top-1/2 left-0 w-full border-gray-400/80 dark:border-red-800/30`} />
          <h2 className={`relative inline-block px-4 text-2xl font-bold ${darkMode ? 'bg-red-950/20 text-dark-text-primary' : 'bg-white/60 text-gray-800'}`}>
              2. Choose Your Tools
        </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FREE_TOOLS.map(tool => {
            const isSelected = selectedTools.has(tool.id);
            return (
              <motion.div 
                    key={tool.id}
                className="relative"
              >
                <motion.button
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleToolClick(tool)}
                  className={`group w-full h-full p-4 rounded-xl text-center transition-all duration-300 backdrop-blur-sm hover:shadow-primary/20 hover:shadow-lg
                    ${isSelected
                      ? 'bg-primary text-white shadow-lg ring-2 ring-primary-dark'
                      : 'bg-light-surface/60 border-2 border-slate-300 hover:border-primary dark:bg-dark-surface/70 dark:border-2 dark:border-transparent dark:hover:border-primary-light'
                    }
                  `}
                  >
                  <div className={`text-4xl mb-3 mx-auto transition-colors ${isSelected ? 'text-white' : 'text-primary dark:text-primary-light'}`}>{tool.icon}</div>
                  <div className={`font-semibold text-sm transition-colors ${isSelected ? 'text-white' : 'text-light-text-primary dark:text-dark-text-primary'}`}>{tool.label}</div>
                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 text-xs font-semibold text-white bg-dark-bg/80 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    {tool.description}
            </div>
                </motion.button>
                {isSelected && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const newSelection = new Set(selectedTools);
                      newSelection.delete(tool.id);
                      setSelectedTools(newSelection);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors z-10"
                    aria-label={`Remove ${tool.label} tool`}
                  >
                    <FiX size={16} />
                  </motion.button>
                )}
              </motion.div>
            )
          })}
                  </div>
                </div>

      {activeTool && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-200 p-4">
          <div className={`relative bg-slate-800/80 border border-slate-700 backdrop-blur-lg p-6 rounded-lg transform transition-transform duration-200 ease-out shadow-2xl ${activeTool === 'crop' ? 'w-full max-w-4xl' : 'w-full max-w-md'}`}>
            <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-4">
              <h3 className={`text-lg font-semibold text-slate-100`}>
                {FREE_TOOLS.find(t => t.id === activeTool)?.label} Settings
              </h3>
               <button 
                onClick={() => setActiveTool(null)} 
                className="w-8 h-8 bg-slate-700/80 hover:bg-slate-600/80 rounded-full flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="Close"
              >
                <FiX size={20} />
              </button>
            </div>
            
              <div className="space-y-4">
                {activeTool === 'compress' && (
                  <div>
                    <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">
                      Quality: <span className="font-semibold">{toolSettings.compress.quality}%</span>
                    </label>
                    <input
                    type="range" min="10" max="100"
                      value={toolSettings.compress.quality}
                      onChange={e => updateToolSettings('compress', { quality: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                )}
                {activeTool === 'convert' && (
                  <div>
                    <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">Format:</label>
                    <select
                      value={toolSettings.convert.format}
                      onChange={e => updateToolSettings('convert', { format: e.target.value })}
                      className="w-full p-2 border rounded"
                    >
                      {OUTPUT_FORMATS.map(fmt => (
                        <option key={fmt.id} value={fmt.id}>{fmt.label}</option>
                      ))}
                    </select>
                  </div>
                )}
                {activeTool === 'rotate' && (
                  <div>
                    <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">Rotation/Flip:</label>
                    <select
                      value={toolSettings.rotate.option}
                      onChange={e => updateToolSettings('rotate', { option: e.target.value })}
                      className="w-full p-2 border rounded"
                    >
                      {ROTATE_OPTIONS.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                )}
                {activeTool === 'crop' && (
                <CropPreview 
                  src={modalPreviewFile?.preview}
                  initialCrop={toolSettings.crop.rect}
                  onCropChange={(rect) => updateToolSettings('crop', { rect })}
                />
                )}
              </div>
              <div className="flex justify-end mt-6 space-x-2">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActiveTool(null)} className="px-4 py-2 bg-slate-600 text-slate-300 rounded hover:bg-slate-500">Cancel</motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => { setSelectedTools(prev => new Set(prev).add(activeTool)); setActiveTool(null); }}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
              >
                Apply
              </motion.button>
            </div>
          </div>
      </div>
      )}
    </div>
  );
} 