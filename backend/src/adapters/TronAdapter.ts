import { BlockchainAdapter, AddressValidationResult } from './BlockchainAdapter.js';
import { Network } from '../types/index.js';

export class TronAdapter implements BlockchainAdapter {
  network: Network = 'TRON';

  validateAddress(address: string): AddressValidationResult {
    if (!address || typeof address !== 'string') {
      return {
        isValid: false,
        network: 'TRON',
        formattedAddress: '',
        error: 'Address string is empty or invalid.'
      };
    }

    const trimmed = address.trim();
    // Tron addresses start with 'T' and are 34 characters long base58
    const tronRegex = /^T[a-zA-HJ-NP-Z1-9]{33}$/;

    if (!tronRegex.test(trimmed)) {
      return {
        isValid: false,
        network: 'TRON',
        formattedAddress: trimmed,
        error: 'Invalid Tron address format. Must be a 34-character Base58 string starting with T.'
      };
    }

    return {
      isValid: true,
      network: 'TRON',
      formattedAddress: trimmed
    };
  }

  getExplorerTxUrl(txHash: string): string {
    return `https://tronscan.org/#/transaction/${txHash}`;
  }

  getExplorerAddressUrl(address: string): string {
    return `https://tronscan.org/#/address/${address}`;
  }
}
