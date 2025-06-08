import { useState, useRef } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function CropPreview({ src, onCropChange, initialCrop }) {
  const [crop, setCrop] = useState(initialCrop);
  const imgRef = useRef(null);

  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    const centeredCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        1, // aspect ratio 1:1
        width,
        height
      ),
      width,
      height
    );
    setCrop(centeredCrop);
    onCropChange(centeredCrop); 
  }

  const handleCropChange = (pixelCrop, percentCrop) => {
    // The crop preview component uses 'width' and 'height' but our processing
    // pipeline expects 'w' and 'h'. We'll transform it here before sending it up.
    const transformedCrop = {
      x: pixelCrop.x,
      y: pixelCrop.y,
      w: pixelCrop.width,
      h: pixelCrop.height,
    };
    setCrop(percentCrop);
    onCropChange(transformedCrop);
  };

  return (
    <div className="flex flex-col items-center">
      {src && (
        <ReactCrop
          crop={crop}
          onChange={handleCropChange}
          onComplete={handleCropChange}
          aspect={null} // Free aspect ratio
          minWidth={50}
          minHeight={50}
        >
          <img
            ref={imgRef}
            alt="Crop preview"
            src={src}
            onLoad={onImageLoad}
            style={{ maxHeight: '70vh' }}
          />
        </ReactCrop>
      )}
      {!src && <p className="text-slate-400">Select an image to see crop preview.</p>}
    </div>
  );
}

export default CropPreview; 