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
    setCrop(percentCrop);
    onCropChange(pixelCrop);
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