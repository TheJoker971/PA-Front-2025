import { createClient } from '@supabase/supabase-js';

// Récupérer les variables d'environnement pour Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Vérifier si les variables d'environnement sont définies
// if (!supabaseUrl || !supabaseAnonKey) {
//   console.error(
//     'Les variables d\'environnement VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY doivent être définies dans le fichier .env.local'
//   );
// }

// Options supplémentaires pour le client Supabase
const supabaseOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'PropertyTokens',
    },
  },
};

// Créer le client Supabase avec des valeurs par défaut pour le développement
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  supabaseOptions
);

/**
 * Télécharger une image vers le stockage Supabase
 * @param file - Le fichier à télécharger
 * @param folder - Le dossier dans le bucket (optionnel)
 * @param requireAuth - Indique si l'utilisateur doit être authentifié (défaut: false)
 * @returns L'URL de l'image téléchargée ou null en cas d'erreur
 */
export const uploadImage = async (
  file: File,
  folder?: string,
  requireAuth: boolean = false
): Promise<string | null> => {
  try {
    // Vérifier si les variables d'environnement sont définies
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Configuration Supabase manquante. Impossible de télécharger l\'image.');
      return null;
    }

    // Vérifier si l'authentification est requise
    if (requireAuth) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error('Authentification requise pour télécharger cette image.');
        throw new Error('Authentification requise pour télécharger cette image.');
      }
    }

    // Créer un nom de fichier unique basé sur le timestamp et le nom original
    const timestamp = new Date().getTime();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
    
    // Construire le chemin complet
    const filePath = folder ? `${folder}/${fileName}` : fileName;
    
    // Télécharger le fichier
    const { data, error } = await supabase.storage
      .from('immo')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });
    
    if (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
      
      // Gérer spécifiquement les erreurs RLS
      if (error.message && error.message.includes('row-level security policy')) {
        throw new Error('Accès refusé: Vous n\'avez pas les permissions nécessaires pour télécharger des fichiers. Veuillez vous connecter ou vérifier vos droits d\'accès.');
      }
      
      throw error;
    }
    
    // Construire l'URL publique de l'image
    const { data: publicUrlData } = supabase.storage
      .from('immo')
      .getPublicUrl(data.path);
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Erreur inattendue lors du téléchargement de l\'image:', error);
    throw error;
  }
};

/**
 * Télécharger un document vers le stockage Supabase
 * @param file - Le fichier document à télécharger
 * @param folder - Le dossier dans le bucket (optionnel)
 * @param requireAuth - Indique si l'utilisateur doit être authentifié (défaut: false)
 * @returns L'URL du document téléchargé ou null en cas d'erreur
 */
export const uploadDocument = async (
  file: File,
  folder?: string,
  requireAuth: boolean = false
): Promise<string | null> => {
  try {
    // Vérifier si les variables d'environnement sont définies
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Configuration Supabase manquante. Impossible de télécharger le document.');
      return null;
    }

    // Vérifier si l'authentification est requise
    if (requireAuth) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error('Authentification requise pour télécharger ce document.');
        throw new Error('Authentification requise pour télécharger ce document.');
      }
    }

    // Créer un nom de fichier unique basé sur le timestamp et le nom original
    const timestamp = new Date().getTime();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
    
    // Construire le chemin complet
    const filePath = folder ? `${folder}/${fileName}` : fileName;
    
    // Télécharger le fichier
    const { data, error } = await supabase.storage
      .from('immo')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });
    
    if (error) {
      console.error('Erreur lors du téléchargement du document:', error);
      
      // Gérer spécifiquement les erreurs RLS
      if (error.message && error.message.includes('row-level security policy')) {
        throw new Error('Accès refusé: Vous n\'avez pas les permissions nécessaires pour télécharger des fichiers. Veuillez vous connecter ou vérifier vos droits d\'accès.');
      }
      
      throw error;
    }
    
    // Construire l'URL publique du document
    const { data: publicUrlData } = supabase.storage
      .from('immo')
      .getPublicUrl(data.path);
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Erreur inattendue lors du téléchargement du document:', error);
    throw error;
  }
};

/**
 * Supprimer une image du stockage Supabase
 * @param url - L'URL complète de l'image à supprimer
 * @returns true si la suppression a réussi, false sinon
 */
export const deleteImage = async (
  url: string
): Promise<boolean> => {
  try {
    // Vérifier si les variables d'environnement sont définies
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Configuration Supabase manquante. Impossible de supprimer l\'image.');
      return false;
    }

    // Extraire le chemin du fichier de l'URL
    const path = url.split(`immo/`)[1];
    
    if (!path) {
      console.error('Impossible d\'extraire le chemin du fichier de l\'URL');
      return false;
    }
    
    // Supprimer le fichier
    const { error } = await supabase.storage
      .from('immo')
      .remove([path]);
    
    if (error) {
      console.error('Erreur lors de la suppression de l\'image:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erreur inattendue lors de la suppression de l\'image:', error);
    return false;
  }
};

/**
 * Supprimer un document du stockage Supabase
 * @param url - L'URL complète du document à supprimer
 * @returns true si la suppression a réussi, false sinon
 */
export const deleteDocument = async (
  url: string
): Promise<boolean> => {
  try {
    // Vérifier si les variables d'environnement sont définies
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Configuration Supabase manquante. Impossible de supprimer le document.');
      return false;
    }

    // Extraire le chemin du fichier de l'URL
    const path = url.split(`immo/`)[1];
    
    if (!path) {
      console.error('Impossible d\'extraire le chemin du fichier de l\'URL');
      return false;
    }
    
    // Supprimer le fichier
    const { error } = await supabase.storage
      .from('immo')
      .remove([path]);
    
    if (error) {
      console.error('Erreur lors de la suppression du document:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erreur inattendue lors de la suppression du document:', error);
    return false;
  }
}; 