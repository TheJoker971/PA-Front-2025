import React from 'react';
import { mockProperties } from '../data/mockData';
import PropertyCard from '../components/PropertyCard';

const Properties: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Investment Properties</h1>
        <p className="text-lg text-gray-600">
          Découvrez des opportunités immobilières tokenisées du monde entier
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
};

export default Properties;