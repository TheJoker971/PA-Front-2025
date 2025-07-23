# Système de Protection de Routes par Rôles

Ce guide explique comment fonctionne le système de protection de routes basé sur les rôles utilisateur dans l'application.

## 🎭 Vue d'ensemble

Le système implémente trois niveaux d'accès :
- **User** : Accès aux propriétés publiques et à son dashboard personnel
- **Manager** : Gestion des propriétés + accès User
- **Admin** : Accès complet à toutes les fonctionnalités

## 📁 Structure des fichiers

```
src/
├── hooks/
│   └── useRoleAccess.ts          # Hook pour vérifier les permissions
├── components/Auth/
│   ├── ProtectedRoute.tsx        # Protection de routes complètes
│   ├── RoleGuard.tsx            # Protection conditionnelle de contenu
│   └── RoleDebugger.tsx         # Outil de débogage des rôles
└── components/examples/
    └── RoleGuardExample.tsx      # Exemples d'utilisation
```

## 🔐 Hook useRoleAccess

### Utilisation de base

```typescript
import { useRoleAccess } from '../hooks/useRoleAccess';

const MyComponent = () => {
  const { 
    user,              // Utilisateur connecté
    isAuthenticated,   // Statut de connexion
    permissions,       // Objet avec toutes les permissions
    hasRole,           // Fonction pour vérifier un rôle
    hasAnyRole,        // Fonction pour vérifier plusieurs rôles
    hasPermission,     // Fonction pour vérifier une permission
    userRole           // Rôle de l'utilisateur actuel
  } = useRoleAccess();

  return (
    <div>
      {isAuthenticated && <p>Connecté en tant que {user?.name}</p>}
      {hasRole('admin') && <button>Panneau Admin</button>}
      {hasAnyRole(['manager', 'admin']) && <button>Gérer</button>}
      {hasPermission('canManageProperties') && <button>Propriétés</button>}
    </div>
  );
};
```

### Permissions disponibles

```typescript
interface RolePermissions {
  canAccessAdmin: boolean;          // Accès zone admin
  canAccessOwner: boolean;          // Accès zone property owner
  canManageProperties: boolean;     // Gestion des propriétés
  canManageUsers: boolean;          // Gestion des utilisateurs
  canValidateProperties: boolean;   // Validation des propriétés
  canAccessDashboard: boolean;      // Accès au dashboard
}
```

## 🛡️ ProtectedRoute

Protection complète de routes avec redirection automatique.

### Utilisation dans le routage

```typescript
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Protection par rôle unique
<Route path="/admin" element={
  <ProtectedRoute requiredRoles="admin">
    <AdminDashboard />
  </ProtectedRoute>
} />

// Protection par rôles multiples
<Route path="/owner" element={
  <ProtectedRoute requiredRoles={['manager', 'admin']}>
    <OwnerDashboard />
  </ProtectedRoute>
} />

// Protection par permission
<Route path="/manage" element={
  <ProtectedRoute requiredPermission="canManageProperties">
    <PropertyManager />
  </ProtectedRoute>
} />
```

### Options de ProtectedRoute

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole | UserRole[];        // Rôles requis
  requiredPermission?: keyof RolePermissions;   // Permission requise
  fallbackPath?: string;                        // URL de redirection (défaut: '/')
  showUnauthorized?: boolean;                   // Afficher message d'erreur (défaut: true)
}
```

## 🎯 RoleGuard

Protection conditionnelle de contenu sans redirection.

### Exemples d'utilisation

```typescript
import RoleGuard from './components/Auth/RoleGuard';

