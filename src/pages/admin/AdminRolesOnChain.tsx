import React, { useState, useEffect } from 'react';
import { User, Shield, UserPlus, Sparkles, Users, Loader2 } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { useWalletClient, useAccount, usePublicClient } from 'wagmi';
import PropertySharesABI from '../../abi/PropertyShares.json';
import ImmoPropertyABI from '../../abi/ImmoProperty.json';
import { useUsersWithPermissions } from '../../hooks/useUsersWithPermissions';
import { roleService } from '../../services/api';

const YIELD_MANAGER_ROLE = '0x470f4f1717679395b6a9e0700797bfeeaa970f1643e72f5684d687c0be10fe27';
const ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';
const IMMO_PROPERTY_ADDRESS = import.meta.env.VITE_IMMO_PROPERTY_ADDRESS;

interface OnChainProperty {
  id: string;
  name: string;
  shareToken: string;
}

const AdminRolesOnChain: React.FC = () => {
  const [newUserAddress, setNewUserAddress] = useState('');
  const [newUserRole, setNewUserRole] = useState('yield_manager');
  const [isGranting, setIsGranting] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [properties, setProperties] = useState<OnChainProperty[]>([]);
  
  const { showToast, showModal } = useNotification();
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { users, loading: usersLoading, error: usersError, refetch: refetchUsers } = useUsersWithPermissions();

  // Récupérer la liste des propriétés on-chain
  useEffect(() => {
    const fetchProperties = async () => {
      if (!publicClient || !IMMO_PROPERTY_ADDRESS) return;
      try {
        const count = await publicClient.readContract({
          address: IMMO_PROPERTY_ADDRESS as `0x${string}`,
          abi: ImmoPropertyABI.abi,
          functionName: 'getPropertiesCount',
        }) as bigint;
        const props: OnChainProperty[] = [];
        for (let i = 1; i <= Number(count); i++) {
          const property = await publicClient.readContract({
            address: IMMO_PROPERTY_ADDRESS as `0x${string}`,
            abi: ImmoPropertyABI.abi,
            functionName: 'getProperty',
            args: [BigInt(i)],
          }) as any;
          props.push({
            id: `${i}`,
            name: property.name,
            shareToken: property.shareToken,
          });
        }
        setProperties(props);
      } catch (e) {
        setProperties([]);
      }
    };
    fetchProperties();
  }, [publicClient]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProperties.length === 0) {
      showToast({
        type: 'warning',
        title: 'Aucune propriété sélectionnée',
        message: 'Sélectionne au moins une propriété.'
      });
      return;
    }
    const confirmed = await showModal({
      type: 'confirm',
      title: 'Ajouter le rôle',
      message: `Attribuer le rôle ${newUserRole.replace('_', ' ')} à ${newUserAddress} sur ${selectedProperties.length} propriété(s) ?`,
      confirmText: 'Confirmer',
      cancelText: 'Annuler'
    });
    if (!confirmed) return;
    setIsGranting(true);
    let roleHash = newUserRole === 'yield_manager' ? YIELD_MANAGER_ROLE : ADMIN_ROLE;
    let successCount = 0;
    for (const propId of selectedProperties) {
      const prop = properties.find(p => p.id === propId);
      if (!prop) continue;
      try {
        if (!walletClient) throw new Error('Wallet not connected');
        const tx = await walletClient.writeContract({
          address: prop.shareToken as `0x${string}`,
          abi: PropertySharesABI.abi,
          functionName: 'grantRole',
          args: [roleHash, newUserAddress],
          account: address,
        });
        showToast({
          type: 'success',
          title: `Rôle attribué sur ${prop.name}`,
          message: `Tx: ${tx}`
        });
        successCount++;
      } catch (err: any) {
        showToast({
          type: 'error',
          title: `Erreur sur ${prop.name}`,
          message: err?.message || 'Transaction échouée.'
        });
      }
    }
    setIsGranting(false);
    setNewUserAddress('');
    setNewUserRole('yield_manager');
    setSelectedProperties([]);
    if (successCount > 0) {
      // Créer l'utilisateur dans la base de données avec le rôle approprié
      try {
        if (address) {
          // Déterminer le rôle système basé sur le rôle on-chain
          let systemRole = 'manager'; // par défaut
          if (newUserRole === 'admin') {
            systemRole = 'admin';
          }
          
          console.log('🔄 Appel au backend pour créer l\'utilisateur:', {
            address,
            newUserAddress,
            systemRole
          });
          
          await roleService.assignRole(address, newUserAddress, systemRole);
          
          console.log('✅ Utilisateur créé dans la base de données');
          
          showToast({
            type: 'success',
            title: 'Attribution terminée',
            message: `${successCount} propriété(s) mises à jour et utilisateur créé dans la base de données.`
          });
        } else {
          showToast({
            type: 'success',
            title: 'Attribution terminée',
            message: `${successCount} propriété(s) mises à jour.`
          });
        }
      } catch (err: any) {
        console.error('❌ Erreur lors de la création en base de données:', err);
        showToast({
          type: 'warning',
          title: 'Rôles on-chain attribués',
          message: `${successCount} propriété(s) mises à jour, mais erreur lors de la création en base de données: ${err?.message || 'Erreur inconnue'}`
        });
      }
      
      // Rafraîchir la liste des utilisateurs
      refetchUsers();
    }
  };

  const handleRoleChange = async (userId: string, newRole: string, userAddress: string) => {
    try {
      if (!address) throw new Error('Wallet not connected');
      
      const confirmed = await showModal({
        type: 'confirm',
        title: 'Changer le rôle',
        message: `Changer le rôle de ${userAddress} vers ${newRole} ?`,
        confirmText: 'Confirmer',
        cancelText: 'Annuler'
      });
      
      if (!confirmed) return;

      // Créer/modifier l'utilisateur dans la base de données
      await roleService.assignRole(address, userAddress, newRole);
      
      showToast({
        type: 'success',
        title: 'Rôle modifié',
        message: `Le rôle de ${userAddress} a été changé vers ${newRole} dans la base de données.`
      });
      
      // Rafraîchir la liste des utilisateurs
      refetchUsers();
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Erreur',
        message: err?.message || 'Impossible de modifier le rôle.'
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-gradient-to-r from-red-500 to-pink-600 text-white';
      case 'manager':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white';
      case 'yield_manager':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
      case 'property_owner':
        return 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="inline-flex items-center bg-gradient-to-r from-violet-100 to-purple-100 rounded-full px-6 py-3 mb-4">
            <Users className="h-5 w-5 text-violet-600 mr-2" />
            <span className="text-violet-800 font-semibold">Role Management (On-Chain)</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            Role Management (On-Chain)
          </h1>
          <p className="text-xl text-gray-600">
            Attribuez les rôles Yield Manager ou Admin sur une ou plusieurs propriétés on-chain.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add New User */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <UserPlus className="h-6 w-6 mr-3 text-indigo-600" />
                Attribuer un rôle on-chain
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
                    disabled={isGranting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Rôle à attribuer
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors font-medium"
                    disabled={isGranting}
                  >
                    <option value="yield_manager">Yield Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Propriétés concernées
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {properties.map((prop) => (
                      <label key={prop.id} className={`flex items-center space-x-3 p-3 rounded-xl border ${selectedProperties.includes(prop.id) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white'} cursor-pointer`}>
                        <input
                          type="checkbox"
                          checked={selectedProperties.includes(prop.id)}
                          onChange={() => {
                            setSelectedProperties((prev) => prev.includes(prop.id) ? prev.filter(id => id !== prop.id) : [...prev, prop.id]);
                          }}
                          disabled={isGranting}
                        />
                        <span className="font-medium text-gray-900">{prop.name}</span>
                        <span className="text-xs text-gray-500">{prop.shareToken.slice(0, 6)}...{prop.shareToken.slice(-4)}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-indigo-500/25 transform hover:scale-105 flex items-center justify-center ${isGranting ? 'opacity-60 cursor-not-allowed' : ''}`}
                  disabled={isGranting}
                >
                  {isGranting ? (
                    <span className="flex items-center"><UserPlus className="h-5 w-5 mr-2 animate-spin" />Attribution en cours...</span>
                  ) : (
                    <><UserPlus className="h-5 w-5 mr-2" />Attribuer le rôle</>
                  )}
                </button>
              </form>
            </div>
            {/* Users List */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              <div className="p-8 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Shield className="h-6 w-6 mr-3 text-indigo-600" />
                  Platform Users (Read Only)
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  Liste des utilisateurs avec des rôles spéciaux - Informations uniquement
                </p>
              </div>
              {usersLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
              ) : usersError ? (
                <div className="p-8 text-center text-red-600">
                  {usersError}
                </div>
              ) : users.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  Aucun utilisateur avec des rôles spéciaux trouvé.
                </div>
              ) : (
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
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="text-sm font-bold text-gray-900">{formatAddress(user.signature)}</div>
                            {user.name && (
                              <div className="text-sm text-gray-500">{user.name}</div>
                            )}
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-full ${getRoleColor(user.role)}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatDate(user.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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

export default AdminRolesOnChain; 