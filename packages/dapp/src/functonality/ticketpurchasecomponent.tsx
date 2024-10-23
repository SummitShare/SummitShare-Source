// TicketPurchaseComponent.tsx
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { TicketPurchaseProps } from '@/utils/dev/typeInit';
import { CONTRACT_ADDRESSES, contracts } from '@/utils/dev/contractInit';
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
   } = useTicketState(userAddress, CONTRACT_ADDRESSES.eventId, user_id);
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

   // Fetch exhibit data
   const exhibit = useExhibit(CONTRACT_ADDRESSES.exhibitId);
   if (!exhibit) return <div>Loading Exhibit</div>;

   // Price calculations
   const ticketPriceWei = BigInt(exhibit.exhibitDetails[0]?.ticketPrice || '0');
   const ticketPriceFormatted = ethers.utils.formatUnits(ticketPriceWei, 18);
   const ticketPriceWithToken = `${ticketPriceFormatted} USDT`;

   // Handlers
   const handleEstimateGas = async () => {
      await estimateGasFees(
         provider,
         contracts,
         ticketPriceWei.toString(),
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
         ticketPrice: ticketPriceWei.toString(),
         eventId: CONTRACT_ADDRESSES.eventId,
         user_id: session?.user?.id || '',
         setStatus,
         setIsProcessing,
         setButtonText,
         setPurchaseSuccessful,
         setShowSuccessMessage,
      });
   };

   const getButtonConfig = () => ({
      text: purchaseSuccessful
         ? isCountdownOver
            ? 'View Exhibit'
            : 'Ticket Purchased ✓'
         : 'Purchase',
      action:
         purchaseSuccessful && isCountdownOver
            ? () => window.open('https://summitshare.co/exhibit', '_blank')
            : togglePopup,
      type: purchaseSuccessful ? ('secondary' as const) : ('primary' as const),
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
