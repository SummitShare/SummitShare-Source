'use client';

import { useEffect } from 'react';
import { ConnectKitButton, useModal } from 'connectkit';
import { useAccount } from 'wagmi';
import { useWeb3Activation } from '@/features/Web3Boundary';
import { Button } from '../button/Button';

export default function LiveWalletNavButton({
   mobile = false,
}: {
   mobile?: boolean;
}) {
   const { address, isConnecting, isReconnecting } = useAccount();
   const { setOpen } = useModal();
   const { consumeModalRequest } = useWeb3Activation();

   useEffect(() => {
      if (isConnecting || isReconnecting) return;

      // ConnectKit closes its modal in a mount effect; open after that settles.
      const timer = setTimeout(() => {
         if (consumeModalRequest()) setOpen(true);
      }, 0);

      return () => clearTimeout(timer);
   }, [consumeModalRequest, isConnecting, isReconnecting, setOpen]);

   return (
      <ConnectKitButton.Custom>
         {({ show }) => (
            <Button
               onClick={show}
               size={mobile ? 'medium' : undefined}
               className={mobile ? 'w-full' : 'whitespace-nowrap'}
            >
               {!address ? (mobile ? 'Connect Wallet' : 'Connect') : 'Connected'}
            </Button>
         )}
      </ConnectKitButton.Custom>
   );
}
