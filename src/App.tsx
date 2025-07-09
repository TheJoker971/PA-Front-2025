import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout/Layout';

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

// Property Owner pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerProperties from './pages/owner/OwnerProperties';
import OwnerNewProperty from './pages/owner/NewProperty';

function App() {
  return (
    <NotificationProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:propertyId" element={<PropertyDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/style" element={<StyleGuide />} />
              
              {/* Dashboard routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/properties" element={<DashboardProperties />} />
              <Route path="/dashboard/claims" element={<Claims />} />
              <Route path="/dashboard/transactions" element={<Transactions />} />
              
              {/* Property Owner routes */}
              <Route path="/owner" element={<OwnerDashboard />} />
              <Route path="/owner/properties" element={<OwnerProperties />} />
              <Route path="/owner/properties/new" element={<OwnerNewProperty />} />
              
              {/* Admin routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/properties" element={<AdminProperties />} />
              <Route path="/admin/properties/new" element={<NewProperty />} />
              <Route path="/admin/rewards" element={<AdminRewards />} />
              <Route path="/admin/roles" element={<AdminRoles />} />
              <Route path="/admin/validation" element={<PropertyValidation />} />
              <Route path="/admin/validation/:propertyId" element={<PropertyReview />} />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Router>
    </NotificationProvider>
  );
}

export default App;