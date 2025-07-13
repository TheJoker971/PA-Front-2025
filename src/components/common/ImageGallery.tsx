import React, { useState } from 'react';
import { X } from 'lucide-react';
import ImageUploader from './ImageUploader';

interface ImageGalleryProps {
  onImagesChange: (urls: string[]) => void;
  initialImages?: string[];
  maxImages?: number;
  folder?: string;
  className?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  onImagesChange,
  initialImages = [],
  maxImages = 5,
  folder,
  className = ''
}) => {
  const [images, setImages] = useState<string[]>(initialImages);

  const handleImageUploaded = (url: string, index?: number) => {
    if (index !== undefined) {
      // Remplacer une image existante
      const newImages = [...images];
      if (url) {
        newImages[index] = url;
      } else {
        newImages.splice(index, 1);
      }
      setImages(newImages);
      onImagesChange(newImages);
    } else {
      // Ajouter une nouvelle image
      if (url) {
        const newImages = [...images, url];
        setImages(newImages);
        onImagesChange(newImages);
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    onImagesChange(newImages);
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Images existantes */}
        {images.map((image, index) => (
          <div key={`image-${index}`} className="relative">
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <img 
                src={image} 
                alt={`Image ${index + 1}`} 
                className="w-full h-48 object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-gradient-to-r from-red-600 to-pink-600 text-white p-2 rounded-full hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-lg"
                title="Supprimer l'image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Uploader pour ajouter une nouvelle image */}
        {images.length < maxImages && (
          <div className="h-48">
            <ImageUploader
              onImageUploaded={(url) => handleImageUploaded(url)}
              folder={folder}
              className="h-full"
            />
          </div>
        )}
      </div>

      {images.length >= maxImages && (
        <p className="text-sm font-medium text-amber-600 mt-2">
          Nombre maximum d'images atteint ({maxImages})
        </p>
      )}
    </div>
  );
};

export default ImageGallery; 