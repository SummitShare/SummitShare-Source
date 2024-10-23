// ticketPurchaseLogic.ts
import {
  contracts,
  estimateGas,
  CONTRACT_ADDRESSES,
} from '@/utils/dev/contractInit';
import { PurchaseHandlerProps } from '@/utils/dev/frontEndInterfaces';
import { handleContractError } from '@/utils/dev/handleContractError';
import axios from 'axios';

export const handleTicketPurchase = async ({
  provider,
  ticketPrice,
  eventId,
  user_id,
  setStatus,
  setIsProcessing,
  setButtonText,
  setPurchaseSuccessful,
  setShowSuccessMessage,
}: PurchaseHandlerProps) => {
  if (!provider) {
    setStatus('Web3 provider is not initialized.');
    return;
  }

  try {
    const usdcContract = contracts.getMUSDC();
    const museumContract = contracts.getMuseum();

    setStatus('Approving token transfer...');
    setIsProcessing(true);
    setButtonText('processing...');

    // Token approval
    const gasLimitApprove = await estimateGas(usdcContract, 'approve', [
      CONTRACT_ADDRESSES.MuseumAdd,
      ticketPrice,
    ]);
    const approveTx = await usdcContract.approve(
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
    setButtonText('Pay');
  } catch (error: any) {
    console.error('Smart Contract Interaction Failed:', error);
    const friendlyMessage = handleContractError(error);
    setStatus(friendlyMessage);
    setButtonText('Pay');
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
    const response = await axios.post(
      'api/v1/events/tickets/create',
      userTicketData
    );
    if (response.status !== 200) {
      console.error('Failed to create ticket record:', response.data.message);
    }
  } catch (error) {
    console.error('Failed to create ticket record:', error);
  }
};
