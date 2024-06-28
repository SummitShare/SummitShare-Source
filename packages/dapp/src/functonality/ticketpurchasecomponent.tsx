import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import { TicketPurchaseProps, EthereumWindow } from '@/utils/dev/typeInit';
import { createTicketProps } from '@/utils/dev/frontEndInterfaces';
import { CONTRACT_ADDRESSES, contracts } from '@/utils/dev/contractInit';
import { handleContractError } from '@/utils/dev/handleContractError';
import useExhibit from '@/lib/useGetExhibitById';
import { useSession } from 'next-auth/react';

const TicketPurchaseComponent = ({ userAddress }: TicketPurchaseProps) => {
  const session = useSession();
  const user_id = session.data?.user.id;

  // Hardcoded exhibit ID for demo
  const exhibitId = CONTRACT_ADDRESSES.exhibitId;

  // State hooks for managing component state
  const [status, setStatus] = useState<string>('');
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [purchaseSuccessful, setPurchaseSuccessful] = useState<boolean>(false);
  const [purchaseFailed, setPurchaseFailed] = useState<boolean>(false);
  const exhibit = useExhibit(exhibitId);

  const createTicket = async () => {
    // Ensure HOST is read correctly, considering Next.js environment variables need to be prefixed with NEXT_PUBLIC_ if they are to be used on the client-side.
    const host = process.env.NEXT_PUBLIC_HOST;
    //console.log(`host ${host} `)
    const eventLink = `${host}/exhibit/0xe405b9c97656336ab949401bcd41ca3f50114725`;
    // Construct the URL with the correct protocol (http or https) and ensure that the HOST variable includes the entire domain.
    const url = `${host}api/v1/event/ticket/create`;
    //console.log(`url ${url} ` ,user_id)

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userAddress, exhibitId, user_id, eventLink }),
      });

      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        // You could throw an error or handle it in another way depending on your error handling strategy
        //console.log(`Error: ${response.status} - ${response.statusText}`);
      }

      return response.json(); // Assuming the server responds with JSON.
    } catch (error) {
      console.error('Failed to create ticket:', error);
    }
  };

  // Effect hook to initialize the Web3 provider when the component mounts or exhibitId changes
  useEffect(() => {
    const ethWindow = window as EthereumWindow;
    if (ethWindow.ethereum) {
      const web3Provider = new ethers.providers.Web3Provider(
        ethWindow.ethereum
      );

      web3Provider
        .send('eth_requestAccounts', [])
        .then(() => {
          setProvider(web3Provider);
        })
        .catch((err) => {
          setStatus(`Error connecting to user wallet: ${err.message}`);
        });
    } else {
      setStatus(
        'Please install a Web3 wallet (e.g., MetaMask) to purchase tickets.'
      );
    }
  }, [exhibitId]);

  if (!exhibit) {
    return <div>Loading or no Matching Exhibit Found.</div>;
  }
  const ticketPrice = exhibit.exhibitDetails[0]?.ticketPrice || '';

  // Function to handle ticket purchase
  const purchaseTicket = async () => {
    if (!provider) {
      setStatus('Web3 provider is not initialized.');
      return;
    }

    try {
      // Contract Init with Modular Approach
      const usdcContract = contracts.getMUSDC();
      const museumContract = contracts.getMuseum();

      // Approve USDC transfer for ticket purchase
      setStatus('Approving USDC transfer...');
      const gasLimitApprove = await usdcContract.estimateGas.approve(
        CONTRACT_ADDRESSES.MuseumAdd,
        ticketPrice
      );
      const approveTx = await usdcContract.approve(
        CONTRACT_ADDRESSES.MuseumAdd,
        ticketPrice,
        { gasLimit: gasLimitApprove }
      ); // { gasLimit });
      await approveTx.wait(2);

      // Execute ticket purchase transaction
      setStatus('Purchasing ticket...');
      const gasLimitPurchase = await museumContract.estimateGas.purchaseTicket(
        exhibitId,
        ticketPrice
      );
      const purchaseTx = await museumContract.purchaseTicket(
        exhibitId,
        ticketPrice,
        { gasLimit: gasLimitPurchase }
      ); //{ gasLimit });
      await purchaseTx.wait(4);

      //State update after successful ticket purchase
      setPurchaseSuccessful(true);
      setStatus('Ticket purchased successfully!');
    } catch (error: any) {
      console.error('Smart Contract Interaction Failed:', error);
      const friendlyMessage = handleContractError(error as any); // Typecasting
      setStatus(friendlyMessage);
    }
  };

  // Render component UI
  return (
    <div className="flex flex-col gap-2">
      {purchaseSuccessful ? (
        <div>
          <p>Thank you for your purchase!</p>
          {/*actions post-purchase */}
        </div>
      ) : (
        <button
          className="w-fit flex gap-3 items-center px-6 py-3 rounded-lg bg-orange-500 font-bold dark:bg-950 text-gray-50 dark:text-gray-50"
          onClick={purchaseTicket}
        >
          Purchase
        </button>
      )}
      {/* Display current status */}
      {status && <p className="text-sm font-semibold">{status}</p>}
    </div>
  );
};

export default TicketPurchaseComponent;
