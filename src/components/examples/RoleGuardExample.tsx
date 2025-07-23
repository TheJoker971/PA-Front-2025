import React from 'react';
import RoleGuard from '../Auth/RoleGuard';
import { useRoleAccess } from '../../hooks/useRoleAccess';

const RoleGuardExample: React.FC = () => {
  const { user, isAuthenticated } = useRoleAccess();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Exemple d'utilisation de RoleGuard</h1>
      
      {/* Affichage de l'état actuel */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">État actuel:</h2>
        <p>
          <strong>Connecté:</strong> {isAuthenticated ? 'Oui' : 'Non'}
        </p>
        {user && (
          <>
            <p><strong>Utilisateur:</strong> {user.name || 'Inconnu'}</p>
            <p><strong>Rôle:</strong> {user.role}</p>
          </>
        )}
      </div>

      {/* Exemples de RoleGuard */}
      <div className="space-y-4">
        
        {/* Contenu visible uniquement aux utilisateurs connectés */}
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Contenu pour utilisateurs connectés:</h3>
          <RoleGuard
            requireAuth={true}
            fallback={<p className="text-gray-500 italic">Vous devez être connecté pour voir ce contenu.</p>}
          >
            <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
              <p className="text-green-700">✅ Vous êtes connecté ! Ce contenu est visible.</p>
            </div>
          </RoleGuard>
        </div>

        {/* Contenu visible uniquement aux managers et admins */}
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Contenu pour Managers et Admins:</h3>
          <RoleGuard
            requiredRoles={['manager', 'admin']}
            fallback={<p className="text-gray-500 italic">Accès réservé aux managers et admins.</p>}
          >
            <div className="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
              <p className="text-orange-700">🔧 Vous avez les droits de gestion !</p>
              <button className="mt-2 bg-orange-500 text-white px-3 py-1 rounded text-sm">
                Gérer les propriétés
              </button>
            </div>
          </RoleGuard>
        </div>

        {/* Contenu visible uniquement aux admins */}
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Contenu pour Admins uniquement:</h3>
          <RoleGuard
            requiredRoles="admin"
            fallback={<p className="text-gray-500 italic">Accès réservé aux administrateurs.</p>}
          >
            <div className="bg-red-50 p-3 rounded border-l-4 border-red-400">
              <p className="text-red-700">⚡ Vous êtes administrateur !</p>
              <div className="mt-2 space-x-2">
                <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">
                  Gérer les utilisateurs
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">
                  Valider les propriétés
                </button>
              </div>
            </div>
          </RoleGuard>
        </div>

        {/* Utilisation avec des permissions spécifiques */}
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Contenu basé sur les permissions:</h3>
          
          <div className="space-y-2">
            <RoleGuard
              requiredPermission="canManageProperties"
              fallback={<p className="text-gray-500 text-sm">❌ Pas de permission pour gérer les propriétés</p>}
            >
              <p className="text-green-600 text-sm">✅ Permission: Gérer les propriétés</p>
            </RoleGuard>

            <RoleGuard
              requiredPermission="canManageUsers"
              fallback={<p className="text-gray-500 text-sm">❌ Pas de permission pour gérer les utilisateurs</p>}
            >
              <p className="text-green-600 text-sm">✅ Permission: Gérer les utilisateurs</p>
            </RoleGuard>

            <RoleGuard
              requiredPermission="canValidateProperties"
              fallback={<p className="text-gray-500 text-sm">❌ Pas de permission pour valider les propriétés</p>}
            >
              <p className="text-green-600 text-sm">✅ Permission: Valider les propriétés</p>
            </RoleGuard>
          </div>
        </div>

        {/* Navigation conditionnelle */}
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Navigation conditionnelle:</h3>
          <div className="flex space-x-2">
            
            <RoleGuard requiredRoles={['manager', 'admin']}>
              <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                🏠 Mes Propriétés
              </button>
            </RoleGuard>

            <RoleGuard requiredRoles="admin">
              <button className="bg-purple-500 text-white px-3 py-1 rounded text-sm">
                👥 Administration
              </button>
            </RoleGuard>

            <RoleGuard requireAuth={true}>
              <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">
                📊 Dashboard
              </button>
            </RoleGuard>

            {/* Toujours visible */}
            <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm">
              🏡 Propriétés publiques
            </button>
          </div>
        </div>
      </div>

      {/* Informations utiles */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Informations sur les rôles:</h3>
        <ul className="text-sm space-y-1">
          <li><strong>User:</strong> Peut consulter ses investissements et les propriétés publiques</li>
          <li><strong>Manager:</strong> Peut gérer ses propriétés + tout ce qu'un User peut faire</li>
          <li><strong>Admin:</strong> Accès complet à toutes les fonctionnalités</li>
        </ul>
      </div>
    </div>
  );
};

export default RoleGuardExample; 