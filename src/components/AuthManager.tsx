import React, { useState } from 'react';
// import { useApi } from '../context/ApiContext';
// import ApiErrorHandler from './ApiErrorHandler';
// Suppression de l'import thirdweb
// import { useAddress, useDisconnect, useMetamask, useSDK } from '@thirdweb-dev/react';

const AuthManager: React.FC = () => {
  // const { isAuthenticated, isLoading, userSignature, userName, userRole, login, logout, createUser } = useApi();
  const [error, setError] = useState<Error | null>(null);
  const [localLoading, setLocalLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [showCreateUser, setShowCreateUser] = useState<boolean>(false);
  const [name, setName] = useState<string>('');

  // Suppression des hooks thirdweb
  // const address = useAddress();
  // const connectWithMetamask = useMetamask();
  // const disconnectWallet = useDisconnect();
  // const sdk = useSDK();

  // Fonction pour signer un message et se connecter (à réécrire avec wagmi si besoin)
  // TODO: Remplacer la logique de connexion par wagmi si besoin

  // ... le reste du composant doit être adapté pour ne plus utiliser thirdweb
  // Par exemple, masquer ou désactiver les boutons de connexion si pas de wagmi

  return (
    <div>
      <p>Connexion via thirdweb désactivée. À remplacer par wagmi.</p>
      {/* Le reste de l'UI peut être adapté ici */}
    </div>
  );
};

export default AuthManager; 