import { useContractRead } from 'wagmi';
import ImmoPropertyABI from '../abi/ImmoProperty.json';

const IMMO_PROPERTY_ADDRESS = import.meta.env.VITE_IMMO_PROPERTY_ADDRESS;

export function usePropertiesCount() {
  return useContractRead({
    address: IMMO_PROPERTY_ADDRESS,
    abi: ImmoPropertyABI.abi,
    functionName: 'getPropertiesCount',
  });
}

export function useProperty(propertyId: number) {
  return useContractRead({
    address: IMMO_PROPERTY_ADDRESS,
    abi: ImmoPropertyABI.abi,
    functionName: 'getProperty',
    args: [propertyId],
  });
} 