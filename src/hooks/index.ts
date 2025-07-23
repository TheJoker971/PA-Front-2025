// Nouveaux hooks pour l'API v2
export { useAuth } from './useAuth';
export { useProperties } from './useProperties';
export { useInvestments } from './useInvestments';
export { useUsers } from './useUsers';
export { useRoleAccess } from './useRoleAccess';
export { useWalletAuth } from './useWalletAuth';
export type { UserRole, RolePermissions } from './useRoleAccess';

// Hooks existants (à conserver pour compatibilité si nécessaire)
export { useDistributions } from './useDistributions';
export { usePropertiesCount, useProperty } from './useImmoProperties';
export { useNotifications } from './useNotifications';
export { useUserRole } from './useUserRole';
export { useUsersWithPermissions } from './useUsersWithPermissions';
export { useApiService } from './useApiService'; 