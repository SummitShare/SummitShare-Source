'use client';

import { ConnectKitButton } from 'connectkit';
import { useAccount } from 'wagmi';
import { Button } from '../button/Button';

type WalletNavButtonProps = {
   mobile?: boolean;
};

export default function WalletNavButton({
   mobile = false,
}: WalletNavButtonProps) {
   const { address } = useAccount();

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
