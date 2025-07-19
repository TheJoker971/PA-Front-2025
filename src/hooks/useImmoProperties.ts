import { useContractRead } from 'wagmi';
import ImmoPropertyABI from '../abi/ImmoProperty.json';

const IMMO_PROPERTY_ADDRESS = '0x4E167dc630f7fDecB87776eD6f5F0024602Ae37E';

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