import { gql, useApolloClient } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { contracts } from "@/utils/dev/contractInit";
import { EventEscrowComponentProps } from "@/utils/dev/typeInit";


const EventEscrowComponent = ({ provider, exhibitId }: EventEscrowComponentProps) => {
    // State for managing component data and UI
    const [status, setStatus] = useState('');
    const [escrowDetails, setEscrowDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { data: session } = useSession();
    const client = useApolloClient();

    // GraphQL query to fetch escrow details for a given exhibit
    const GET_ESCROW_DETAILS = gql`
        query GetEventEscrowDetails($exhibitId: String!) {
            escrow(id: $exhibitId) {
                id
                shares
                usdcToken
                beneficiaries {
                    id
                    paymentsReceived {
                        amount
                        transactionHash
                    }
                }
            }
        }
    `;

    // Function to distribute funds from the escrow contract
    const distributeFunds = async () => {
        setIsLoading(true);

         // Check if the user is logged in and has the right permissions
         if (!session || !session.user || session.user.role !== 'Beneficiary') {
            setStatus('You do not have permission to distribute funds.');
            setIsLoading(false);
            return;
        }

        // Check if escrow details are available
        if (!escrowDetails || !escrowDetails.id) {
            setStatus('No EventEscrow address found for the exhibit');
            setIsLoading(false);
            return;
        }

          // Attempting to distribute funds
        try {
            const signer = provider.getSigner();
            const escrowContract = contracts.getEventEscrow(escrowDetails.id).connect(signer) // In production the address must be gotten from the appollo wrapped Distribution dashboard pages

            setStatus('Initiating fund distribution...');
            
            const tx = await escrowContract.distributePayments();
            await tx.wait(2);
            setStatus('Funds distributed successfully.');

            // Refresh escrow details post-distribution
            fetchEscrowDetails();

        } catch (error) {
            if (error instanceof Error) {
                console.error('Error in distributing funds:', error);
                setStatus(`Error: ${error.message}`);
            } else {
                console.error('Unexpected error occurred:', error);
                setStatus('Unexpected error occurred');
            }
            setIsLoading(false);
        }
    };

    // Function to fetch escrow details from the subgraph
    const fetchEscrowDetails = () => {
        setIsLoading(true);
        if (exhibitId) {
            client.query({query: GET_ESCROW_DETAILS, variables: { exhibitId }})
                .then(response => {
                    setEscrowDetails(response.data.escrow);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching escrow details:', error);
                    setStatus(`Error fetching escrow details: ${error.message}`);
                    setIsLoading(false);
                });
        }
    };

    // Fetch escrow details when the component mounts or exhibitId changes
    useEffect(fetchEscrowDetails, [exhibitId, client]);

    
    return (
        <div>
        <button onClick={distributeFunds} disabled={isLoading}>Distribute Funds</button>
        <p>Status: {status}</p>
        {escrowDetails && (
            <div>
                {/* Display Escrow Details */}
                <p>Escrow Address: {escrowDetails.id}</p>
                <p>Shares: {JSON.stringify(escrowDetails.shares)}</p>
                {/* Display Beneficiaries and Payments */}
                {escrowDetails.beneficiaries.map((beneficiary: any, index: number) => (
                    <div key={index}>
                        <p>Beneficiary Address: {beneficiary.id}</p>
                        {beneficiary.paymentsReceived.map((payment: any, idx: number) => (
                            <div key={idx}>
                                <p>Amount: {payment.amount}</p>
                                <p>Transaction Hash: {payment.transactionHash}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        )}
    </div>
);
};
export default EventEscrowComponent;
