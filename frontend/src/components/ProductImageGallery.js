import React, { useState } from 'react';

const ProductImageGallery = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!images || images.length === 0) return null;

  return (
    <div>
      <div onClick={() => setIsZoomed(!isZoomed)}>
        <img 
          src={images[selectedImage]} 
          alt={productName}
          width={isZoomed ? "600" : "400"}
          style={{ cursor: 'zoom-in' }}
        />
      </div>
      
      {images.length > 1 && (
        <div>
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${productName} ${index + 1}`}
              width="80"
              onClick={() => setSelectedImage(index)}
              style={{ 
                cursor: 'pointer',
                border: selectedImage === index ? '2px solid blue' : 'none'
              }}
            />
          ))}
        </div>
      )}
      
      {isZoomed && (
        <div onClick={() => setIsZoomed(false)} style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <img 
            src={images[selectedImage]} 
            alt={productName}
            style={{ maxWidth: '90%', maxHeight: '90%' }}
          />
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;