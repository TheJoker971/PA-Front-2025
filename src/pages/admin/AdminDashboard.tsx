import React from 'react';
import { Building2, DollarSign, Users, TrendingUp, Settings, FileText, AlertTriangle, CheckCircle, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockProperties } from '../../data/mockData';

const AdminDashboard: React.FC = () => {
  const totalProperties = mockProperties.length;
  const totalValue = mockProperties.reduce((sum, prop) => sum + prop.totalValue, 0);
  const totalInvestors = 1250; // Mock data
  const totalRevenueDistributed = 2500000; // Mock data
  const pendingApprovals = 2; // Mock data

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="inline-flex items-center bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full px-6 py-3 mb-4">
            <Building2 className="h-5 w-5 text-indigo-600 mr-2" />
            <span className="text-indigo-800 font-semibold">Admin Dashboard</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Manage properties, users, and platform operations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Properties</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {totalProperties}
                </p>
              </div>
              <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-4 group-hover:scale-110 transition-transform duration-300">
                <Building2 className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="group bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Value</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  ${(totalValue / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl p-4 group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
          </div>
          
          <div className="group bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Investors</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  {totalInvestors.toLocaleString()}
                </p>
              </div>
              <div className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-2xl p-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-cyan-600" />
              </div>
            </div>
          </div>
          
          <div className="group bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Revenue Distributed</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  ${(totalRevenueDistributed / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="bg-gradient-to-r from-violet-100 to-purple-100 rounded-2xl p-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-8 w-8 text-violet-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Pending Approvals Alert */}
        {pendingApprovals > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-8 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-3 mr-4">
                  <AlertTriangle className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-amber-900 mb-2">Pending Property Approvals</h3>
                  <p className="text-amber-700 text-lg">You have {pendingApprovals} properties waiting for approval</p>
                </div>
              </div>
              <Link
                to="/admin/validation"
                className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-2xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-amber-500/25 transform hover:scale-105"
              >
                Review Now
              </Link>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center mb-4">
                <Zap className="h-8 w-8 mr-3" />
                <h2 className="text-2xl font-bold">Quick Actions</h2>
              </div>
              <p className="text-indigo-100 text-lg mb-6">
                Manage your platform efficiently with these quick actions
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <Link
            to="/admin/properties/new"
            className="group bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
          >
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-4 mr-6 group-hover:scale-110 transition-transform duration-300">
                <Building2 className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Add New Property</h3>
                <p className="text-gray-600">Create a new tokenized property</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/admin/validation"
            className="group bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
          >
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-4 mr-6 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Property Validation</h3>
                <p className="text-gray-600">Review pending property submissions</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/admin/rewards"
            className="group bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
          >
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl p-4 mr-6 group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Distribute Rewards</h3>
                <p className="text-gray-600">Manage revenue distributions</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/admin/roles"
            className="group bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
          >
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-violet-100 to-purple-100 rounded-2xl p-4 mr-6 group-hover:scale-110 transition-transform duration-300">
                <Settings className="h-8 w-8 text-violet-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Roles</h3>
                <p className="text-gray-600">Assign user permissions</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
            <Sparkles className="h-6 w-6 mr-3 text-indigo-600" />
            Recent Activity
          </h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100">
              <div className="flex items-center">
                <FileText className="h-6 w-6 text-amber-600 mr-4" />
                <div>
                  <p className="font-bold text-gray-900">New property submitted</p>
                  <p className="text-gray-600">Downtown Austin Office - awaiting approval</p>
                </div>
              </div>
              <span className="text-sm text-gray-500 font-medium">2 hours ago</span>
            </div>
            
            <div className="flex items-center justify-between p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
              <div className="flex items-center">
                <DollarSign className="h-6 w-6 text-emerald-600 mr-4" />
                <div>
                  <p className="font-bold text-gray-900">Reward distribution completed</p>
                  <p className="text-gray-600">Manhattan Office Complex - Q3 2024</p>
                </div>
              </div>
              <span className="text-sm text-gray-500 font-medium">1 day ago</span>
            </div>
            
            <div className="flex items-center justify-between p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-indigo-600 mr-4" />
                <div>
                  <p className="font-bold text-gray-900">New user registered</p>
                  <p className="text-gray-600">Premium investor account</p>
                </div>
              </div>
              <span className="text-sm text-gray-500 font-medium">2 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;