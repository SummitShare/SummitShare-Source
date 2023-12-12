import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { gql, useApolloClient } from '@apollo/client';
import usdcABI from '../utils/artifacts/contracts/MUSDC.sol/MUSDC.json'; // Import USDC token ABI
import museumABIJson from '../utils/artifacts/contracts/Museum.sol/Museum.json';


const musdcABI = usdcABI as unknown as ethers.ContractInterface; //Match Fix
const museumABI = museumABIJson as unknown as ethers.ContractInterface; //Match Fix


interface ticketPurchaseProps {
    provider: ethers.providers.Web3Provider; 
    exhibitId: string;
    userAddress: string;
};

const TicketPurchaseComponent = ({ userAddress, exhibitId, provider }: ticketPurchaseProps) => {
    const [ticketPrice, setTicketPrice] = useState('');
    const [status, setStatus] = useState('');
    const client = useApolloClient();
    const usdcAddress = 'usdc_contract_address'; // USDC token contract address
    const museumAddress = 'museum_contract_address'; // Museum contract address

    // GraphQL query to fetch ticket price
    const GET_TICKET_PRICE = gql`
        query GetTicketPrice($exhibitId: ID!) {
            exhibit(id: $exhibitId) {
                ticketPrice
            }
        }
    `;

    useEffect(() => {
        if (exhibitId) {
            client.query({ query: GET_TICKET_PRICE, variables: { exhibitId } })
                .then(response => setTicketPrice(response.data.exhibit.ticketPrice))
                .catch(error => {
                    console.error('Error fetching ticket price:', error);
                    setStatus(`Error fetching ticket price: ${error.message}`);
                });
        };
    }, [exhibitId, client, status]);

    const purchaseTicket = async () => {
        try {
            const signer = provider.getSigner();
            const usdcContract = new ethers.Contract(usdcAddress, musdcABI, signer);
            const museumContract = new ethers.Contract(museumAddress, museumABI, signer);

            // Step 1: Approve USDC transfer
            setStatus('Approving USDC transfer...');
            const approveTx = await usdcContract.approve(museumAddress, ticketPrice);
            await approveTx.wait();

            // Step 2: Purchase ticket
            setStatus('Purchasing ticket...');
            const purchaseTx = await museumContract.purchaseTicket(exhibitId, ticketPrice);
            await purchaseTx.wait(6);

            setStatus('Ticket purchased successfully!');
        } catch (error) {
            if (error instanceof Error) {
            console.error('Error in purchasing ticket:', error);
            setStatus(`Transaction failed: ${error.message}`);
        }
    };

    return (
        <div>
            <button onClick={purchaseTicket} disabled={!ticketPrice}>Purchase Ticket</button>
            <p>Status: {status}</p>
        </div>
    );
};
};
export default TicketPurchaseComponent;
