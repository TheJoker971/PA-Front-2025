import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout/Layout';
import { Web3Provider } from './providers/Web3Provider';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Public pages
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';
import StyleGuide from './pages/StyleGuide';
import TestFirebaseUpload from './pages/TestFirebaseUpload';
import OnChainProperties from './pages/OnChainProperties';
import OnChainPropertyDetails from './pages/OnChainPropertyDetails';

// Testing components
import ApiExample from './components/examples/ApiExample';
import RoleGuardExample from './components/examples/RoleGuardExample';
import WalletAuthExample from './components/examples/WalletAuthExample';

// Dashboard pages
import Dashboard from './pages/Dashboard';
import DashboardProperties from './pages/dashboard/DashboardProperties';
import Claims from './pages/dashboard/Claims';
import Transactions from './pages/dashboard/Transactions';
import DashboardOnChain from './pages/DashboardOnChain';
import DashboardPropertiesOnChain from './pages/dashboard/DashboardPropertiesOnChain';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProperties from './pages/admin/AdminProperties';
import NewProperty from './pages/admin/NewProperty';
import AdminRewards from './pages/admin/AdminRewards';
import AdminRoles from './pages/admin/AdminRoles';
import PropertyValidation from './pages/admin/PropertyValidation';
import PropertyReview from './pages/admin/PropertyReview';

import AdminPropertiesOnChain from './pages/admin/AdminPropertiesOnChain';
import AdminRewardsOnChain from './pages/admin/AdminRewardsOnChain';
import AdminRolesOnChain from './pages/admin/AdminRolesOnChain';

// Property Owner pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerProperties from './pages/owner/OwnerProperties';
import OwnerNewProperty from './pages/owner/NewProperty';
import EditProperty from './pages/owner/EditProperty';
import OwnerDashboardOnChain from './pages/owner/OwnerDashboardOnChain';
import OwnerPropertiesOnChain from './pages/owner/OwnerPropertiesOnChain';

import { WagmiProvider, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { http } from 'viem';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

const chains = [sepolia] as [typeof sepolia];

// const { connectors } = getDefaultWallets({
//   appName: 'PropertyTokens',
//   projectId: 'demo',
//   chains,
// });

// const wagmiConfig = createConfig({
//   chains,
//   connectors,
//   transports: {
//     [sepolia.id]: http(),
//   },
// });

function App() {
  return (
    <Web3Provider>
    <NotificationProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<OnChainProperties />} />
            <Route path="/properties/:propertyId" element={<OnChainPropertyDetails />} />
            <Route path="/properties-mock" element={<Properties />} />
            <Route path="/properties-mock/:propertyId" element={<PropertyDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/style" element={<StyleGuide />} />
            <Route path="/test-firebase-upload" element={<TestFirebaseUpload />} />
            <Route path="/test-api" element={<ApiExample />} />
            <Route path="/test-roles" element={<RoleGuardExample />} />
            <Route path="/test-wallet" element={<WalletAuthExample />} />
            {/* Dashboard routes */}
            <Route path="/dashboard" element={<DashboardOnChain />} />
            <Route path="/dashboard-mock" element={<Dashboard />} />
            <Route path="/dashboard/properties" element={<DashboardPropertiesOnChain />} />
            <Route path="/dashboard/properties-mock" element={<DashboardProperties />} />
            <Route path="/dashboard/claims" element={<Claims />} />
            <Route path="/dashboard/transactions" element={<Transactions />} />
            {/* Property Owner routes */}
            <Route path="/owner" element={
              <ProtectedRoute requiredRoles={['manager', 'admin']}>
                <OwnerDashboardOnChain />
              </ProtectedRoute>
            } />
            <Route path="/owner-mock" element={
              <ProtectedRoute requiredRoles={['manager', 'admin']}>
                <OwnerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/owner/properties" element={
              <ProtectedRoute requiredRoles={['manager', 'admin']}>
                <OwnerPropertiesOnChain />
              </ProtectedRoute>
            } />
            <Route path="/owner/properties-mock" element={
              <ProtectedRoute requiredRoles={['manager', 'admin']}>
                <OwnerProperties />
              </ProtectedRoute>
            } />
            <Route path="/owner/properties/new" element={
              <ProtectedRoute requiredRoles={['manager', 'admin']}>
                <OwnerNewProperty />
              </ProtectedRoute>
            } />
            <Route path="/owner/properties/edit/:propertyId" element={
              <ProtectedRoute requiredRoles={['manager', 'admin']}>
                <EditProperty />
              </ProtectedRoute>
            } />
            {/* Admin routes */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRoles="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/properties" element={
              <ProtectedRoute requiredRoles="admin">
                <AdminPropertiesOnChain />
              </ProtectedRoute>
            } />
            <Route path="/admin/properties-mock" element={
              <ProtectedRoute requiredRoles="admin">
                <AdminProperties />
              </ProtectedRoute>
            } />
            <Route path="/admin/properties/new" element={
              <ProtectedRoute requiredRoles="admin">
                <NewProperty />
              </ProtectedRoute>
            } />
            <Route path="/admin/rewards" element={
              <ProtectedRoute requiredRoles="admin">
                <AdminRewardsOnChain />
              </ProtectedRoute>
            } />
            <Route path="/admin/rewards-mock" element={
              <ProtectedRoute requiredRoles="admin">
                <AdminRewards />
              </ProtectedRoute>
            } />
            <Route path="/admin/roles" element={
              <ProtectedRoute requiredRoles="admin">
                <AdminRolesOnChain />
              </ProtectedRoute>
            } />
            <Route path="/admin/roles-mock" element={
              <ProtectedRoute requiredRoles="admin">
                <AdminRoles />
              </ProtectedRoute>
            } />
            <Route path="/admin/validation" element={
              <ProtectedRoute requiredRoles="admin">
                <PropertyValidation />
              </ProtectedRoute>
            } />
            <Route path="/admin/validation/:propertyId" element={
              <ProtectedRoute requiredRoles="admin">
                <PropertyReview />
              </ProtectedRoute>
            } />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </NotificationProvider>
    </Web3Provider>
  );
}

export default App;