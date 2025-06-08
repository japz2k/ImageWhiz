// This file is reserved for any custom image processing functions that may be added in the future.

export const extractColorPalette = async (imageUrl, numColors = 5) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      const colorMap = new Map();

      // Sample every 4th pixel for performance
      for (let i = 0; i < pixels.length; i += 16) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const rgb = `${r},${g},${b}`;
        colorMap.set(rgb, (colorMap.get(rgb) || 0) + 1);
      }

      // Convert to array and sort by frequency
      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, numColors)
        .map(([rgb]) => {
          const [r, g, b] = rgb.split(',').map(Number);
          return { r, g, b };
        });

      resolve(sortedColors);
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
};

export const autoEnhanceImage = async (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // Calculate histogram
      const histogram = {
        r: new Array(256).fill(0),
        g: new Array(256).fill(0),
        b: new Array(256).fill(0)
      };

      for (let i = 0; i < pixels.length; i += 4) {
        histogram.r[pixels[i]]++;
        histogram.g[pixels[i + 1]]++;
        histogram.b[pixels[i + 2]]++;
      }

      // Calculate cumulative histogram
      const cdf = {
        r: new Array(256).fill(0),
        g: new Array(256).fill(0),
        b: new Array(256).fill(0)
      };

      let sum = { r: 0, g: 0, b: 0 };
      for (let i = 0; i < 256; i++) {
        sum.r += histogram.r[i];
        sum.g += histogram.g[i];
        sum.b += histogram.b[i];
        cdf.r[i] = sum.r;
        cdf.g[i] = sum.g;
        cdf.b[i] = sum.b;
      }

      // Normalize CDF
      const total = canvas.width * canvas.height;
      const lookupTable = {
        r: new Array(256),
        g: new Array(256),
        b: new Array(256)
      };

      for (let i = 0; i < 256; i++) {
        lookupTable.r[i] = Math.round((cdf.r[i] / total) * 255);
        lookupTable.g[i] = Math.round((cdf.g[i] / total) * 255);
        lookupTable.b[i] = Math.round((cdf.b[i] / total) * 255);
      }

      // Apply histogram equalization
      for (let i = 0; i < pixels.length; i += 4) {
        pixels[i] = lookupTable.r[pixels[i]];
        pixels[i + 1] = lookupTable.g[pixels[i + 1]];
        pixels[i + 2] = lookupTable.b[pixels[i + 2]];
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL());
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
};

export const inpaintImage = (imageUrl, maskUrl) => {
  return new Promise((resolve, reject) => {
    if (!window.cv) {
      return reject(new Error("OpenCV is not loaded."));
    }

    const originalImg = new Image();
    originalImg.crossOrigin = 'Anonymous';
    originalImg.src = imageUrl;

    originalImg.onload = () => {
      const maskImg = new Image();
      maskImg.crossOrigin = 'Anonymous';
      maskImg.src = maskUrl;

      maskImg.onload = () => {
        try {
          const cv = window.cv;
          const src = cv.imread(originalImg);
          const maskWithImage = cv.imread(maskImg);
          const mask = new cv.Mat();

          // Robust mask creation using image differencing
          cv.absdiff(src, maskWithImage, mask);

          // Convert the difference to grayscale
          cv.cvtColor(mask, mask, cv.COLOR_RGBA2GRAY, 0);

          // Threshold the grayscale image to get a binary mask
          // Any pixel that is not black (i.e., has a difference) will become white.
          cv.threshold(mask, mask, 1, 255, cv.THRESH_BINARY);
          
          const M = cv.Mat.ones(5, 5, cv.CV_8U);
          const anchor = new cv.Point(-1, -1);
          cv.dilate(mask, mask, M, anchor, 2, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());

          const dst = new cv.Mat();
          
          cv.inpaint(src, mask, dst, 3, cv.INPAINT_TELEA);
          
          const resultCanvas = document.createElement('canvas');
          cv.imshow(resultCanvas, dst);
          
          resolve(resultCanvas.toDataURL());

          // Clean up memory
          src.delete();
          mask.delete();
          dst.delete();
          maskWithImage.delete();
          M.delete();

        } catch (e) {
          reject(e);
        }
      };

      maskImg.onerror = () => reject(new Error('Failed to load mask image.'));
    };
    
    originalImg.onerror = () => reject(new Error('Failed to load original image.'));
  });
}; 