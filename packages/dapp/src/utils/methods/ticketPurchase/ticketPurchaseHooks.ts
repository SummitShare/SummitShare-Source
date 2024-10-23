// ticketPurchaseHooks.ts
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { EthereumWindow } from '@/utils/dev/typeInit';
import { calculateTimeLeft } from '@/functonality/countdownTimer';
import { validateTicket } from '@/utils/methods/ticketPurchase/ticketService';

export const useWeb3Provider = () => {
   const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(
      null
   );
   const [status, setStatus] = useState<string>('');

   useEffect(() => {
      const ethWindow = window as EthereumWindow;
      if (ethWindow.ethereum) {
         const web3Provider = new ethers.providers.Web3Provider(
            ethWindow.ethereum
         );
         web3Provider
            .send('eth_requestAccounts', [])
            .then(() => setProvider(web3Provider))
            .catch((err) =>
               setStatus(`Error connecting to wallet: ${err.message}`)
            );
      } else {
         setStatus('Please connect a Web3 wallet to purchase tickets.');
      }
   }, []);

   return { provider, status, setStatus };
};

export const useTicketState = (
   userAddress: string,
   eventId: string,
   user_id: string
) => {
   const [hasTicket, setHasTicket] = useState(false);
   const [buttonType, setButtonType] = useState<
      'primary' | 'secondary' | 'tartary' | 'subTartary'
   >('primary');
   const [buttonText, setButtonText] = useState('Pay');

   useEffect(() => {
      validateTicket(
         userAddress,
         eventId,
         user_id,
         setHasTicket,
         setButtonType,
         setButtonText
      );
   }, [userAddress, eventId, user_id]);

   return {
      hasTicket,
      setHasTicket,
      buttonType,
      setButtonType,
      buttonText,
      setButtonText,
   };
};

export const useCountdown = () => {
   const [isCountdownOver, setIsCountdownOver] = useState(false);

   useEffect(() => {
      const checkCountdown = () => {
         const timeLeft = calculateTimeLeft();
         setIsCountdownOver(!timeLeft);
      };

      checkCountdown();
      const timer = setInterval(checkCountdown, 1000);
      return () => clearInterval(timer);
   }, []);

   return isCountdownOver;
};
