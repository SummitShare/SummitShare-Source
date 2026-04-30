// ticketPurchaseLogic.ts
import { contracts, estimateGas, CONTRACT_ADDRESSES } from '@/utils/contractInit';
import { PurchaseHandlerProps } from '@/types/frontend';
import { handleContractError } from '@/utils/handleContractError';
import { validateTicket } from './ticketService';

export const handleTicketPurchase = async ({
   provider,
   ticketPrice,
   eventId,
   user_id,
   address,
   setStatus,
   setIsProcessing,
   setButtonText,
   setPurchaseSuccessful,
   setShowSuccessMessage,
   setHasTicket,
   setButtonType,
}: PurchaseHandlerProps) => {
   if (!provider) {
      setStatus('Web3 provider is not initialized.');
      return;
   }

   try {
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      const usdtContract = contracts.getUSDTU();
      const museumContract = contracts.getMuseum();

      setStatus('Approving token transfer...');
      setIsProcessing(true);
      setButtonText('processing...');

      const balance = await usdtContract.balanceOf(userAddress);
      console.log({
         userAddress,
         balance: balance.toString(),
         requiredAmount: ticketPrice,
         network: (await provider.getNetwork()).name,
      });

      // Add balance check before approve
      if (balance < BigInt(ticketPrice)) {
         setStatus('Insufficient USDT balance');
         setButtonText('Insufficient USDT balance');
         setIsProcessing(false);
         return;
      }

      // Token approval
      const gasLimitApprove = await estimateGas(usdtContract, 'approve', [
         CONTRACT_ADDRESSES.MuseumAdd,
         ticketPrice,
      ]);
      const approveTx = await usdtContract.approve(
         CONTRACT_ADDRESSES.MuseumAdd,
         ticketPrice,
         {
            gasLimit: gasLimitApprove,
         }
      );
      await approveTx.wait(1);

      // Purchase ticket
      setStatus('Purchasing ticket...');
      const gasLimitPurchase = await estimateGas(
         museumContract,
         'purchaseTicket',
         [eventId, ticketPrice]
      );

      const purchaseTx = await museumContract.purchaseTicket(
         eventId,
         ticketPrice,
         {
            gasLimit: gasLimitPurchase,
         }
      );
      const receipt = await purchaseTx.wait(2);

      // Handle success
      await createTicketRecord(receipt, user_id);
      setPurchaseSuccessful(true);
      setShowSuccessMessage(true);
      setStatus('Ticket purchased successfully!');
      setIsProcessing(false);

      // Update ticket state
      setHasTicket(true);
      setButtonType('secondary');
      setButtonText('Ticket Purchased ✓');

      try {
         await validateTicket(
            address,
            eventId,
            user_id,
            setHasTicket,
            setButtonType,
            setButtonText
         );
      } catch (error) {
         console.error('Validation error:', error);
         // Don't change success state even if validation fails
      }
   } catch (error: any) {
      console.error('Smart Contract Interaction Failed:', error);
      const errorInfo = handleContractError(error);

      // Set status to combined message and action
      setStatus(`${errorInfo.message} ${errorInfo.action || ''}`);

      // Set button text based on error type
      setButtonText(
         errorInfo.isUserActionable ? 'Purchase Ticket' : 'Contact Support'
      );
      setIsProcessing(false);
   }
};

const createTicketRecord = async (receipt: any, userId: string) => {
   const HOST = process.env.NEXT_PUBLIC_HOST;
   const userTicketData = {
      wallet_address: receipt.from,
      event_id: '419a0b2d-dee9-4782-9cff-341c5f8343a6',
      user_id: userId,
      eventLink: `${HOST}/exhibit`,
      transaction_id: receipt.transactionHash,
   };

   try {
      const response = await fetch('/api/v1/events/tickets/create', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(userTicketData),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
         console.error(
            'Failed to create ticket record:',
            data?.message || response.statusText
         );
      }
   } catch (error) {
      console.error('Failed to create ticket record:', error);
   }
};
