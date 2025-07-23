// Export des services API v2
export {
  authService,
  healthService,
  userService,
  propertyService,
  investmentService,
  setAuthWallet,
  getAuthWallet,
} from './api-v2';

// Export des composants Auth
export { default as ProtectedRoute } from '../components/Auth/ProtectedRoute';
export { default as RoleGuard } from '../components/Auth/RoleGuard';
export { default as WalletConnector } from '../components/Auth/WalletConnector';

// Export des types API
export * from '../types/api';

// Services existants (conservés pour compatibilité)
export * from './api';
export * from './firebase';
export * from './upload'; 