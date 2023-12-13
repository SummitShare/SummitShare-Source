import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import { gql, useApolloClient } from '@apollo/client';
import usdcABI from '../utils/artifacts/contracts/MUSDC.sol/MUSDC.json';
import museumABIJson from '../utils/artifacts/contracts/Museum.sol/Museum.json';
import Link from 'next/link';

const musdcABI = usdcABI as unknown as ethers.ContractInterface;
const museumABI = museumABIJson as unknown as ethers.ContractInterface;


interface TicketPurchaseProps {
    userAddress: string;
    exhibitId:string;
};


const TicketPurchaseComponent = ({ userAddress,exhibitId}: TicketPurchaseProps) => {

    const [ticketPrice, setTicketPrice] = useState('');
    const pathname = usePathname();
    const [status, setStatus] = useState('');
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
    const client = useApolloClient();
    const router = useRouter();

  
    // const exhibitId = router.query.id as string;
    const usdcAddress = '0xDd4c60185608108D073C19432eef0ae50AB3830d';
    const museumAddress = '0xF4857Efc226Bb39C6851Aa137347CFf8F8e050F9';

    const GET_TICKET_PRICE = gql`
    query GetTicketPrice($exhibitId: ID!) {
        exhibit(id: $exhibitId) {
            ticketPrice
        }
    }
`;

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

        useEffect(() => {
            console.log("Exhibit ID From URL:", exhibitId);
        // Web3 provider initialization

      //@ts-expect-error
        if (typeof window.ethereum !== 'undefined' || typeof window.web3 !== 'undefined') {
              //@ts-expect-error
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum || window.web3.currentProvider);
            web3Provider.send('eth_requestAccounts', []);
            setProvider(web3Provider);
        } else {
            setStatus('Please install a Web3 wallet (e.g., MetaMask) to purchase tickets.');
        }
    }, [exhibitId]);

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

  //   useEffect(() => {
  //     if (exhibitId) {
  //         client.query({ query: GET_ALL_EXHIBITS, variables: { exhibitId } })
  //             .then(response => {
  //                 if (response.data && response.data.exhibit) {
  //                     setTicketPrice(response.data.exhibit.ticketPrice);
  //                 } else {
  //                     console.error('Ticket price not found for the exhibit');
  //                     setStatus('Ticket price not found');
  //                 }
  //             })
  //             .catch(error => {
  //                 console.error('Error fetching ticket price:', error);
  //                 setStatus(`Error fetching ticket price: ${error.message}`);
  //             });
  //     }
  // }, [exhibitId, client]);
  

    // useEffect(() => {
    //     // Apollo client query for ticket price
    //     if (exhibitId) {
    //         client.query({ query: GET_TICKET_PRICE, variables: { exhibitId } })
    //             .then(response => setTicketPrice(response.data.exhibit.ticketPrice))
    //             .catch(error => {
    //                 console.error('Error fetching ticket price:', error);
    //                 setStatus(`Error fetching ticket price: ${error.message} `);
    //             });
    //     }
    // }, [exhibitId, client]);

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

            setStatus('Approving USDC transfer...');
            const approveTx = await usdcContract.approve(museumAddress, ticketPrice);
            await approveTx.wait();

            setStatus('Purchasing ticket...');
            const purchaseTx = await museumContract.purchaseTicket(exhibitId, ticketPrice);
            await purchaseTx.wait();

            setStatus('Ticket purchased successfully!');

        } catch (error: any) {
            console.error('Error in purchasing ticket:', error);
            setStatus(`Transaction failed: ${error.message}`);
        }
    };

    return (
        <div>

            
            <button className='px-[23px] py-[13px] bg-blue-950 font-opensans font-semibold w-fit rounded-xl h-fit text-white cursor-pointer' onClick={purchaseTicket} disabled={!ticketPrice}>Purchase</button>

            

          
          
        </div>
    );
};

export default TicketPurchaseComponent;
