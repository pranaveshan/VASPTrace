import { BlockchainAdapter, AddressValidationResult } from './BlockchainAdapter.js';
import { Network } from '../types/index.js';

export class EVMAdapter implements BlockchainAdapter {
  network: Network;
  private explorerBaseUrl: string;

  constructor(network: Network = 'ETH') {
    this.network = network;
    switch (network) {
      case 'POLYGON':
        this.explorerBaseUrl = 'https://polygonscan.com';
        break;
      case 'BSC':
        this.explorerBaseUrl = 'https://bscscan.com';
        break;
      case 'ARBITRUM':
        this.explorerBaseUrl = 'https://arbiscan.io';
        break;
      case 'ETH':
      default:
        this.explorerBaseUrl = 'https://etherscan.io';
        break;
    }
  }

  validateAddress(address: string): AddressValidationResult {
    if (!address || typeof address !== 'string') {
      return {
        isValid: false,
        network: this.network,
        formattedAddress: '',
        error: 'Address string is empty or invalid.'
      };
    }

    const trimmed = address.trim();
    const evmRegex = /^0x[a-fA-F0-9]{40}$/;

    if (!evmRegex.test(trimmed)) {
      return {
        isValid: false,
        network: this.network,
        formattedAddress: trimmed,
        error: `Invalid ${this.network} address format. Must be a 42-character hexadecimal string starting with 0x.`
      };
    }

    return {
      isValid: true,
      network: this.network,
      formattedAddress: trimmed
    };
  }

  getExplorerTxUrl(txHash: string): string {
    return `${this.explorerBaseUrl}/tx/${txHash}`;
  }

  getExplorerAddressUrl(address: string): string {
    return `${this.explorerBaseUrl}/address/${address}`;
  }
}
