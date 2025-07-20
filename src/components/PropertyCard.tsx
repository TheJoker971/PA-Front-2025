import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, TrendingUp, Calendar, Users, Sparkles } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const fundingProgress = ((property.totalTokens - property.availableTokens) / property.totalTokens) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white';
      case 'funded': return 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white';
      case 'upcoming': return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'residential': return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
      case 'commercial': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'industrial': return 'bg-gradient-to-r from-gray-600 to-gray-700 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  return (
    <div className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-indigo-200 transform hover:-translate-y-2">
      <div className="relative overflow-hidden">
        <img 
          src={property.imageUrl} 
          alt={property.name}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute top-4 left-4">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${getStatusColor(property.status)}`}>
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${getTypeColor(property.propertyType)}`}>
            {property.propertyType}
          </span>
        </div>
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
          <Sparkles className="h-5 w-5 text-indigo-600" />
        </div>
      </div>
      
      <div className="p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
          {property.name}
        </h3>
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="h-5 w-5 mr-2 text-indigo-500" />
          <span className="font-medium">{property.location}</span>
        </div>
        
        <p className="text-gray-700 mb-6 line-clamp-2 leading-relaxed">{property.description}</p>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Total Value</span>
            <span className="font-bold text-gray-900 text-lg">${property.totalValue.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Token Price</span>
            <span className="font-bold text-gray-900 text-lg">${property.tokenPrice}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Annual Yield</span>
            <span className="font-bold text-emerald-600 flex items-center text-lg">
              <TrendingUp className="h-5 w-5 mr-1" />
              {property.annualYield}%
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Funding Progress</span>
              <span className="font-bold text-gray-900">{fundingProgress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-700 shadow-lg"
                style={{ width: `${fundingProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-gray-500 text-sm mt-2">
              <span>
                {property.tokenAddress && property.decimals !== undefined
                  ? `${(property.availableTokens ?? 0).toLocaleString()} of ${(property.totalTokens ?? 0).toLocaleString()} tokens available`
                  : `${(property.availableTokens ?? 0).toLocaleString()} of ${(property.totalTokens ?? 0).toLocaleString()} tokens available`}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <Link
            to={property.tokenAddress ? `/onchain-properties/${property.id}` : `/properties/${property.id}`}
            className="group/btn w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-center block font-semibold text-lg shadow-xl hover:shadow-indigo-500/25 transform hover:scale-105"
          >
            <span className="flex items-center justify-center">
              View Details
              <TrendingUp className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;