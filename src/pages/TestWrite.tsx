import React from 'react';
import { useWriteContract } from 'wagmi';
import PropertyFactoryABI from '../abi/PropertyFactory.json';

const PROPERTY_FACTORY_ADDRESS = '0xc97C18Bc6b1C54f82e0bACc8aDed56FA897777bc';

export default function TestWrite() {
  const { writeContractAsync } = useWriteContract();

  const handleClick = async () => {
    try {
      const args = [
        'TestProperty',
        'https://test.uri',
        1n,
        'TestShares',
        'TST',
        1000n,
        1n,
        'https://test.uri',
        100,
        1n,
        '0x0000000000000000000000000000000000000001'
      ];
      console.log('Test write args:', args);
      const tx = await writeContractAsync({
        address: PROPERTY_FACTORY_ADDRESS,
        abi: PropertyFactoryABI.abi,
        functionName: 'createFullProperty',
        args
      });
      console.log('Transaction result:', tx);
    } catch (e) {
      console.error('Erreur test write:', e);
    }
  };

  return (
    <div className="p-8">
      <button
        onClick={handleClick}
        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow hover:bg-indigo-700"
      >
        Test Write (Metamask)
      </button>
    </div>
  );
} 