const NavigationMenu = () => {
  return (
    <nav>
      {/* Toujours visible */}
      <Link to="/properties">Propriétés</Link>
      
      {/* Visible uniquement si connecté */}
      <RoleGuard requireAuth={true}>
        <Link to="/dashboard">Dashboard</Link>
      </RoleGuard>
      
      {/* Visible pour managers et admins */}
      <RoleGuard requiredRoles={['manager', 'admin']}>
        <Link to="/owner">Mes Propriétés</Link>
      </RoleGuard>
      
      {/* Visible pour admins uniquement */}
      <RoleGuard requiredRoles="admin">
        <Link to="/admin">Administration</Link>
      </RoleGuard>
      
      {/* Avec fallback personnalisé */}
      <RoleGuard 
        requiredRoles="admin"
        fallback={<span className="text-gray-400">Admin requis</span>}
      >
        <button>Panneau Admin</button>
      </RoleGuard>
    </nav>
  );
};
```

## 🔍 Debugger de rôles

Un composant utile pour le développement qui affiche les informations de rôle en temps réel.

### Activation

Le debugger est automatiquement activé en mode développement :

```typescript
// Dans Layout.tsx
{process.env.NODE_ENV === 'development' && <RoleDebugger />}
```

### Fonctionnalités

- ✅ Affichage de l'état de connexion
- ✅ Informations utilisateur (nom, wallet, rôle)
- ✅ État de toutes les permissions
- ✅ Interface compacte et repositionnable

## 📋 Configuration des routes protégées

### Routes Admin (admin uniquement)

```
/admin                          → AdminDashboard
/admin/properties              → AdminPropertiesOnChain
/admin/properties-mock         → AdminProperties
/admin/properties/new          → NewProperty
/admin/rewards                 → AdminRewardsOnChain
/admin/rewards-mock            → AdminRewards
/admin/roles                   → AdminRolesOnChain
/admin/roles-mock              → AdminRoles
/admin/validation              → PropertyValidation
/admin/validation/:propertyId  → PropertyReview
```

### Routes Owner/Manager (manager + admin)

```
/owner                              → OwnerDashboardOnChain
/owner-mock                         → OwnerDashboard
/owner/properties                   → OwnerPropertiesOnChain
/owner/properties-mock              → OwnerProperties
/owner/properties/new               → OwnerNewProperty
/owner/properties/edit/:propertyId  → EditProperty
```

### Routes publiques (accès libre)

```
/               → Home
/properties     → OnChainProperties
/about          → About
/faq            → FAQ
/terms          → Terms
/privacy        → Privacy
```

## 🎮 Pages de test

Pour tester le système de rôles :

- **`/test-api`** : Test complet de l'API avec authentification
- **`/test-roles`** : Démonstration de RoleGuard avec différents niveaux d'accès

## ⚠️ Gestion des erreurs

### Messages d'accès refusé

Quand un utilisateur tente d'accéder à une route protégée :

1. **Non connecté** : Affichage du prompt de connexion
2. **Rôle insuffisant** : Message "Accès refusé" avec bouton retour
3. **Redirection** : Optionnelle vers une page de fallback

### Pages d'erreur personnalisées

```typescript
// Composants intégrés dans ProtectedRoute
const LoginPrompt = () => { /* Interface de demande de connexion */ };
const UnauthorizedMessage = () => { /* Message d'accès refusé */ };
```

## 🔧 Configuration et personnalisation

### Modifier les permissions

Dans `src/hooks/useRoleAccess.ts` :

```typescript
const permissions = useMemo((): RolePermissions => {
  // ... logique existante
  
  return {
    canAccessAdmin: role === 'admin',
    canAccessOwner: role === 'manager' || role === 'admin',
    canManageProperties: role === 'manager' || role === 'admin',
    canManageUsers: role === 'admin',
    canValidateProperties: role === 'admin',
    canAccessDashboard: isAuthenticated,
    // Ajouter nouvelles permissions ici
  };
}, [user, isAuthenticated]);
```

### Ajouter de nouveaux rôles

1. Mettre à jour le type `UserRole` dans `useRoleAccess.ts`
2. Ajuster la logique des permissions
3. Mettre à jour l'API backend en conséquence

### Personnaliser les messages d'erreur

Modifiez les composants `LoginPrompt` et `UnauthorizedMessage` dans `ProtectedRoute.tsx`.

## 🚀 Utilisation en production

### Checklist de sécurité

- ✅ Validation côté serveur des rôles
- ✅ Tokens JWT avec expiration
- ✅ Validation des permissions sur chaque requête API
- ✅ Audit des accès et des actions

### Optimisations

- Les permissions sont memoïzées pour éviter les recalculs
- Le debugger n'est actif qu'en développement
- Lazy loading possible pour les routes protégées

### Monitoring

Intégrez des analytics pour surveiller :
- Tentatives d'accès non autorisées
- Utilisation des différentes sections par rôle
- Performance du système d'authentification

## 🔄 Intégration avec l'API

Le système s'intègre parfaitement avec l'API v2 :

```typescript
// L'authentification se fait via wallet
await authService.login('0x1234567890abcdef...');

// Les rôles sont automatiquement récupérés
const { user } = useAuth(); // user.role contient le rôle
```

## 📖 Exemples avancés

### Protection conditionnelle complexe

```typescript
<RoleGuard
  requiredRoles={['manager', 'admin']}
  fallback={
    <RoleGuard requiredRoles="user">
      <p>Contenu pour utilisateurs basiques</p>
    </RoleGuard>
  }
>
  <p>Contenu pour managers et admins</p>
</RoleGuard>
```

### Combinaison rôles et permissions

```typescript
const { hasRole, hasPermission } = useRoleAccess();

const canEditProperty = hasRole('admin') || 
  (hasRole('manager') && hasPermission('canManageProperties'));
```

Ce système offre une protection robuste et flexible des routes selon les rôles utilisateur, avec une excellente expérience développeur grâce aux outils de débogage intégrés. 