import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import { TicketPurchaseProps, EthereumWindow } from '@/utils/dev/typeInit';
import { CONTRACT_ADDRESSES, contracts } from '@/utils/dev/contractInit';
import { handleContractError } from '@/utils/dev/handleContractError';
import useExhibit from '@/lib/useGetExhibitById';

const TicketPurchaseComponent = ({ userAddress }: TicketPurchaseProps) => {

  // Hardcoded exhibit ID
  const exhibitId = '0xf4857efc226bb39c6851aa137347cff8f8e050f9';

  // State hooks for managing component state
  const [status, setStatus] = useState<string>('');
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [purchaseSuccessful, setPurchaseSuccessful] = useState<boolean>(false);
  const [ticketURI, setTicketURI] = useState<string>('');
  const exhibit = useExhibit(exhibitId);
  // const router = useRouter();

   // Effect hook to initialize the Web3 provider when the component mounts or exhibitId changes
   useEffect(() => {
    const ethWindow = window as EthereumWindow;
    if (ethWindow.ethereum) {
        const web3Provider = new ethers.providers.Web3Provider(ethWindow.ethereum);

        web3Provider.send('eth_requestAccounts', []).then(() => {
            setProvider(web3Provider);
        }).catch((err) => {
            setStatus(`Error connecting to user wallet: ${err.message}`);
        });
    } else {
        setStatus('Please install a Web3 wallet (e.g., MetaMask) to purchase tickets.');
    }

}, [exhibitId]);

  if (!exhibit) {
    return <div>Loading or no Matching Exhibit Found.</div>
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
            const signer = provider.getSigner();
            const usdcContract = contracts.getMUSDC(signer)
            const museumContract = contracts.getMuseum(signer)

            // Approve USDC transfer for ticket purchase
            setStatus('Approving USDC transfer...');
            const approveTx = await usdcContract.approve(CONTRACT_ADDRESSES.MuseumAdd, ticketPrice,)// { gasLimit });
            await approveTx.wait(6);

            // Execute ticket purchase transaction
            setStatus('Purchasing ticket...');
            const purchaseTx = await museumContract.purchaseTicket(exhibitId, ticketPrice,) //{ gasLimit });
            await purchaseTx.wait(4);

            const tokenId = await museumContract.tokenOfOwnerByIndex(userAddress, 0); // Fetch the latest token
            const uri = await museumContract.tokenURI(tokenId);
            setTicketURI(uri);

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
      <div>
        {purchaseSuccessful ? (
          <div>
            <p>Thank you for your purchase!</p>
            {/*actions post-purchase */}
          </div>
        ) : (
          <button 
            className='px-[23px] py-[13px] bg-blue-950 font-opensans font-semibold w-fit rounded-xl h-fit text-white cursor-pointer'
            onClick={purchaseTicket}
          
          >
            Purchase
          </button>
        )}
        {/* Display current status */}
        {status && <p>{status}</p>}
      </div>
    );
};

export default TicketPurchaseComponent;