import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import { gql, useApolloClient } from '@apollo/client';

//ABI Imports
import usdcABI from '../utils/artifacts/contracts/MUSDC.sol/MUSDC.json';
import museumABIJson from '../utils/artifacts/contracts/Museum.sol/Museum.json';


// Convert ABI JSON to ContractInterface for ethers
const musdcABI = usdcABI as unknown as ethers.ContractInterface;
const museumABI = museumABIJson as unknown as ethers.ContractInterface;

// Extend the Window interface for Ethereum providers
interface EthereumWindow extends Window {
  ethereum?: ethers.providers.ExternalProvider;
  web3?: any;
}

// Props interface for TicketPurchaseComponent
interface TicketPurchaseProps {
  userAddress: string;
  exhibitId: string;
};

const TicketPurchaseComponent = ({ userAddress, exhibitId }: TicketPurchaseProps) => {
  // State hooks for managing component state
  const [ticketPrice, setTicketPrice] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const client = useApolloClient();
  const router = useRouter();
  const [purchaseSuccessful, setPurchaseSuccessful] = useState<boolean>(false);

  // Contract addresses
   const usdcAddress = '0xDd4c60185608108D073C19432eef0ae50AB3830d';
   const museumAddress = '0xF4857Efc226Bb39C6851Aa137347CFf8F8e050F9';

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
    // Effect hook for initializing Web3 provider
    useEffect(() => {
    console.log("Exhibit ID From URL:", exhibitId);
    const ethWindow = window as EthereumWindow;
  if (ethWindow.ethereum || ethWindow.web3) {
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    web3Provider.send('eth_requestAccounts', []);
    setProvider(web3Provider);
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
                // Assuming the first item in exhibitDetails array contains the ticketPrice
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

        try {
            const signer = provider.getSigner();
            const usdcContract = new ethers.Contract(usdcAddress, musdcABI, signer);
            const museumContract = new ethers.Contract(museumAddress, museumABI, signer);

            console.log("USDC ABI:", musdcABI);
            console.log("Museum ABI:", museumABI);
            
            // Approve USDC transfer for ticket purchase
            setStatus('Approving USDC transfer...');
            const approveTx = await usdcContract.approve(museumAddress, ticketPrice);
            await approveTx.wait();

            // Execute ticket purchase transaction
            setStatus('Purchasing ticket...');
            const purchaseTx = await museumContract.purchaseTicket(exhibitId, ticketPrice);
            await purchaseTx.wait();

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
