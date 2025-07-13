import React, { useState } from 'react';
import { X, FileText } from 'lucide-react';
import DocumentUploader from './DocumentUploader';

interface DocumentGalleryProps {
  onDocumentsChange: (urls: string[]) => void;
  initialDocuments?: string[];
  maxDocuments?: number;
  folder?: string;
  className?: string;
}

const DocumentGallery: React.FC<DocumentGalleryProps> = ({
  onDocumentsChange,
  initialDocuments = [],
  maxDocuments = 5,
  folder,
  className = ''
}) => {
  const [documents, setDocuments] = useState<string[]>(initialDocuments);
  const [documentNames, setDocumentNames] = useState<string[]>(initialDocuments.map(() => 'Document'));

  const handleDocumentUploaded = (url: string, index?: number) => {
    if (index !== undefined) {
      // Remplacer un document existant
      const newDocuments = [...documents];
      if (url) {
        newDocuments[index] = url;
      } else {
        newDocuments.splice(index, 1);
      }
      setDocuments(newDocuments);
      onDocumentsChange(newDocuments);
    } else {
      // Ajouter un nouveau document
      if (url) {
        const newDocuments = [...documents, url];
        setDocuments(newDocuments);
        onDocumentsChange(newDocuments);
      }
    }
  };

  const removeDocument = (index: number) => {
    const newDocuments = [...documents];
    newDocuments.splice(index, 1);
    setDocuments(newDocuments);
    onDocumentsChange(newDocuments);
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Documents existants */}
        {documents.map((doc, index) => (
          <div key={`doc-${index}`} className="relative">
            <div className="flex items-center p-4 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-2xl p-3 mr-3">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 truncate">Document {index + 1}</p>
                <p className="text-sm text-gray-600">
                  <a href={doc} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium">
                    Voir le document
                  </a>
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeDocument(index)}
                className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-2 rounded-full hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-lg"
                title="Supprimer le document"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Uploader pour ajouter un nouveau document */}
        {documents.length < maxDocuments && (
          <DocumentUploader
            onDocumentUploaded={(url) => handleDocumentUploaded(url)}
            folder={folder}
          />
        )}
      </div>

      {documents.length >= maxDocuments && (
        <p className="text-sm font-medium text-amber-600 mt-2">
          Nombre maximum de documents atteint ({maxDocuments})
        </p>
      )}
    </div>
  );
};

export default DocumentGallery; 