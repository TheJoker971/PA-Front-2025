# Guide d'utilisation de l'API

Ce guide explique comment utiliser la nouvelle implémentation de l'API dans votre application React.

## 🚀 Installation et Configuration

### Variables d'environnement

Ajoutez dans votre fichier `.env` :

```env
VITE_API_BASE_URL=http://localhost:8080
```

## 📁 Structure des fichiers

```
src/
├── types/api.ts          # Types TypeScript pour l'API
├── services/api-v2.ts    # Services API avec axios
├── hooks/
│   ├── useAuth.ts        # Hook d'authentification
│   ├── useProperties.ts  # Hook pour les propriétés
│   ├── useInvestments.ts # Hook pour les investissements
│   ├── useUsers.ts       # Hook pour les utilisateurs
│   └── index.ts         # Export de tous les hooks
└── components/examples/
    └── ApiExample.tsx    # Composant d'exemple
```

## 🔐 Authentification

### Configuration du wallet

```typescript
import { setAuthWallet, authService } from '../services/api-v2';

// Connexion simple (utilisateur doit exister)
const wallet = '0x1234567890abcdef...';
await authService.login(wallet);

// Connexion avec création automatique d'utilisateur
await authService.loginOrCreate(wallet, 'Nom optionnel');
```

### Utilisation du hook d'authentification

```typescript
import { useAuth } from '../hooks';

const MyComponent = () => {
  const { user, isLoading, login, logout, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    try {
      // Connexion avec création automatique d'utilisateur
      await login('0x1234567890abcdef...', 'Nom optionnel');
      console.log('Connecté:', user);
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Connecté en tant que: {user?.name}</p>
          <p>Rôle: {user?.role}</p>
          <button onClick={logout}>Se déconnecter</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Se connecter / Créer compte</button>
      )}
    </div>
  );
};
```

## 🏠 Gestion des Propriétés

### Hook useProperties

```typescript
import { useProperties } from '../hooks';

const PropertiesComponent = () => {
  const { 
    properties, 
    isLoading, 
    error, 
    createProperty, 
    updateProperty,
    updatePropertyStatus,
    deleteProperty 
  } = useProperties();

  // Pour les propriétés publiques (sans authentification)
  const { properties: publicProperties } = useProperties(true);

  const handleCreateProperty = async () => {
    const propertyData = {
      onchain_id: 'prop_001',
      name: 'Appartement Paris',
      location: 'Paris, France',
      property_type: 'appartement',
      description: 'Bel appartement de 3 pièces',
      total_price: 500000,
      token_price: 100,
      annual_yield: 5.5,
      image_url: 'https://example.com/image.jpg',
      documents: ['contrat.pdf']
    };

    try {
      await createProperty(propertyData);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div>
      {properties.map(property => (
        <div key={property.id}>
          <h3>{property.name}</h3>
          <p>{property.location}</p>
          <p>Statut: {property.status}</p>
        </div>
      ))}
    </div>
  );
};
```

## 💰 Gestion des Investissements

### Hook useInvestments

```typescript
import { useInvestments } from '../hooks';

const InvestmentsComponent = () => {
  const { 
    investments, 
    count,
    isLoading, 
    createInvestment, 
    updateInvestment,
    deleteInvestment 
  } = useInvestments();

  const handleCreateInvestment = async () => {
    const investmentData = {
      property_id: 'property-uuid',
      amount_eth: 1.5,
      shares: 15,
      tx_hash: '0x1234567890abcdef...'
    };

    try {
      await createInvestment(investmentData);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div>
      <p>Total des investissements: {count}</p>
      {investments.map(investment => (
        <div key={investment.id}>
          <p>Montant: {investment.amount_eth} ETH</p>
          <p>Parts: {investment.shares}</p>
        </div>
      ))}
    </div>
  );
};
```

## 👥 Gestion des Utilisateurs (Admin)

### Hook useUsers

```typescript
import { useUsers } from '../hooks';

const UsersComponent = () => {
  const { users, isLoading, createUser, updateUserRole } = useUsers();

  const handleCreateUser = async () => {
    const userData = {
      wallet: '0xNewUserWallet...',
      name: 'Nouvel Utilisateur',
      role: 'user' as const
    };

    try {
      await createUser(userData);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleUpdateRole = async (userId: string) => {
    try {
      await updateUserRole(userId, { role: 'manager' });
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          <p>{user.name} - {user.role}</p>
          <button onClick={() => handleUpdateRole(user.id)}>
            Promouvoir en Manager
          </button>
        </div>
      ))}
    </div>
  );
};
```

## 🔧 Utilisation directe des services

Si vous préférez utiliser les services directement sans les hooks :

```typescript
import { 
  authService, 
  propertyService, 
  investmentService, 
  userService 
} from '../services/api-v2';

// Authentification
const user = await authService.login('0x...');

// Propriétés
const properties = await propertyService.getAll();
const publicProperties = await propertyService.getPublic();

// Investissements
const investments = await investmentService.getAll();

// Utilisateurs (admin)
const users = await userService.getAll();
```

## 🎯 Gestion des erreurs

Les hooks gèrent automatiquement les erreurs, mais vous pouvez aussi les capturer :

```typescript
const { error } = useProperties();

if (error) {
  console.error('Erreur de propriétés:', error);
}

// Ou avec try/catch
try {
  await createProperty(propertyData);
} catch (error) {
  console.error('Erreur lors de la création:', error);
}
```

## 🔄 États de chargement

Tous les hooks fournissent un état `isLoading` :

```typescript
const { isLoading } = useProperties();

if (isLoading) {
  return <div>Chargement...</div>;
}
```

## 🛡️ Contrôle d'accès basé sur les rôles

```typescript
const { user } = useAuth();

// Vérifier le rôle
if (user?.role === 'admin') {
  // Afficher les fonctionnalités admin
}

if (user?.role === 'manager') {
  // Afficher les fonctionnalités manager
}
```

## 🎮 Pages de test

Pour tester le système :

- **`/test-api`** : Test complet de l'API avec authentification
- **`/test-roles`** : Démonstration de RoleGuard avec différents niveaux d'accès
- **`/test-wallet`** : Démonstration de l'authentification wallet avec création automatique

## 📋 Routes disponibles

### Routes publiques (sans authentification)
- `GET /health` - Vérifier la santé de l'API
- `GET /properties/public` - Propriétés validées
- `POST /auth/login` - Connexion
- `POST /auth/logout` - Déconnexion
- `POST /users` - Créer un utilisateur

### Routes authentifiées (Bearer token requis)
- `GET /api/properties` - Propriétés selon le rôle
- `POST /api/properties` - Créer une propriété (manager/admin)
- `PUT /api/properties/:id` - Modifier une propriété
- `PUT /api/properties/:id/status` - Modifier le statut (admin)
- `DELETE /api/properties/:id` - Supprimer (admin)
- `GET /api/investments` - Investissements selon le rôle
- `POST /api/investments` - Créer un investissement
- `GET /api/users` - Tous les utilisateurs (admin)
- `PUT /api/users/:id/role` - Modifier le rôle (admin)

## 🔍 Exemple complet

Voir le fichier `src/components/examples/ApiExample.tsx` pour un exemple complet d'utilisation de tous les hooks et services. 