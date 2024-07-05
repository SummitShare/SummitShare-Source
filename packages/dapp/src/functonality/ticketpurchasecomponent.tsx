import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import { TicketPurchaseProps, EthereumWindow } from '@/utils/dev/typeInit';
import { createTicketProps } from '@/utils/dev/frontEndInterfaces';
import { CONTRACT_ADDRESSES, contracts } from '@/utils/dev/contractInit';
import { handleContractError } from '@/utils/dev/handleContractError';
import useExhibit from '@/lib/useGetExhibitById';
import { useSession } from 'next-auth/react';
import Buttons from '@/app/components/button/Butons';
import { useAccount } from 'wagmi';
import { XMarkIcon } from '@heroicons/react/24/outline';

const TicketPurchaseComponent = ({ userAddress }: TicketPurchaseProps) => {
  const session = useSession();
  const [isVisible, setIsVisible] = useState(false);
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

  useEffect(() => {
    if (status) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 4000); // 2 seconds

      return () => clearTimeout(timer);
    }
  }, [status]);

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

  const url = 'localhost:3000/api/v1/events/tickets/create';

  // useEffect(() => {
  //   const sendData = async () => {
  //     try {
  //       const response = await fetch(url, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify(wallet_address,event_id,user_id,eventLink)
  //       });

  //       if (!response.ok) {
  //         throw new Error(`Error: ${response.status} - ${response.statusText}`);
  //       }

  //       const responseData = await response.json();
  //       console.log('Success:', responseData);
  //     } catch (error) {
  //       console.error('Failed to send data:', error);
  //     }
  //   };

  //   sendData();
  // }, [purchaseSuccessful]);

  // Render component UI
  return (
    <>
      <Buttons type="primary" size="large" onClick={purchaseTicket}>
        {purchaseSuccessful ? 'Subscribed' : 'Subscribe'}
      </Buttons>

      {/* Display current status */}
      <div
        className={`bg-green-500 border w-[90%] md:w-fit rounded-md p-3 fixed right-5 z-10 transition-transform duration-500 border-green-300 ${
          isVisible ? 'translate-y-0 bottom-5' : 'translate-y-full -bottom-20'
        }`}
      >
        {status && <p className="text-sm text-white font-semibold">{status}</p>}
      </div>
    </>
  );
};

export default TicketPurchaseComponent;
