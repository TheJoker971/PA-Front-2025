import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

// Upload d'une image ou d'un fichier JSON
export async function uploadFile(file: File | Blob, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

// Upload d'un objet JSON (métadonnées)
export async function uploadJson(obj: any, path: string): Promise<string> {
  const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });
  return uploadFile(blob, path);
} 