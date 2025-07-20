import React from 'react';
import { AlertTriangle } from 'lucide-react';

const EnvironmentWarning: React.FC = () => {
  // Supprimer toute vérification des variables d'environnement Supabase
  // const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  // const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  // const missingEnvVars = [];
  // if (!supabaseUrl) missingEnvVars.push('VITE_SUPABASE_URL');
  // if (!supabaseAnonKey) missingEnvVars.push('VITE_SUPABASE_ANON_KEY');

  // Si tu veux garder un avertissement pour d'autres variables, adapte ici
  // Pour l'instant, on ne vérifie plus rien
  return null;
};

export default EnvironmentWarning; 