import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { app } from "./firebase";

const storage = getStorage(app);

export async function uploadFile(file: File, folder: string = "images"): Promise<string> {
  const fileRef = ref(storage, `${folder}/${uuidv4()}-${file.name}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}

export async function uploadJson(data: object, folder: string = "metadata"): Promise<string> {
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const fileRef = ref(storage, `${folder}/${uuidv4()}.json`);
  await uploadBytes(fileRef, blob);
  return getDownloadURL(fileRef);
} 
 