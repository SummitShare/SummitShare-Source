import { ethers } from "ethers";
import {gql, useApolloClient } from "@apollo/client";
import EventEscrowABI from '../../../../../utils/artifacts/contracts/EventEscrow.sol/EventEscrow.json';
import React, {useEffect, useState} from "react";

const EscrowABI = EventEscrowABI as unknown as ethers.ContractInterface; //Match Fix

interface EventEscrowComponentProps {
    provider: ethers.providers.Web3Provider; 
    exhibitId: string;
}

const EventEscrowComponent = ({ provider, exhibitId }: EventEscrowComponentProps) => {
    const [status, setStatus] = useState('');
    const [escrowAddress, setEscrowAddress] = useState('');
    const client = useApolloClient();


    const GET_ESCROW_ADDRESS = gql`
    query GetEventEscrowAddress($exhibitId: String!) {
        exhibit(id: $exhibitId) {
            escrow {
                id
            }
        }
    }
    `;

    // Function to distribute funds
    const distributeFunds = async () => {
        if (!escrowAddress) {
            setStatus('No EventEscrow address found for the exhibit');
            return;
        }

        try {
            const signer = provider.getSigner();
            const escrowContract = new ethers.Contract(escrowAddress, EscrowABI, signer);
            setStatus('Initiating fund distribution...');

            const tx = await escrowContract.distributePayments();
            await tx.wait(6);
            setStatus('Funds distributed successfully.');

        } catch (error) {
            if (error instanceof Error) {
            console.error('Error in distributing funds:', error);
            setStatus(`Error: ${error.message}`);

        } else {
            //Error handling for non-instance of Error events
            console.error('Unexpected error occured:', error);
            setStatus('Unexpected error occured');
        }
        }
    };

    // Fetch the escrow address when the component mounts or exhibitId changes
    useEffect(() => {
        if (exhibitId) {
            client.query({query: GET_ESCROW_ADDRESS, variables: { exhibitId }})
            .then(response => {
                setEscrowAddress(response.data.exhibit.escrow.id);
            })
            .catch(error =>{
                console.error('Error in fetching exhibit escrow address:', error);
                setStatus(`Error fetching address: ${error.message}`);
            });
        }
    }, [exhibitId, client]);
    
    return (
        <div>
            <button onClick={distributeFunds}>Distribute Funds</button>
            <p>Status: {status}</p>
            {/* Mario's magic goes here */}
        </div>
    );
};

export default EventEscrowComponent;