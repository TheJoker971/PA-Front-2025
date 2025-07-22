import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Sparkles, Crown, Shield, User } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useUserRole } from '../../hooks/useUserRole';

const Header: React.FC = () => {
  const location = useLocation();
  const { role, loading, isAdmin, isManager, isInvestor } = useUserRole();

  const isPublicRoute = ['/properties', '/about', '/faq', '/terms', '/privacy'].includes(location.pathname) || location.pathname === '/';
  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isOwnerRoute = location.pathname.startsWith('/owner');

  const getRoleIcon = () => {
    if (loading) return null;
    if (isAdmin) return <Crown className="h-4 w-4 text-yellow-600" />;
    if (isManager) return <Shield className="h-4 w-4 text-blue-600" />;
    if (isInvestor) return <User className="h-4 w-4 text-green-600" />;
    return null;
  };

  const getRoleText = () => {
    if (loading) return 'Chargement...';
    if (isAdmin) return 'Admin';
    if (isManager) return 'Manager';
    if (isInvestor) return 'Investor';
    return '';
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-xl border-b border-indigo-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-2 group-hover:scale-110 transition-transform duration-300">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              PropertyTokens
            </span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            {isPublicRoute && (
              <>
                <Link to="/properties" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium px-4 py-2 rounded-xl hover:bg-indigo-50">
                  Properties
                </Link>
                <Link to="/about" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium px-4 py-2 rounded-xl hover:bg-indigo-50">
                  About
                </Link>
                <Link to="/faq" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium px-4 py-2 rounded-xl hover:bg-indigo-50">
                  FAQ
                </Link>
              </>
            )}
            {isDashboardRoute && (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium px-4 py-2 rounded-xl hover:bg-indigo-50">
                  Overview
                </Link>
                <Link to="/dashboard/properties" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium px-4 py-2 rounded-xl hover:bg-indigo-50">
                  My Properties
                </Link>
                <Link to="/dashboard/claims" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium px-4 py-2 rounded-xl hover:bg-indigo-50">
                  Claims
                </Link>
                <Link to="/dashboard/transactions" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium px-4 py-2 rounded-xl hover:bg-indigo-50">
                  Transactions
                </Link>
              </>
            )}
            {isOwnerRoute && (
              <>
                <Link to="/owner" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium px-4 py-2 rounded-xl hover:bg-emerald-50">
                  Dashboard
                </Link>
                <Link to="/owner/properties" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium px-4 py-2 rounded-xl hover:bg-emerald-50">
                  My Properties
                </Link>
                <Link to="/owner/properties/new" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium px-4 py-2 rounded-xl hover:bg-emerald-50">
                  Add Property
                </Link>
              </>
            )}
            {isAdminRoute && (
              <>
                <Link to="/admin" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium px-4 py-2 rounded-xl hover:bg-indigo-50">
                  Dashboard
                </Link>
                <Link to="/admin/properties" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium px-4 py-2 rounded-xl hover:bg-indigo-50">
                  Properties
                </Link>
                <Link to="/admin/rewards" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium px-4 py-2 rounded-xl hover:bg-indigo-50">
                  Rewards
                </Link>
                <Link to="/admin/roles" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium px-4 py-2 rounded-xl hover:bg-indigo-50">
                  Roles
                </Link>
                <Link to="/admin/validation" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium px-4 py-2 rounded-xl hover:bg-indigo-50">
                  Validation
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Indicateur de rôle */}
            {role && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-lg">
                {getRoleIcon()}
                <span className="text-sm font-medium text-gray-700">{getRoleText()}</span>
              </div>
            )}
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;