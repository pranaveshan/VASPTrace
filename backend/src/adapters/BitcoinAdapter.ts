import { BlockchainAdapter, AddressValidationResult } from './BlockchainAdapter.js';
import { Network } from '../types/index.js';

export class BitcoinAdapter implements BlockchainAdapter {
  network: Network = 'BTC';

  validateAddress(address: string): AddressValidationResult {
    if (!address || typeof address !== 'string') {
      return {
        isValid: false,
        network: 'BTC',
        formattedAddress: '',
        error: 'Address string is empty or invalid.'
      };
    }

    const trimmed = address.trim();
    // P2PKH (1...), P2SH (3...), Bech32 Segwit (bc1q...), Taproot (bc1p...)
    const btcRegex = /^(1[a-km-zA-HJ-NP-Z1-9]{25,34}|3[a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-zA-HJ-NP-Z0-9]{39,59})$/;

    if (!btcRegex.test(trimmed)) {
      return {
        isValid: false,
        network: 'BTC',
        formattedAddress: trimmed,
        error: 'Invalid Bitcoin address format. Must be valid P2PKH (1...), P2SH (3...), or Bech32 SegWit/Taproot (bc1...).'
      };
    }

    return {
      isValid: true,
      network: 'BTC',
      formattedAddress: trimmed
    };
  }

  getExplorerTxUrl(txHash: string): string {
    return `https://mempool.space/tx/${txHash}`;
  }

  getExplorerAddressUrl(address: string): string {
    return `https://mempool.space/address/${address}`;
  }
}
