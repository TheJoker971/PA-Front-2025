# Authentification Wallet avec Création Automatique

Ce guide explique comment fonctionne le système d'authentification par wallet avec création automatique d'utilisateur.

## 🎯 Vue d'ensemble

Le système permet aux utilisateurs de se connecter uniquement avec leur adresse wallet. Si l'utilisateur n'existe pas dans le système, un compte est automatiquement créé avec le rôle "user" par défaut.

### Avantages

- ✅ **Onboarding simplifié** : Pas besoin d'inscription manuelle
- ✅ **Compatible Web3** : Fonctionne avec MetaMask, WalletConnect, etc.
- ✅ **Expérience fluide** : Un seul clic pour se connecter ou créer un compte
- ✅ **Sécurité** : Authentification basée sur la possession du wallet

## 📁 Structure des fichiers

```
src/
├── services/
│   └── api-v2.ts                 # Service API avec loginOrCreate
├── hooks/
│   ├── useAuth.ts                # Hook d'authentification principal
│   └── useWalletAuth.ts          # Hook spécialisé pour wallet
├── components/Auth/
│   └── WalletConnector.tsx       # Composant de connexion réutilisable
└── components/examples/
    └── WalletAuthExample.tsx     # Page de démonstration
```

## 🔄 Processus d'authentification

### Étape 1 : Tentative de connexion
```typescript
// Le système tente de connecter l'utilisateur
await authService.login(wallet);
```

### Étape 2 : Gestion des erreurs
```typescript
// Si l'utilisateur n'existe pas (404/401)
if (error.response?.status === 404 || error.response?.status === 401) {
  // Créer automatiquement l'utilisateur
  await userService.create({
    wallet,
    name: name || `User ${wallet.substring(0, 6)}...`,
    role: 'user'
  });
  
  // Puis se connecter
  return await authService.login(wallet);
}
```

### Étape 3 : Connexion réussie
L'utilisateur est maintenant connecté et peut accéder aux fonctionnalités selon son rôle.

## 🛠️ API Services

### Service d'authentification étendu

```typescript
// Connexion avec création automatique
const user = await authService.loginOrCreate(wallet, name);

// Connexion normale (sans création)
const user = await authService.login(wallet);
```

### Fonction loginOrCreate

```typescript
export const authService = {
  loginOrCreate: async (wallet: string, name?: string): Promise<ApiUser> => {
    try {
      // Tentative de connexion normale
      return await authService.login(wallet);
    } catch (error: any) {
      // Si l'utilisateur n'existe pas, le créer
      if (error.response?.status === 404 || error.response?.status === 401) {
        const defaultName = name || `User ${wallet.substring(0, 6)}...${wallet.substring(wallet.length - 4)}`;
        
        await userService.create({
          wallet,
          name: defaultName,
          role: 'user'
        });

        // Se connecter avec l'utilisateur nouvellement créé
        return await authService.login(wallet);
      }
      throw error;
    }
  }
};
```

## 🎣 Hooks

### useAuth (modifié)

```typescript
import { useAuth } from '../hooks/useAuth';

const MyComponent = () => {
  const { login, user, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    try {
      // Le paramètre name est optionnel
      await login('0x1234567890abcdef...', 'John Doe');
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Connecté en tant que {user?.name}</p>
      ) : (
        <button onClick={handleLogin}>Se connecter</button>
      )}
    </div>
  );
};
```

### useWalletAuth (nouveau)

Hook spécialisé avec validation et gestion d'erreurs améliorée :

```typescript
import { useWalletAuth } from '../hooks/useWalletAuth';

const MyComponent = () => {
  const { connectWallet, isConnecting, error } = useWalletAuth();

  const handleConnect = async () => {
    const result = await connectWallet('0x1234567890abcdef...', 'John Doe');
    
    if (result.success) {
      console.log(result.message); // "✅ Compte créé et connexion réussie!"
      console.log('Nouvel utilisateur:', result.isNewUser);
    } else {
      console.error(result.message);
    }
  };

  return (
    <button onClick={handleConnect} disabled={isConnecting}>
      {isConnecting ? 'Connexion...' : 'Se connecter'}
    </button>
  );
};
```

## 🧩 Composant WalletConnector

Composant réutilisable pour l'authentification :

```typescript
import WalletConnector from './components/Auth/WalletConnector';

const MyPage = () => {
  const handleSuccess = (user) => {
    console.log('Utilisateur connecté:', user);
  };

  const handleError = (error) => {
    console.error('Erreur:', error);
  };

  return (
    <WalletConnector
      onSuccess={handleSuccess}
      onError={handleError}
      showNameField={true}  // Afficher le champ nom (optionnel)
      className="max-w-md"  // Styles personnalisés
    />
  );
};
```

### Props du WalletConnector

```typescript
interface WalletConnectorProps {
  onSuccess?: (user: any) => void;    // Callback de succès
  onError?: (error: string) => void;  // Callback d'erreur
  className?: string;                 // Classes CSS
  showNameField?: boolean;            // Afficher le champ nom
}
```

