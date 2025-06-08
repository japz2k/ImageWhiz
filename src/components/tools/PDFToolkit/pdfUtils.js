import * as pdfjsLib from 'pdfjs-dist/build/pdf';

// Construct the worker URL by prepending the base path. This is the
// robust, Vite-native way to handle assets and public files.
pdfjsLib.GlobalWorkerOptions.workerSrc = `${import.meta.env.BASE_URL}pdf.worker.min.js`;

/**
 * Renders all pages of a PDF file into image data URLs.
 * @param {File} file The PDF file to render.
 * @returns {Promise<string[]>} A promise that resolves to an array of data URLs.
 */
export const renderPdfToImages = async (file) => {
  const images = [];
  const pdf = await pdfjsLib.getDocument(await file.arrayBuffer()).promise;
  const numPages = pdf.numPages;

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.0 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport: viewport }).promise;
    images.push(canvas.toDataURL());
  }

  return images;
}; 