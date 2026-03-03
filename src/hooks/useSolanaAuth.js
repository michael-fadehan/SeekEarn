import { useState, useCallback } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol';
import {
  authorize,
  signMessages,
} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { PublicKey } from '@solana/web3.js';

const getAddressAbbreviation = (address) => {
  if (!address) return undefined;
  const base58 = address.toBase58();
  return base58.slice(0, 4) + '..' + base58.slice(-4);
};

export default function useSolanaAuth() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      await transact(async (wallet) => {
        // 1. Authorize the connection
        const authResult = await authorize(wallet, {
          cluster: 'devnet', // Using devnet for now
        });

        // 2. Create a sign-in message
        // This is a best practice to prevent replay attacks.
        const message = `Sign in to SeekEarn. Timestamp: ${Date.now()}`;
        const messageBuffer = new TextEncoder().encode(message);

        // 3. Request a signature for the message to prove ownership
        await signMessages(wallet, {
          addresses: [authResult.address],
          payloads: [messageBuffer],
        });

        // At this point, you would typically send the signature and message
        // to your backend to verify it. For now, we'll proceed on the client.

        const connectedAddress = new PublicKey(authResult.address);
        setAuthToken(authResult.auth_token);
        setWalletAddress(connectedAddress);
      });
    } catch (err) {
      // This error will be thrown if the user cancels or if the wallet app is not installed.
      Alert.alert('Connection failed', 'Please ensure a compatible Solana wallet is installed.', [
          { text: 'OK' },
          { text: 'Get Phantom', onPress: () => Linking.openURL('https://phantom.app/') }
      ]);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setWalletAddress(null);
    setAuthToken(null);
  }, []);

  return {
    connect,
    disconnect,
    walletAddress,
    isConnecting,
    abbreviatedAddress: getAddressAbbreviation(walletAddress),
  };
}