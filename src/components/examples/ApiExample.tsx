import React, { useState } from 'react';
import { useAuth, useProperties, useInvestments, useUsers } from '../../hooks';
import { CreatePropertyRequest, CreateInvestmentRequest, CreateUserRequest } from '../../types/api';

const ApiExample: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [userName, setUserName] = useState('');
  
  // Utilisation des hooks
  const { user, isLoading: authLoading, login, logout, isAuthenticated } = useAuth();
  const { properties, isLoading: propertiesLoading, createProperty } = useProperties();
  const { investments, isLoading: investmentsLoading, createInvestment } = useInvestments();
  const { users, isLoading: usersLoading, createUser } = useUsers();

  // Fonction de connexion avec création automatique d'utilisateur
  const handleLogin = async () => {
    if (!walletAddress) {
      alert('Veuillez entrer une adresse wallet');
      return;
    }
    
    try {
      // Le nom est optionnel, si fourni il sera utilisé, sinon un nom par défaut sera généré
      await login(walletAddress, userName.trim() || undefined);
      console.log('Connexion réussie (utilisateur créé automatiquement si nécessaire)');
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  // Fonction de déconnexion
  const handleLogout = async () => {
    try {
      await logout();
      console.log('Déconnexion réussie');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  // Exemple de création d'une propriété
  const handleCreateProperty = async () => {
    if (!isAuthenticated) {
      alert('Veuillez vous connecter d\'abord');
      return;
    }

    const propertyData: CreatePropertyRequest = {
      onchain_id: 'prop_001',
      name: 'Appartement Paris 15e',
      location: 'Paris, France',
      property_type: 'appartement',
      description: 'Bel appartement de 3 pièces en centre-ville',
      total_price: 500000,
      token_price: 100,
      annual_yield: 5.5,
      image_url: 'https://example.com/image.jpg',
      documents: ['contrat.pdf', 'diagnostic.pdf']
    };

    try {
      await createProperty(propertyData);
      console.log('Propriété créée avec succès');
    } catch (error) {
      console.error('Erreur lors de la création de la propriété:', error);
    }
  };

  // Exemple de création d'un investissement
  const handleCreateInvestment = async () => {
    if (!isAuthenticated || properties.length === 0) {
      alert('Veuillez vous connecter et avoir des propriétés disponibles');
      return;
    }

    const investmentData: CreateInvestmentRequest = {
      property_id: properties[0].id, // Première propriété disponible
      amount_eth: 1.5,
      shares: 15,
      tx_hash: '0x1234567890abcdef...'
    };

    try {
      await createInvestment(investmentData);
      console.log('Investissement créé avec succès');
    } catch (error) {
      console.error('Erreur lors de la création de l\'investissement:', error);
    }
  };

  // Exemple de création d'un utilisateur
  const handleCreateUser = async () => {
    const userData: CreateUserRequest = {
      wallet: '0xNewUserWallet123...',
      name: 'Nouvel Utilisateur',
      role: 'user'
    };

    try {
      await createUser(userData);
      console.log('Utilisateur créé avec succès');
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Exemple d'utilisation de l'API</h1>
      
      {/* Section Authentification */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Authentification avec Création Automatique</h2>
        
        {!isAuthenticated ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Adresse Wallet: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="0x..."
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Nom d'utilisateur (optionnel):
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="John Doe"
                className="w-full p-2 border rounded"
              />
              <p className="text-xs text-gray-500 mt-1">
                Si vide, un nom sera généré automatiquement basé sur l'adresse wallet
              </p>
            </div>
            <button
              onClick={handleLogin}
              disabled={authLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {authLoading ? 'Connexion...' : 'Se connecter / Créer compte'}
            </button>
            <div className="bg-blue-50 p-3 rounded text-sm">
              <strong>🔄 Création automatique :</strong> Si votre wallet n'existe pas dans le système, 
              un compte utilisateur sera automatiquement créé avec le rôle "user".
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p>Connecté en tant que: <strong>{user?.name || 'Inconnu'}</strong></p>
            <p>Wallet: <strong>{user?.wallet.substring(0, 8)}...{user?.wallet.substring(user?.wallet.length - 4)}</strong></p>
            <p>Rôle: <strong className={
              user?.role === 'admin' ? 'text-red-600' :
              user?.role === 'manager' ? 'text-orange-600' :
              'text-blue-600'
            }>{user?.role}</strong></p>
            <p>Créé le: <strong>{new Date(user?.created_at || '').toLocaleDateString()}</strong></p>
            <button
              onClick={handleLogout}
              disabled={authLoading}
              className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {authLoading ? 'Déconnexion...' : 'Se déconnecter'}
            </button>
          </div>
        )}
      </div>

      {/* Section Propriétés */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Propriétés</h2>
        
        <div className="space-y-4">
          <button
            onClick={handleCreateProperty}
            disabled={propertiesLoading || !isAuthenticated}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {propertiesLoading ? 'Création...' : 'Créer une propriété d\'exemple'}
          </button>
          
          <div>
            <p className="font-medium">Propriétés chargées: {properties.length}</p>
            {properties.slice(0, 3).map((property) => (
              <div key={property.id} className="mt-2 p-2 bg-gray-100 rounded">
                <p><strong>{property.name}</strong> - {property.location}</p>
                <p>Prix: {property.total_price}€ | Statut: {property.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Investissements */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Investissements</h2>
        
        <div className="space-y-4">
          <button
            onClick={handleCreateInvestment}
            disabled={investmentsLoading || !isAuthenticated}
            className="bg-purple-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {investmentsLoading ? 'Création...' : 'Créer un investissement d\'exemple'}
          </button>
          
          <div>
            <p className="font-medium">Investissements chargés: {investments.length}</p>
            {investments.slice(0, 3).map((investment) => (
              <div key={investment.id} className="mt-2 p-2 bg-gray-100 rounded">
                <p>Montant: {investment.amount_eth} ETH | Parts: {investment.shares}</p>
                <p>TX: {investment.tx_hash.substring(0, 20)}...</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Utilisateurs (Admin uniquement) */}
      {user?.role === 'admin' && (
        <div className="mb-8 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Utilisateurs (Admin)</h2>
          
          <div className="space-y-4">
            <button
              onClick={handleCreateUser}
              disabled={usersLoading}
              className="bg-orange-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {usersLoading ? 'Création...' : 'Créer un utilisateur d\'exemple'}
            </button>
            
            <div>
              <p className="font-medium">Utilisateurs chargés: {users.length}</p>
              {users.slice(0, 3).map((userItem) => (
                <div key={userItem.id} className="mt-2 p-2 bg-gray-100 rounded">
                  <p><strong>{userItem.name}</strong> - {userItem.role}</p>
                  <p>Wallet: {userItem.wallet.substring(0, 20)}...</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Statuts de chargement */}
      <div className="p-4 border rounded-lg bg-gray-50">
        <h3 className="font-semibold mb-2">Statuts de chargement:</h3>
        <ul className="space-y-1 text-sm">
          <li>Auth: {authLoading ? '🔄' : '✅'}</li>
          <li>Propriétés: {propertiesLoading ? '🔄' : '✅'}</li>
          <li>Investissements: {investmentsLoading ? '🔄' : '✅'}</li>
          <li>Utilisateurs: {usersLoading ? '🔄' : '✅'}</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiExample; 