import React, { useState } from 'react';
import { uploadFile, uploadJson } from '../services/upload';

const TestFirebaseUpload: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [jsonUrl, setJsonUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pour l'image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const file = e.target.files[0];
      const url = await uploadFile(file, `test-uploads/images/${file.name}`);
      setImageUrl(url);
    } catch (err: any) {
      setError(err.message || 'Erreur upload image');
    } finally {
      setLoading(false);
    }
  };

  // Pour le JSON
  const handleJsonUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const form = e.target as HTMLFormElement;
      const name = (form.elements.namedItem('name') as HTMLInputElement).value;
      const description = (form.elements.namedItem('description') as HTMLInputElement).value;
      const obj = { name, description, date: new Date().toISOString() };
      const url = await uploadJson(obj, `test-uploads/json/${name.replace(/\s+/g, '_')}.json`);
      setJsonUrl(url);
    } catch (err: any) {
      setError(err.message || 'Erreur upload JSON');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Test Upload Firebase</h1>

      <div className="mb-8">
        <h2 className="font-semibold mb-2">Uploader une image</h2>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {loading && <div>Chargement...</div>}
        {imageUrl && (
          <div className="mt-2">
            <div>URL : <a href={imageUrl} target="_blank" rel="noopener noreferrer">{imageUrl}</a></div>
            <img src={imageUrl} alt="uploaded" style={{maxWidth: 200, marginTop: 8}} />
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="font-semibold mb-2">Uploader un JSON</h2>
        <form onSubmit={handleJsonUpload} className="space-y-2">
          <input name="name" placeholder="Nom" className="border px-2 py-1 rounded" required />
          <input name="description" placeholder="Description" className="border px-2 py-1 rounded" required />
          <button type="submit" className="bg-indigo-600 text-white px-4 py-1 rounded">Uploader JSON</button>
        </form>
        {jsonUrl && (
          <div className="mt-2">
            <div>URL : <a href={jsonUrl} target="_blank" rel="noopener noreferrer">{jsonUrl}</a></div>
          </div>
        )}
      </div>

      {error && <div className="text-red-600">{error}</div>}
    </div>
  );
};

export default TestFirebaseUpload; 