## ✨ Fonctionnalités

### Validation automatique

Le système valide automatiquement :
- ✅ Format de l'adresse wallet (doit commencer par 0x)
- ✅ Longueur minimale de l'adresse
- ✅ Disponibilité de l'API

### Génération de nom par défaut

Si aucun nom n'est fourni, un nom est généré automatiquement :
```typescript
const defaultName = `User ${wallet.substring(0, 6)}...${wallet.substring(wallet.length - 4)}`;
// Exemple: "User 0x1234...7890"
```

### États de chargement

Tous les composants gèrent les états de chargement :
```typescript
{isConnecting ? (
  <span className="flex items-center">
    <LoadingSpinner />
    Connexion...
  </span>
) : (
  'Se connecter / Créer compte'
)}
```

### Gestion d'erreurs

Gestion complète des erreurs avec messages explicites :
```typescript
// Erreurs de validation
"Adresse wallet invalide"
"L'adresse wallet doit commencer par 0x"

// Erreurs réseau
"Impossible de créer l'utilisateur: [détails]"
"Erreur lors de la connexion"
```

## 🎮 Page de démonstration

Accédez à `/test-wallet` pour voir une démonstration complète avec :

- ✅ Composant de connexion interactif
- ✅ Affichage des informations utilisateur
- ✅ Notifications en temps réel
- ✅ Exemples d'adresses pour les tests
- ✅ Explication du processus étape par étape

### Adresses de test

```
0x1234567890123456789012345678901234567890
0xabcdefabcdefabcdefabcdefabcdefabcdefabcd
```

## 🔧 Configuration

### Variables d'environnement

```env
VITE_API_BASE_URL=http://localhost:8080
```

### Paramètres par défaut

```typescript
// Rôle par défaut pour les nouveaux utilisateurs
const DEFAULT_ROLE = 'user';

// Format de nom par défaut
const DEFAULT_NAME_FORMAT = 'User {start}...{end}';
```

## 🚀 Intégration en production

### Avec des wallets Web3

```typescript
// Exemple avec MetaMask
if (window.ethereum) {
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts'
  });
  
  const wallet = accounts[0];
  await login(wallet, 'Mon nom');
}
```

### Avec WalletConnect

```typescript
// Exemple avec WalletConnect
const connector = new WalletConnect({
  bridge: "https://bridge.walletconnect.org"
});

const accounts = await connector.enable();
const wallet = accounts[0];
await login(wallet);
```

## 🔒 Sécurité

### Côté frontend
- ✅ Validation des formats d'adresse
- ✅ Gestion des états d'erreur
- ✅ Protection contre les injections

### Côté backend
- ✅ Validation des adresses wallet
- ✅ Vérification de l'unicité des wallets
- ✅ Gestion des erreurs de création
- ✅ Audit des créations de comptes

## 📊 Monitoring

### Métriques recommandées
- Nombre de nouveaux comptes créés automatiquement
- Taux de succès des connexions
- Erreurs de validation les plus fréquentes
- Temps de réponse de l'API d'authentification

### Logs utiles
```typescript
console.log(`🔗 Tentative de connexion avec le wallet: ${wallet}`);
console.log(`✅ Utilisateur créé avec succès: ${name}`);
console.error(`❌ Erreur de connexion wallet: ${error}`);
```

## 🔄 Migration

### Depuis l'ancien système

Si vous migrez depuis un système d'authentification traditionnel :

1. **Garder la compatibilité** : Maintenir les deux systèmes en parallèle
2. **Mapping des utilisateurs** : Lier les comptes existants aux wallets
3. **Migration progressive** : Permettre aux utilisateurs de lier leur wallet

### Base de données

Assurez-vous que votre base de données supporte :
```sql
-- Table users avec wallet unique
ALTER TABLE users ADD COLUMN wallet VARCHAR(42) UNIQUE;
CREATE INDEX idx_users_wallet ON users(wallet);
```

## 🛠️ Dépannage

### Erreurs courantes

**"Adresse wallet invalide"**
- Vérifiez que l'adresse commence par 0x
- Vérifiez la longueur (42 caractères)

**"Impossible de créer l'utilisateur"**
- Vérifiez la connexion à l'API
- Vérifiez que le wallet n'existe pas déjà
- Consultez les logs du serveur

**"Erreur 401/404"**
- L'API fonctionne correctement (création automatique déclenchée)
- Si l'erreur persiste après création, vérifiez la configuration

### Debug

Activez les logs de débogage :
```typescript
// Dans useWalletAuth.ts
console.log(`🔗 Tentative de connexion avec le wallet: ${wallet}`);
```

Le composant RoleDebugger (mode développement) affiche aussi les informations d'authentification en temps réel.

Ce système offre une expérience d'onboarding Web3 moderne et fluide, parfaite pour les applications décentralisées ! 🚀 