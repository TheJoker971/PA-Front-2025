import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Sparkles, Shield, Users, MapPin, TrendingUp } from 'lucide-react';
import EnvironmentWarning from '../components/common/EnvironmentWarning';
import { usePropertiesCount, useProperty } from '../hooks/useImmoProperties';
import { usePublicClient } from 'wagmi';
import { ethers } from 'ethers';
import PropertySharesABI from '../abi/PropertyShares.json';
import { Property } from '../types';

const Home: React.FC = () => {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: count } = usePropertiesCount();
  const publicClient = usePublicClient();

  useEffect(() => {
    const fetchOnChainProperties = async () => {
      if (!count || Number(count) === 0 || !publicClient) {
        // Pas de propriétés on-chain, garder le spinner
        setFeaturedProperties([]);
        setLoading(false);
        return;
      }

      try {
        const properties: Property[] = [];
        const maxProperties = Math.min(Number(count), 3); // Prendre max 3 propriétés

        for (let i = 1; i <= maxProperties; i++) {
          try {
            const propertyData = await publicClient.readContract({
              address: import.meta.env.VITE_IMMO_PROPERTY_ADDRESS as `0x${string}`,
              abi: [
                {
                  name: 'getProperty',
                  type: 'function',
                  inputs: [{ name: 'propertyId', type: 'uint256' }],
                  outputs: [
                    {
                      name: '',
                      type: 'tuple',
                      components: [
                        { name: 'name', type: 'string' },
                        { name: 'uri', type: 'string' },
                        { name: 'price', type: 'uint256' },
                        { name: 'totalShares', type: 'uint256' },
                        { name: 'owner', type: 'address' },
                        { name: 'shareToken', type: 'address' }
                      ]
                    }
                  ],
                  stateMutability: 'view'
                }
              ],
              functionName: 'getProperty',
              args: [BigInt(i)]
            });

            const tuple = propertyData as any;
            
            // Récupérer les métadonnées depuis l'URI
            let metadata = {};
            try {
              const response = await fetch(tuple.uri);
              if (response.ok) {
                metadata = await response.json();
              }
            } catch (e) {
              console.warn('Impossible de récupérer les métadonnées pour la propriété', i);
            }

            // Récupérer les données du PropertyShares
            const shareToken = tuple.shareToken as `0x${string}`;
            let unitPrice = 0;
            let annualYield = 0;
            let availableTokens = 0;
            let totalTokens = 0;

            if (shareToken && publicClient) {
              try {
                const provider = new ethers.providers.JsonRpcProvider(publicClient.transport.url);
                const contract = new ethers.Contract(shareToken, PropertySharesABI.abi, provider);
                
                const [unitPriceData, annualYieldData, totalSupplyData, maxSupplyData] = await Promise.all([
                  contract.getUnitPrice(),
                  contract.getAnnualYield(),
                  contract.totalSupply(),
                  contract.MAX_SUPPLY()
                ]);

                unitPrice = Number(unitPriceData) / 1e18;
                annualYield = Number(annualYieldData) / 100;
                totalTokens = Number(totalSupplyData) / 1e18;
                availableTokens = Number(maxSupplyData) / 1e18 - totalTokens;
              } catch (e) {
                console.warn('Impossible de récupérer les données PropertyShares pour la propriété', i);
              }
            }

            const property: Property = {
              id: i.toString(),
              name: tuple.name || 'Propriété ' + i,
              image: (metadata as any)?.mainImage || (metadata as any)?.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80',
              imageUrl: (metadata as any)?.mainImage || (metadata as any)?.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80',
              location: (metadata as any)?.location || 'Localisation non spécifiée',
              propertyType: (metadata as any)?.propertyType || 'Résidentiel',
              status: 'active',
              description: (metadata as any)?.description || 'Description non disponible',
              totalValue: Number(tuple.price) / 1e18,
              tokenPrice: unitPrice,
              annualYield: annualYield,
              availableTokens: availableTokens,
              totalTokens: totalTokens,
              tokenAddress: shareToken,
              price: Number(tuple.price) / 1e18,
            };

            properties.push(property);
          } catch (e) {
            console.warn('Erreur lors de la récupération de la propriété', i, e);
          }
        }

        setFeaturedProperties(properties);
      } catch (e) {
        console.error('Erreur lors de la récupération des propriétés on-chain:', e);
        // Pas de fallback vers les données mock
        setFeaturedProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOnChainProperties();
  }, [count, publicClient]);

  return (
    <div>
      {/* Avertissement pour les variables d'environnement manquantes */}
      <EnvironmentWarning />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Investissez dans l'immobilier avec des tokens
              </h1>
              <p className="text-xl mb-8 text-indigo-100">
                Accédez à des opportunités immobilières premium avec un investissement minimal et une liquidité maximale.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/properties" 
                  className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-300"
                >
                  Explorer les propriétés
                </Link>
                <Link 
                  to="/about" 
                  className="bg-indigo-800 bg-opacity-50 px-6 py-3 rounded-xl font-bold hover:bg-opacity-70 transition-colors border border-indigo-400"
                >
                  En savoir plus
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>
                <div className="relative">
                  <img 
                    src="/images/building.jpg" 
                    alt="Immeuble tokenisé" 
                    className="rounded-2xl shadow-2xl border-4 border-white"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Propriétés en vedette</h2>
            <p className="mt-4 text-xl text-gray-600">Découvrez nos opportunités d'investissement les plus populaires</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // Spinner de chargement au centre
              <div className="col-span-full flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
              </div>
            ) : featuredProperties.length === 0 ? (
              // Aucune propriété on-chain trouvée
              <div className="col-span-full text-center py-20">
                <div className="bg-white rounded-xl p-8 shadow-lg">
                  <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune propriété on-chain disponible</h3>
                  <p className="text-gray-600 mb-6">Les propriétés en vedette apparaîtront ici une fois qu'elles seront créées sur la blockchain.</p>
                  <Link 
                    to="/properties" 
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Voir toutes les propriétés
                  </Link>
                </div>
              </div>
            ) : (
              featuredProperties.map((property) => (
                <Link 
                  to={property.tokenAddress ? `/properties/${property.id}` : `/properties-mock/${property.id}`} 
                  key={property.id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group"
                >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={property.image} 
                    alt={property.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {property.propertyType}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{property.name}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{property.location}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <TrendingUp className="h-5 w-5 text-emerald-500 mr-2" />
                        <span className="text-emerald-500 font-bold">{property.annualYield}% rendement</span>
                      </div>
                      <div className="text-gray-700 font-semibold">${property.tokenPrice} / token</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ width: `${property.totalTokens && property.availableTokens ? ((property.totalTokens - property.availableTokens) / property.totalTokens) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>{property.totalTokens && property.availableTokens ? Math.round(((property.totalTokens - property.availableTokens) / property.totalTokens) * 100) : 0}% financé</span>
                      <span>{property.availableTokens || 0} tokens restants</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
            )}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/properties" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Voir toutes les propriétés on-chain
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Comment ça marche</h2>
            <p className="mt-4 text-xl text-gray-600">Un processus simple pour investir dans l'immobilier tokenisé</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">1. Choisissez une propriété</h3>
              <p className="text-gray-600">Parcourez notre sélection de propriétés immobilières premium vérifiées et choisissez celle qui correspond à vos objectifs d'investissement.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">2. Achetez des tokens</h3>
              <p className="text-gray-600">Investissez le montant que vous souhaitez, sans minimum élevé. Chaque token représente une part fractionnée de la propriété.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">3. Recevez des revenus</h3>
              <p className="text-gray-600">Gagnez des revenus locatifs proportionnels à votre investissement, distribués automatiquement sur votre portefeuille.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Avantages de l'immobilier tokenisé</h2>
            <p className="mt-4 text-xl text-gray-600">Pourquoi choisir notre plateforme pour vos investissements immobiliers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-start">
              <div className="bg-indigo-100 p-3 rounded-full mr-4">
                <Shield className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Sécurité et transparence</h3>
                <p className="text-gray-600">Toutes les transactions sont sécurisées par la blockchain, offrant une transparence totale et une traçabilité des propriétés et des investissements.</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-start">
              <div className="bg-indigo-100 p-3 rounded-full mr-4">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Rendements attractifs</h3>
                <p className="text-gray-600">Accédez à des propriétés à haut rendement, soigneusement sélectionnées pour leur potentiel de croissance et leur génération de revenus.</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-start">
              <div className="bg-indigo-100 p-3 rounded-full mr-4">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Accessibilité</h3>
                <p className="text-gray-600">Investissez dans l'immobilier avec un capital réduit, éliminant les barrières traditionnelles à l'entrée du marché immobilier.</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-start">
              <div className="bg-indigo-100 p-3 rounded-full mr-4">
                <Sparkles className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Liquidité améliorée</h3>
                <p className="text-gray-600">Vendez vos tokens facilement sur notre marketplace, offrant une liquidité bien supérieure aux investissements immobiliers traditionnels.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Prêt à commencer votre parcours d'investissement immobilier ?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Rejoignez des milliers d'investisseurs qui transforment leur façon d'investir dans l'immobilier grâce à la tokenisation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/properties" 
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg"
            >
              Explorer les propriétés
            </Link>
            <Link 
              to="/about" 
              className="bg-transparent text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors border border-white"
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;