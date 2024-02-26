import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import { gql, useApolloClient } from '@apollo/client';
import { TicketPurchaseProps, EthereumWindow } from '@/utils/dev/typeInit';
import { CONTRACT_ADDRESSES, contracts } from '@/utils/dev/contractInit';

const TicketPurchaseComponent = ({ userAddress, exhibitId }: TicketPurchaseProps) => {
  // State hooks for managing component state
  const [ticketPrice, setTicketPrice] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const client = useApolloClient();
  const router = useRouter();
  const [purchaseSuccessful, setPurchaseSuccessful] = useState<boolean>(false);
  //const [customGasLimit, setCustomGasLimit] = useState<string>('250000');


 // GraphQL query for fetching all exhibits
 const GET_ALL_EXHIBITS = gql`
 query GetAllExhibits {
     exhibits {
         id
         exhibitDetails {
             ticketPrice
         }
     }
 }
`;

   // Effect hook to initialize the Web3 provider when the component mounts or exhibitId changes
   useEffect(() => {
    //console.log("Exhibit ID:", exhibitId)
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

    // Effect hook for fetching ticket price
    useEffect(() => {
        client.query({ query: GET_ALL_EXHIBITS })
          .then(response => {
            const exhibits = response.data.exhibits;
            const foundExhibit = exhibits.find((exhibit: { id: string; }) => exhibit.id === exhibitId);
    
            if (foundExhibit && foundExhibit.exhibitDetails.length > 0) {
                // First item in exhibitDetails array contains the ticketPrice
                setTicketPrice(foundExhibit.exhibitDetails[0].ticketPrice);
            } else {
                console.error('No matching exhibit found or no ticket details available');
            }
          })
          .catch(error => {
            console.error('Error fetching exhibits:', error);
          });
      }, [exhibitId, client]);
    
      if (!ticketPrice) {
        return <div>Loading or no matching exhibit found...</div>;
      }
      
      // Function to handle ticket purchase
       const purchaseTicket = async () => {
        if (!provider) {
            setStatus('Web3 provider is not initialized.');
            return;
        }

         // Convert customGasLimit to BigNumber
        //const gasLimit = ethers.utils.parseUnits(customGasLimit, 'wei');

        try {

          // Contract Init with Modular Approach
            const signer = provider.getSigner();
            const usdcContract = contracts.getMUSDC(signer)
            const museumContract = contracts.getMuseum(signer)

            
            // Approve USDC transfer for ticket purchase
            setStatus('Approving USDC transfer...');
            const approveTx = await usdcContract.approve(CONTRACT_ADDRESSES.MuseumAdd, ticketPrice,)// { gasLimit });
            await approveTx.wait(2);

            // Execute ticket purchase transaction
            setStatus('Purchasing ticket...');
            const purchaseTx = await museumContract.purchaseTicket(exhibitId, ticketPrice,) //{ gasLimit });
            await purchaseTx.wait(2);

            //State update after successful ticket purchase
             setPurchaseSuccessful(true);
             setStatus('Ticket purchased successfully!');

          
        } catch (error: any) {
            console.error('Error in purchasing ticket:', error);
            setStatus(`Transaction failed: ${error.message}`);
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
            disabled={!ticketPrice}
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