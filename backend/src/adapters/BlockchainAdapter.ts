import { Network } from '../types/index.js';

export interface AddressValidationResult {
  isValid: boolean;
  network: Network;
  formattedAddress: string;
  error?: string;
}

export interface BlockchainAdapter {
  network: Network;
  validateAddress(address: string): AddressValidationResult;
  getExplorerTxUrl(txHash: string): string;
  getExplorerAddressUrl(address: string): string;
}
