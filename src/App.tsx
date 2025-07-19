import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout/Layout';
import { Web3Provider } from './providers/Web3Provider';

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
import TestWrite from './pages/TestWrite';

// Dashboard pages
import Dashboard from './pages/Dashboard';
import DashboardProperties from './pages/dashboard/DashboardProperties';
import Claims from './pages/dashboard/Claims';
import Transactions from './pages/dashboard/Transactions';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProperties from './pages/admin/AdminProperties';
import NewProperty from './pages/admin/NewProperty';
import AdminRewards from './pages/admin/AdminRewards';
import AdminRoles from './pages/admin/AdminRoles';
import PropertyValidation from './pages/admin/PropertyValidation';
import PropertyReview from './pages/admin/PropertyReview';
import SupabaseConfig from './pages/admin/SupabaseConfig';

// Property Owner pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerProperties from './pages/owner/OwnerProperties';
import OwnerNewProperty from './pages/owner/NewProperty';
import EditProperty from './pages/owner/EditProperty';

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
              <Route path="/properties" element={<Properties />} />
              <Route path="/onchain-properties" element={<OnChainProperties />} />
              <Route path="/properties/:propertyId" element={<PropertyDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/style" element={<StyleGuide />} />
              <Route path="/test-firebase-upload" element={<TestFirebaseUpload />} />
              <Route path="/test-write" element={<TestWrite />} />
              {/* Dashboard routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/properties" element={<DashboardProperties />} />
              <Route path="/dashboard/claims" element={<Claims />} />
              <Route path="/dashboard/transactions" element={<Transactions />} />
              {/* Property Owner routes */}
              <Route path="/owner" element={<OwnerDashboard />} />
              <Route path="/owner/properties" element={<OwnerProperties />} />
              <Route path="/owner/properties/new" element={<OwnerNewProperty />} />
              <Route path="/owner/properties/edit/:propertyId" element={<EditProperty />} />
              {/* Admin routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/properties" element={<AdminProperties />} />
              <Route path="/admin/properties/new" element={<NewProperty />} />
              <Route path="/admin/rewards" element={<AdminRewards />} />
              <Route path="/admin/roles" element={<AdminRoles />} />
              <Route path="/admin/validation" element={<PropertyValidation />} />
              <Route path="/admin/validation/:propertyId" element={<PropertyReview />} />
              <Route path="/admin/supabase" element={<SupabaseConfig />} />
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