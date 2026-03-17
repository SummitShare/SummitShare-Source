// TicketPurchaseComponent.tsx
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { TicketPurchaseProps } from '@/types/contracts';
import { CONTRACT_ADDRESSES, contracts } from '@/utils/contractInit';
import useExhibit from '@/lib/useGetExhibitById';
import {
   useWeb3Provider,
   useTicketState,
   useCountdown,
} from '@/utils/methods/ticketPurchase/ticketPurchaseHooks';
import { handleTicketPurchase } from '@/utils/methods/ticketPurchase/ticketPurchaseLogic';
import TicketPurchaseUI from '@/utils/methods/ticketPurchase/ticketPurchaseUI';
import { estimateGasFees } from '@/utils/methods/ticketPurchase/gasEstimator';
import { ethers } from 'ethers';
import { validateTicket } from '@/utils/methods/ticketPurchase/ticketService';

const TicketPurchaseComponent = ({
   userAddress,
   user_id,
}: TicketPurchaseProps) => {
   const { data: session } = useSession();
   const { provider, status, setStatus } = useWeb3Provider();
   const {
      hasTicket,
      buttonType,
      buttonText,
      setButtonText,
      setButtonType,
      setHasTicket,
   } = useTicketState(
      userAddress,
      '419a0b2d-dee9-4782-9cff-341c5f8343a6',
      user_id
   );

   const isCountdownOver = useCountdown();

   // UI State
   const [isVisible, setIsVisible] = useState(false);
   const [isPopupVisible, setIsPopupVisible] = useState(false);
   const [estimatedGasFees, setEstimatedGasFees] = useState('0.00');
   const [isEstimating, setIsEstimating] = useState(false);
   const [isProcessing, setIsProcessing] = useState(false);
   const [showSuccessMessage, setShowSuccessMessage] = useState(false);
   const [purchaseSuccessful, setPurchaseSuccessful] = useState(false);
   const [isHovering, setIsHovering] = useState(false);
   const [isValidating, setIsValidating] = useState(true);

   // Fetch exhibit data
   const exhibit = useExhibit(CONTRACT_ADDRESSES.exhibitId);
   useEffect(() => {
      if (purchaseSuccessful) {
         setHasTicket(true);
         setButtonType('secondary');
         setButtonText(isCountdownOver ? 'View Exhibit' : 'Read Insights');
      }
   }, [
      purchaseSuccessful,
      isCountdownOver,
      setHasTicket,
      setButtonType,
      setButtonText,
   ]);

   useEffect(() => {
      if (userAddress && user_id) {
         setIsValidating(true);
         validateTicket(
            userAddress,
            '419a0b2d-dee9-4782-9cff-341c5f8343a6',
            user_id,
            setHasTicket,
            setButtonType,
            setButtonText
         ).finally(() => {
            setIsValidating(false);
         });
      }
   }, [
      userAddress,
      user_id,
      purchaseSuccessful,
      setHasTicket,
      setButtonType,
      setButtonText,
   ]);

   if (!exhibit) return <div>Loading Exhibit</div>;

   // Price calculations
   const ticketPriceWei = BigInt(exhibit.exhibitDetails[0]?.ticketPrice || '0');
   const ticketPriceFormatted = ethers.utils.formatUnits(ticketPriceWei, 6);
   const ticketPriceWithToken = `${ticketPriceFormatted} USDT`;

   // console.log({
   //    rawPrice: exhibit.exhibitDetails[0]?.ticketPrice,
   //    asBigInt: ticketPriceWei,
   //    formatted: ticketPriceFormatted
   //  });

   // Handlers
   const handleEstimateGas = async () => {
      await estimateGasFees(
         provider,
         contracts,
         ticketPriceWei,
         CONTRACT_ADDRESSES.eventId,
         setStatus,
         setEstimatedGasFees,
         setIsEstimating
      );
   };

   const togglePopup = async () => {
      if (!isPopupVisible) await handleEstimateGas();
      setIsPopupVisible(!isPopupVisible);
   };

   const purchaseTicket = () => {
      if (!provider) {
         setStatus('please connect wallet');
         return;
      }
      handleTicketPurchase({
         provider,
         ticketPrice: ticketPriceWei,
         eventId: CONTRACT_ADDRESSES.eventId,
         user_id: session?.user?.id || '',
         address: userAddress || '',
         setStatus,
         setIsProcessing,
         setButtonText,
         setPurchaseSuccessful,
         setShowSuccessMessage,
         setHasTicket,
         setButtonType,
      });
   };

   const getButtonConfig = () => ({
      text: isValidating
         ? 'Loading...'
         : hasTicket
         ? isCountdownOver
            ? 'View Exhibit'
            : 'Read Insights'
         : 'Purchase',
      action: isValidating
         ? () => {}
         : hasTicket
         ? isCountdownOver
            ? () => window.open('https://summitshare.co/exhibit', '_blank')
            : () => (window.location.href = '/distribution')
         : togglePopup,
      type: hasTicket ? ('secondary' as const) : ('primary' as const),
   });

   // Props for UI component
   const uiProps = {
      userAddress,
      setHasTicket,
      buttonType,
      setButtonType,
      buttonText,
      status,
      purchaseSuccessful,
      isCountdownOver,
      showSuccessMessage,
      isVisible,
      isPopupVisible,
      estimatedGasFees,
      isEstimating,
      isProcessing,
      isHovering,
      setIsHovering,
      hasTicket,
      ticketPriceWithToken,
      ticketPriceFormatted,
      togglePopup,
      purchaseTicket,
      isValidating,
      buttonConfig: getButtonConfig(),
      closeSuccessMessage: () => setShowSuccessMessage(false),
      calculateTotalPrice: () => {
         const total =
            parseFloat(ticketPriceFormatted) + parseFloat(estimatedGasFees);
         return total.toFixed(2);
      },
   };

   return <TicketPurchaseUI {...uiProps} />;
};

export default TicketPurchaseComponent;
