import React, { useState } from 'react';
import { useRoleAccess } from '../../hooks/useRoleAccess';

const RoleDebugger: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { user, isAuthenticated, permissions, userRole } = useRoleAccess();

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-2 rounded-lg text-xs font-mono shadow-lg hover:bg-gray-700 transition-colors z-50"
      >
        Debug Rôles
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-gray-300 rounded-lg shadow-xl p-4 max-w-sm z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-sm">Debug Rôles & Permissions</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700 text-xl leading-none"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-2 text-xs font-mono">
        <div>
          <strong>Authentifié:</strong>{' '}
          <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
            {isAuthenticated ? 'Oui' : 'Non'}
          </span>
        </div>
        
        {isAuthenticated && user && (
          <>
            <div>
              <strong>Utilisateur:</strong> {user.name || 'Inconnu'}
            </div>
            <div>
              <strong>Wallet:</strong> {user.wallet.substring(0, 8)}...
            </div>
            <div>
              <strong>Rôle:</strong>{' '}
              <span className={
                userRole === 'admin' ? 'text-red-600 font-bold' :
                userRole === 'manager' ? 'text-orange-600 font-bold' :
                'text-blue-600'
              }>
                {userRole}
              </span>
            </div>
          </>
        )}
        
        <div className="border-t pt-2">
          <strong>Permissions:</strong>
          <div className="ml-2 space-y-1">
            {Object.entries(permissions).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-600">
                  {key.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className={value ? 'text-green-600' : 'text-red-600'}>
                  {value ? '✓' : '✗'}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t pt-2 text-xs text-gray-500">
          <div>Admin: Accès complet</div>
          <div>Manager: Gestion propriétés</div>
          <div>User: Consultation uniquement</div>
        </div>
      </div>
    </div>
  );
};

export default RoleDebugger; 