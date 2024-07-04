import * as React from 'react';
import { useAccount } from 'wagmi';

const WalletStatus: React.FC = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  console.log('Connected User Address', address);

  if (isConnecting) return <div>Connecting...</div>;
  if (isDisconnected) return <div>Disconnected</div>;

  return <div>Connected Wallet: {address}</div>;
};

export default WalletStatus;
