import React, { useEffect, useState } from 'react';
import { usePropertiesCount, useProperty } from '../hooks/useImmoProperties';
import PropertyCard from '../components/PropertyCard';
import { Property } from '../types';
import PropertySharesABI from '../abi/PropertyShares.json';
import { useContractRead } from 'wagmi';

const OnChainProperties: React.FC = () => {
  const { data: count, isLoading: isCountLoading } = usePropertiesCount();

  console.log('OnChainProperties - count:', count, 'isLoading:', isCountLoading);

  if (isCountLoading) return <div>Chargement du nombre de propriétés...</div>;
  if (!count || Number(count) === 0) return <div>Aucune propriété on-chain.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Propriétés On-Chain</h1>
        <p className="text-lg text-gray-600">
          Affichage identique aux propriétés mock, mais données 100% blockchain
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: Number(count) }).map((_, i) => (
          <OnChainPropertyCard key={i + 1} propertyId={i + 1} />
        ))}
      </div>
    </div>
  );
};

const OnChainPropertyCard: React.FC<{ propertyId: number }> = ({ propertyId }) => {
  const { data, isLoading } = useProperty(propertyId);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(false);

  // Ajout : lecture du unitPrice et annualYield du PropertyShares
  const shareToken = (data as any)?.shareToken;
  const { data: unitPrice } = useContractRead({
    address: shareToken,
    abi: PropertySharesABI.abi,
    functionName: 'getUnitPrice',
    // enabled: !!shareToken, // retiré car non supporté
  });
  const { data: annualYield } = useContractRead({
    address: shareToken,
    abi: PropertySharesABI.abi,
    functionName: 'getAnnualYield',
    // enabled: !!shareToken, // retiré car non supporté
  });

  useEffect(() => {
    console.log('OnChainPropertyCard - propertyId:', propertyId, 'data:', data, 'isLoading:', isLoading);
    if (!data) return;
    const tuple = data as any;
    setLoading(true);
    fetch(tuple.uri)
      .then(async res => {
        console.log('Fetch URI:', tuple.uri, 'Status:', res.status);
        const text = await res.text();
        console.log('Fetch body:', text);
        let meta: Record<string, any> = {};
        try { meta = JSON.parse(text); } catch (e) { console.error('JSON parse error', e); }
        setProperty({
          id: propertyId.toString(),
          name: tuple.name || tuple.propertyName || '',
          image: (meta && (meta['mainImage'] || meta['image'])) ? (meta['mainImage'] || meta['image']) : tuple.propertyURI || tuple.uri || '',
          imageUrl: (meta && (meta['mainImage'] || meta['image'])) ? (meta['mainImage'] || meta['image']) : tuple.propertyURI || tuple.uri || '',
          location: (meta && meta['location']) ? meta['location'] : '',
          propertyType: (meta && meta['propertyType']) ? meta['propertyType'] : '',
          status: 'active',
          description: (meta && meta['description']) ? meta['description'] : '',
          totalValue: tuple.propertyPrice ? Number(tuple.propertyPrice) / 1e18 : (tuple.price ? Number(tuple.price) / 1e18 : 0),
          tokenPrice: unitPrice ? Number(unitPrice) / 1e18 : 0,
          annualYield: annualYield ? Number(annualYield) / 100 : 0,
          availableTokens: tuple.totalShares ? Number(tuple.totalShares) : 0,
          totalTokens: tuple.totalShares ? Number(tuple.totalShares) : 0,
          tokenAddress: tuple.shareToken || tuple.erc20Address || '',
          price: tuple.price ? Number(tuple.price) / 1e18 : 0,
        });
        console.log('Property construite:', {
          id: propertyId.toString(),
          name: tuple.name,
          image: (meta && (meta['mainImage'] || meta['image'])) ? (meta['mainImage'] || meta['image']) : tuple.uri,
          location: (meta && meta['location']) ? meta['location'] : 'On-chain',
          propertyType: (meta && meta['propertyType']) ? meta['propertyType'] : 'onchain',
          status: 'active',
          price: Number(tuple.price) / 1e18,
          tokenAddress: tuple.shareToken,
          tokenPrice: unitPrice ? Number(unitPrice) / 1e18 : 0,
          annualYield: annualYield ? Number(annualYield) / 100 : 0,
          imageUrl: meta && (meta['mainImage'] || meta['image']),
          documents: meta && meta['documents'],
        });
      })
      .catch((err) => {
        console.error('Fetch error', err);
        setProperty({
          id: propertyId.toString(),
          name: tuple.name,
          image: tuple.uri,
          location: 'On-chain',
          propertyType: 'onchain',
          status: 'active',
          price: Number(tuple.price) / 1e18,
          tokenAddress: tuple.shareToken,
        });
      })
      .finally(() => setLoading(false));
  }, [data, propertyId, unitPrice, annualYield]);

  useEffect(() => {
    console.log('OnChainPropertyCard - property:', property, 'loading:', loading, 'isLoading:', isLoading);
  }, [property, loading, isLoading]);

  if (isLoading || loading || !property) return <div>Chargement propriété on-chain...</div>;
  return <PropertyCard property={property} />;
};

export default OnChainProperties; 