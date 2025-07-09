import React, { useState } from 'react';

const ImageGallery = ({ images = [], productName }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const fallbackImage = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop';
  const imageList = Array.isArray(images) ? images.filter(img => img && img.trim()) : [images || fallbackImage];
  
  // Ensure we always have at least one image
  if (imageList.length === 0) {
    imageList.push(fallbackImage);
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative overflow-hidden rounded-2xl luxury-shadow">
        <img
          src={imageList[currentImage]}
          alt={productName}
          className="w-full h-96 lg:h-[600px] object-cover cursor-zoom-in transition-transform duration-300 hover:scale-105"
          onClick={() => setIsZoomed(true)}
          onError={(e) => {
            e.target.src = fallbackImage;
          }}
        />
        <div className="absolute top-4 left-4">
          <div className="badge badge-primary">New</div>
        </div>
        <button 
          className="absolute top-4 right-4 btn btn-circle btn-ghost glass-effect"
          onClick={() => setIsZoomed(true)}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      {/* Thumbnails */}
      {imageList.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {imageList.map((image, index) => (
            <button
              key={index}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                currentImage === index ? 'border-primary' : 'border-transparent'
              }`}
              onClick={() => setCurrentImage(index)}
            >
              <img
                src={image}
                alt={`${productName} ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&h=80&fit=crop';
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      {isZoomed && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <button 
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setIsZoomed(false)}
            >
              ✕
            </button>
            <img
              src={imageList[currentImage]}
              alt={productName}
              className="w-full h-auto"
            />
          </div>
          <div className="modal-backdrop" onClick={() => setIsZoomed(false)}></div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;