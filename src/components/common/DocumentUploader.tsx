import React, { useState, useRef, ChangeEvent } from 'react';
import { uploadDocument } from '../../services/supabase';
import { Loader2, Upload, X, FileText, AlertTriangle } from 'lucide-react';
import SupabaseErrorHandler from './SupabaseErrorHandler';

interface DocumentUploaderProps {
  onDocumentUploaded: (url: string) => void;
  initialDocument?: string;
  folder?: string;
  className?: string;
  maxSizeMB?: number;
  acceptedTypes?: string;
  requireAuth?: boolean;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onDocumentUploaded,
  initialDocument = '',
  folder,
  className = '',
  maxSizeMB = 10,
  acceptedTypes = 'application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  requireAuth = false
}) => {
  const [document, setDocument] = useState<string>(initialDocument);
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
      const documentUrl = await uploadDocument(file, folder, requireAuth);
      
      if (documentUrl) {
        setDocument(documentUrl);
        onDocumentUploaded(documentUrl);
      } else {
        setError(new Error('Échec du téléchargement du document'));
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

  const removeDocument = () => {
    setDocument('');
    onDocumentUploaded('');
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

  // Extraire le nom du fichier de l'URL
  const getDocumentName = () => {
    if (!document) return '';
    try {
      const url = new URL(document);
      const pathParts = url.pathname.split('/');
      return decodeURIComponent(pathParts[pathParts.length - 1]);
    } catch (e) {
      return document.split('/').pop() || 'Document';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedTypes}
        className="hidden"
      />

      {!document ? (
        <div 
          onClick={triggerFileInput}
          className={`border-2 border-dashed ${isRLSError ? 'border-red-300' : 'border-gray-300'} rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors`}
        >
          {isUploading ? (
            <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
          ) : (
            <>
              <div className={`${isRLSError ? 'bg-red-50' : 'bg-gradient-to-r from-cyan-100 to-blue-100'} rounded-2xl p-3 mb-3`}>
                {isRLSError ? (
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                ) : (
                  <FileText className="h-8 w-8 text-cyan-600" />
                )}
              </div>
              <p className="text-base font-medium text-gray-700 text-center">
                {isRLSError ? 'Erreur de permissions' : 'Cliquez pour télécharger un document'}
              </p>
              <p className="text-sm text-gray-600 mt-1 text-center">
                {!isRLSError && (
                  <>
                    PDF, Word {` (Max: ${maxSizeMB}MB)`}
                  </>
                )}
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 p-4 bg-white">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-2xl p-3 mr-3">
              <FileText className="h-8 w-8 text-cyan-600" />
            </div>
            <div className="flex-1 truncate">
              <p className="font-medium text-gray-800 truncate">{getDocumentName()}</p>
              <a 
                href={document} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Voir le document
              </a>
            </div>
          </div>
          <button
            type="button"
            onClick={removeDocument}
            className="absolute top-2 right-2 bg-gradient-to-r from-red-600 to-pink-600 text-white p-2 rounded-full hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-lg"
            title="Supprimer le document"
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

export default DocumentUploader; 