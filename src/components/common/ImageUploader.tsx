import React, { useState, useRef, ChangeEvent } from 'react';
import { uploadImage } from '../../services/supabase';
import { Loader2, Upload, X, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import SupabaseErrorHandler from './SupabaseErrorHandler';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  initialImage?: string;
  folder?: string;
  className?: string;
  maxSizeMB?: number;
  acceptedTypes?: string;
  requireAuth?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUploaded,
  initialImage = '',
  folder,
  className = '',
  maxSizeMB = 10,
  acceptedTypes = 'image/jpeg, image/png, image/webp',
  requireAuth = false
}) => {
  const [image, setImage] = useState<string>(initialImage);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [validationError, setValidationError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convertir MB en bytes

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!acceptedTypes.includes(file.type)) {
      setValidationError(`Type de fichier non accepté. Types acceptés: ${acceptedTypes}`);
      return;
    }

    // Vérifier la taille du fichier
    if (file.size > maxSizeBytes) {
      setValidationError(`Le fichier est trop volumineux. Taille maximale: ${maxSizeMB}MB`);
      return;
    }

    setValidationError('');
    setError(null);
    setIsUploading(true);

    try {
      const imageUrl = await uploadImage(file, folder, requireAuth);
      
      if (imageUrl) {
        setImage(imageUrl);
        onImageUploaded(imageUrl);
      } else {
        setError(new Error('Échec du téléchargement de l\'image'));
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err : new Error('Une erreur est survenue lors du téléchargement'));
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setImage('');
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Vérifier si l'erreur est liée à une politique de sécurité RLS
  const isRLSError = error?.message && (
    error.message.includes('row-level security policy') ||
    error.message.includes('violates row-level security') ||
    error.message.includes('Unauthorized')
  );

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedTypes}
        className="hidden"
      />

      {!image ? (
        <div 
          onClick={triggerFileInput}
          className={`border-2 border-dashed ${isRLSError ? 'border-red-300' : 'border-gray-300'} rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors`}
        >
          {isUploading ? (
            <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
          ) : (
            <>
              <div className={`${isRLSError ? 'bg-red-50' : 'bg-gradient-to-r from-indigo-100 to-purple-100'} rounded-2xl p-3 mb-3`}>
                {isRLSError ? (
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                ) : (
                  <Upload className="h-8 w-8 text-indigo-600" />
                )}
              </div>
              <p className="text-base font-medium text-gray-700 text-center">
                {isRLSError ? 'Erreur de permissions' : 'Cliquez pour télécharger une image'}
              </p>
              <p className="text-sm text-gray-600 mt-1 text-center">
                {!isRLSError && (
                  <>
                    {acceptedTypes.replace(/image\//g, '').replace(/,/g, ', ')}
                    {` (Max: ${maxSizeMB}MB)`}
                  </>
                )}
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <img 
            src={image} 
            alt="Uploaded" 
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-gradient-to-r from-red-600 to-pink-600 text-white p-2 rounded-full hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-lg"
            title="Supprimer l'image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {validationError && (
        <p className="text-sm font-medium text-red-500 mt-2">{validationError}</p>
      )}
      
      {error && <SupabaseErrorHandler error={error} type="upload" />}
    </div>
  );
};

export default ImageUploader; 