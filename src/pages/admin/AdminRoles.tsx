import React, { useState } from 'react';
import { User, Shield, UserPlus, Search, Sparkles, Users } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

const AdminRoles: React.FC = () => {
  const [newUserAddress, setNewUserAddress] = useState('');
  const [newUserRole, setNewUserRole] = useState('investor');
  const { showToast, showModal } = useNotification();

  const users = [
    {
      id: '1',
      address: '0x1234567890abcdef1234567890abcdef12345678',
      role: 'admin',
      addedDate: new Date('2024-01-15')
    },
    {
      id: '2',
      address: '0x2345678901bcdef01234567890abcdef23456789',
      role: 'property_manager',
      addedDate: new Date('2024-02-20')
    },
    {
      id: '3',
      address: '0x3456789012cdef012345678901bcdef0345678901',
      role: 'yield_manager',
      addedDate: new Date('2024-03-10')
    },
    {
      id: '4',
      address: '0x4567890123def0123456789012cdef04567890123',
      role: 'property_owner',
      addedDate: new Date('2024-03-15')
    }
  ];

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const confirmed = await showModal({
      type: 'confirm',
      title: 'Add New User',
      message: `Are you sure you want to add user ${newUserAddress} with role ${newUserRole}?`,
      confirmText: 'Add User',
      cancelText: 'Cancel'
    });

    if (confirmed) {
      showToast({
        type: 'success',
        title: 'User Added Successfully!',
        message: `User ${newUserAddress.slice(0, 6)}...${newUserAddress.slice(-4)} has been added with role ${newUserRole}.`
      });
      
      setNewUserAddress('');
      setNewUserRole('investor');
    }
  };

  const handleRoleChange = async (userId: string, newRole: string, userAddress: string) => {
    const confirmed = await showModal({
      type: 'confirm',
      title: 'Change User Role',
      message: `Are you sure you want to change the role for user ${userAddress.slice(0, 6)}...${userAddress.slice(-4)} to ${newRole}?`,
      confirmText: 'Change Role',
      cancelText: 'Cancel'
    });

    if (confirmed) {
      showToast({
        type: 'success',
        title: 'Role Updated!',
        message: `User role has been successfully changed to ${newRole}.`
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-gradient-to-r from-red-500 to-pink-600 text-white';
      case 'property_manager':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white';
      case 'yield_manager':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
      case 'property_owner':
        return 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="inline-flex items-center bg-gradient-to-r from-violet-100 to-purple-100 rounded-full px-6 py-3 mb-4">
            <Users className="h-5 w-5 text-violet-600 mr-2" />
            <span className="text-violet-800 font-semibold">Role Management</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            Role Management
          </h1>
          <p className="text-xl text-gray-600">
            Manage user roles and permissions on the platform
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add New User */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <UserPlus className="h-6 w-6 mr-3 text-indigo-600" />
                Add New User
              </h2>
              
              <form onSubmit={handleAddUser} className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Wallet Address
                  </label>
                  <input
                    type="text"
                    value={newUserAddress}
                    onChange={(e) => setNewUserAddress(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors font-medium"
                    placeholder="0x1234567890abcdef1234567890abcdef12345678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Role
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors font-medium"
                  >
                    <option value="investor">Investor</option>
                    <option value="property_owner">Property Owner</option>
                    <option value="property_manager">Property Manager</option>
                    <option value="yield_manager">Yield Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-indigo-500/25 transform hover:scale-105 flex items-center justify-center"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Add User
                </button>
              </form>
            </div>

            {/* Users List */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              <div className="p-8 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Shield className="h-6 w-6 mr-3 text-indigo-600" />
                  Platform Users
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-indigo-50">
                    <tr>
                      <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Address
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Added Date
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">
                            {user.address.slice(0, 6)}...{user.address.slice(-4)}
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-full ${getRoleColor(user.role)}`}>
                            {user.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.addedDate.toLocaleDateString()}
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                          <select
                            onChange={(e) => handleRoleChange(user.id, e.target.value, user.address)}
                            defaultValue={user.role}
                            className="text-sm border border-gray-300 rounded-xl px-3 py-2 font-medium bg-white hover:bg-gray-50 transition-colors"
                          >
                            <option value="investor">Investor</option>
                            <option value="property_owner">Property Owner</option>
                            <option value="property_manager">Property Manager</option>
                            <option value="yield_manager">Yield Manager</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Role Descriptions */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Sparkles className="h-6 w-6 mr-3 text-indigo-600" />
                Role Descriptions
              </h3>
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-100">
                  <div className="flex items-center mb-3">
                    <Shield className="h-5 w-5 text-red-500 mr-3" />
                    <h4 className="font-bold text-gray-900">Admin</h4>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Full access to all platform features including user management, property approval, and system configuration.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                  <div className="flex items-center mb-3">
                    <User className="h-5 w-5 text-emerald-500 mr-3" />
                    <h4 className="font-bold text-gray-900">Property Owner</h4>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Can submit new properties for tokenization and manage their property listings.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <div className="flex items-center mb-3">
                    <User className="h-5 w-5 text-blue-500 mr-3" />
                    <h4 className="font-bold text-gray-900">Property Manager</h4>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Can add new properties, manage property listings, and update property information.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                  <div className="flex items-center mb-3">
                    <User className="h-5 w-5 text-green-500 mr-3" />
                    <h4 className="font-bold text-gray-900">Yield Manager</h4>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Can distribute rewards and manage rental income distributions to investors.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-100">
                  <div className="flex items-center mb-3">
                    <User className="h-5 w-5 text-gray-500 mr-3" />
                    <h4 className="font-bold text-gray-900">Investor</h4>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Can browse properties, make investments, and access their investment dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRoles;