# Configuration de l'API Blockchain

Ce document explique comment configurer et utiliser l'API blockchain décentralisée dans votre application React.

## Variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```
# URL de base de l'API
VITE_BASE_URL=http://localhost:8080

# Configuration ThirdWeb
VITE_THIRDWEB_CLIENT_ID=votre_client_id_thirdweb

# Configuration Supabase (si nécessaire)
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anonyme_supabase
```

## Structure des services API

Les services API sont organisés comme suit :

- `api.ts` : Configuration Axios et services API
- `ApiContext.tsx` : Contexte React pour gérer l'authentification
- `useApiService.ts` : Hook personnalisé pour faciliter les appels API

## Routes API disponibles

### Authentification

- `POST /auth/login` - Connexion avec signature cryptographique
- `POST /auth/logout` - Déconnexion (nécessite un cookie de session)

### Santé de l'API

- `GET /health` - Vérification de l'état du serveur

### Propriétés

- `GET /properties` - Récupérer toutes les propriétés validées (public)
- `GET /properties/:property_id` - Récupérer une propriété validée par ID (public)
- `GET /properties/all` - Récupérer toutes les propriétés (validées et non validées) (admin/manager)
- `GET /properties/admin/:property_id` - Récupérer une propriété par ID (validée ou non) (admin/manager)
- `POST /properties` - Créer une nouvelle propriété (admin/manager)
- `PUT /properties/:property_id/validate` - Valider ou invalider une propriété (admin)

### Investissements

- `POST /investments` - Créer un nouvel investissement (authentifié)
- `GET /investments` - Récupérer les investissements (tous pour admin/manager, personnels pour utilisateur)
- `GET /investments/user/:user_id` - Récupérer les investissements d'un utilisateur spécifique (admin/manager ou l'utilisateur lui-même)

### Utilisateurs

- `POST /users` - Créer un nouvel utilisateur avec signature et nom (le rôle est optionnel)
- `GET /users` - Récupérer tous les utilisateurs (admin/manager)

## Authentification et gestion des rôles

L'authentification se fait via la signature cryptographique avec un wallet Ethereum. Le processus est le suivant :

1. L'utilisateur se connecte avec son wallet Metamask
2. L'application fait signer un message à l'utilisateur
3. La signature est envoyée au serveur via `/auth/login`
4. Le serveur génère un cookie de session sécurisé (`session_token`)
5. Ce cookie est automatiquement envoyé par le navigateur lors des requêtes suivantes

Les rôles sont maintenant stockés directement dans la table `users` et sont vérifiés automatiquement par le serveur en utilisant le cookie de session.

## Utilisation dans les composants

### Authentification

```jsx
import { useApi } from '../context/ApiContext';
import { useSDK } from '@thirdweb-dev/react';

const MyComponent = () => {
  const { isAuthenticated, login, logout } = useApi();
  const sdk = useSDK();
  
  const handleLogin = async () => {
    // Signer un message avec le wallet
    const message = `Authentification: ${Date.now()}`;
    const signature = await sdk?.wallet.sign(message);
    
    // Se connecter avec la signature
    await login(signature);
  };
  
  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Se déconnecter</button>
      ) : (
        <button onClick={handleLogin}>Se connecter</button>
      )}
    </div>
  );
};
```

### Appels API avec le hook personnalisé

```jsx
import useApiService from '../hooks/useApiService';
import { propertyService } from '../services/api';

const PropertiesList = () => {
  const { data, loading, error, execute } = useApiService(propertyService.getAll);
  
  useEffect(() => {
    execute();
  }, [execute]);
  
  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error.message}</p>;
  
  return (
    <div>
      {data?.map(property => (
        <div key={property.id}>{property.name}</div>
      ))}
    </div>
  );
};
```

## Configuration CORS

Pour éviter les erreurs CORS, assurez-vous que votre serveur API autorise les requêtes depuis votre domaine frontend. Pour le développement local, ajoutez `http://localhost:5173` à la liste des origines autorisées dans votre configuration CORS.

## Sécurité

Toutes les routes authentifiées nécessitent un cookie de session valide. Le cookie est automatiquement envoyé par le navigateur grâce à l'option `withCredentials: true` dans la configuration Axios.

## Niveaux de permissions

- **Public** : Accessible sans authentification
- **Authentifié** : Nécessite un cookie de session valide
- **Manager** : Nécessite le rôle "manager" ou "admin"
- **Admin** : Nécessite le rôle "admin" 