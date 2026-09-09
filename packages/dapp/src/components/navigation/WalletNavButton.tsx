'use client';

import dynamic from 'next/dynamic';
import { useWeb3Activation } from '@/features/Web3Boundary';
import { Button } from '../button/Button';

type WalletNavButtonProps = {
   mobile?: boolean;
};

function WalletNavStub({ mobile = false }: WalletNavButtonProps) {
   const { activate } = useWeb3Activation();

   return (
      <Button
         onClick={() => activate(true)}
         size={mobile ? 'medium' : undefined}
         className={mobile ? 'w-full' : 'whitespace-nowrap'}
      >
         {mobile ? 'Connect Wallet' : 'Connect'}
      </Button>
   );
}

const LiveDesktopButton = dynamic(() => import('./LiveWalletNavButton'), {
   ssr: false,
   loading: () => <WalletNavStub />,
});
const LiveMobileButton = dynamic(() => import('./LiveWalletNavButton'), {
   ssr: false,
   loading: () => <WalletNavStub mobile />,
});

export default function WalletNavButton({
   mobile = false,
}: WalletNavButtonProps) {
   const { active } = useWeb3Activation();

   if (!active) return <WalletNavStub mobile={mobile} />;

   return mobile ? <LiveMobileButton mobile /> : <LiveDesktopButton />;
}
