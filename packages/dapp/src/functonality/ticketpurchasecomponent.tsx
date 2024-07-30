import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import { TicketPurchaseProps, EthereumWindow } from '@/utils/dev/typeInit';
import { CONTRACT_ADDRESSES, contracts, estimateGas } from '@/utils/dev/contractInit';
import { handleContractError } from '@/utils/dev/handleContractError';
import useExhibit from '@/lib/useGetExhibitById';
import { useSession } from 'next-auth/react';
import Buttons from '@/app/components/button/Butons';
import WalletStatus from './walletStatus';
import Image from 'next/image';


const TicketPurchaseComponent = ({ userAddress }: TicketPurchaseProps) => {
  const session = useSession();
  const [isVisible, setIsVisible] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [estimatedGasFees, setEstimatedGasFees] = useState('0.00');
  const [isEstimating, setIsEstimating] = useState(false);
  const [buttonType, setButtonType] = useState<'primary' | 'secondary' | 'tartary' | 'subTartary'>('primary');
  const [buttonText, setButtonText] = useState('Pay');
  const [isProcessing, setIsProcessing] = useState(false);

  const user_id = session.data?.user.id;

  // Hardcoded exhibit ID for demo
  const exhibitId = CONTRACT_ADDRESSES.exhibitId;
  const eventId = CONTRACT_ADDRESSES.eventId;

  // State hooks for managing component state
  const [status, setStatus] = useState<string>('');
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
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

  useEffect(() => {
    if (purchaseSuccessful) {
      setIsPopupVisible(false);
      setButtonType('secondary');
    }
  }, [purchaseSuccessful]);

  const createTicket = async () => {
    // Ensure HOST is read correctly, considering Next.js environment variables need to be prefixed with NEXT_PUBLIC_ if they are to be used on the client-side.
    const host = process.env.NEXT_PUBLIC_HOST;
    ////console.log(`host ${host} `)
    const eventLink = `${host}/exhibit/0xe405b9c97656336ab949401bcd41ca3f50114725`;
    // Construct the URL with the correct protocol (http or https) and ensure that the HOST variable includes the entire domain.
    const url = `${host}/api/v1/event/ticket/create`;
    ////console.log(`url ${url} ` ,user_id)

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
        ////console.log(`Error: ${response.status} - ${response.statusText}`);
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

  // set ticket price from object pulled from subgraph
  const ticketPrice = exhibit.exhibitDetails[0]?.ticketPrice || '';
  //console.log("details:", exhibit);

  // human readable ticket price for frontend
  const ticketPriceWei = BigInt(ticketPrice);
  const ticketPriceFormatted = ethers.utils.formatUnits(ticketPriceWei, 6);
  const ticketPriceWithToken = `${ticketPriceFormatted} USDT`;
 // console.log("ticketPrice:", ticketPriceWithToken);


const estimateGasFees = async () => {
  if (!provider) {
    setStatus('Web3 provider is not initialized.');
    return;
  }

  setIsEstimating(true);
  try {
    const usdcContract = contracts.getMUSDC();
    const museumContract = contracts.getMuseum();

    // Estimate gas for approval
    const gasLimitApprove = await estimateGas(usdcContract, 'approve', [CONTRACT_ADDRESSES.MuseumAdd, ticketPrice]);
    const gasPriceApprove = await provider.getGasPrice();
    
    // Convert BigInt to BigNumber if necessary
    const gasLimitApproveBN = ethers.BigNumber.from(gasLimitApprove.toString());
    const estimatedGasFeesApprove = ethers.utils.formatEther(gasLimitApproveBN.mul(gasPriceApprove));

    // Estimate gas for purchase
    const gasLimitPurchase = await estimateGas(museumContract, 'purchaseTicket', [eventId, ticketPrice]);
    const gasPricePurchase = await provider.getGasPrice();
    
    // Convert BigInt to BigNumber if necessary
    const gasLimitPurchaseBN = ethers.BigNumber.from(gasLimitPurchase.toString());
    const estimatedGasFeesPurchase = ethers.utils.formatEther(gasLimitPurchaseBN.mul(gasPricePurchase));
    console.log("Purchase estimate:", estimatedGasFeesPurchase)
    console.log("Approval estimate:", estimatedGasFeesApprove)

    // Sum up the estimated gas fees
    const totalEstimatedGasFees = (parseFloat(estimatedGasFeesApprove) + parseFloat(estimatedGasFeesPurchase)).toFixed(6);
    console.log("Total gas estimate:", totalEstimatedGasFees)
    setEstimatedGasFees(totalEstimatedGasFees);
  } catch (error) {
    console.error('Error estimating gas fees:', error);
    setEstimatedGasFees('Unable to estimate');
  } finally {
    setIsEstimating(false);
  }
};

    const calculateTotalPrice = () => {
      const ticketPrice = parseFloat(ticketPriceFormatted);
      const gasFees = parseFloat(estimatedGasFees);
      const total = ticketPrice + gasFees;
      return total.toFixed(6);
    };


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

      // Execute token approval 
      setStatus('Approving token transfer...');
      setIsProcessing(true);
      setButtonText('processing...');

      const gasLimitApprove = await estimateGas(usdcContract, 'approve', [CONTRACT_ADDRESSES.MuseumAdd, ticketPrice]);
      const approveTx = await usdcContract.approve(
        CONTRACT_ADDRESSES.MuseumAdd,
        ticketPrice,
        { gasLimit: gasLimitApprove }
      );
       await approveTx.wait();
      
      // Execute ticket purchase transaction
      setStatus('Purchasing ticket...');
      const gasLimitPurchase = await estimateGas(museumContract, 'purchaseTicket', [eventId, ticketPrice]);
      const purchaseTx = await museumContract.purchaseTicket(
        eventId,
        ticketPrice,
        { gasLimit: gasLimitPurchase }
      );
      await purchaseTx.wait();

      //State update after successful ticket purchase
      setPurchaseSuccessful(true);
      setStatus('Ticket purchased successfully!');
      setButtonText('Pay');
    } catch (error: any) {
      console.error('Smart Contract Interaction Failed:', error);
      const friendlyMessage = handleContractError(error as any); // Typecasting
      setStatus(friendlyMessage);
      setButtonText('Pay');

    }
  };

  const host = process.env.NEXT_PUBLIC_HOST;

  const url = '${host}/api/v1/events/tickets/create';

  const togglePopup = async () => {
    if (!isPopupVisible) {
      // Estimate gas fees when opening the popup
      await estimateGasFees();
    }
    setIsPopupVisible(!isPopupVisible);
  };

  // Render component UI
  return (
    <>
      <Buttons 
        type={buttonType} 
        size="large" 
        onClick={purchaseSuccessful ? () => window.open("https://oncyber.io/spaces/89cp8FpYgF5hgrHk1i3N", "_blank") : togglePopup} 
        disabled={false}
      >
        {purchaseSuccessful ? 'View Exhibit' : 'Purchase'}
      </Buttons>
  
      {isPopupVisible && !purchaseSuccessful && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-96">
            <button
              className="absolute top-0 right-0 mt-4 mr-4 text-gray-500 hover:text-gray-700"
              onClick={togglePopup}
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-4 text-center">{exhibit.exhibitDetails[0]?.name}</h2>
  
            <div className="mb-4 text-center">
              <label className="block text-sm font-medium text-gray-700">Ticket Price:</label>
              <p className="font-bold flex justify-center items-center">
                {ticketPriceWithToken}
                <Image
                  src="https://optimistic.etherscan.io/token/images/tether_32.png"
                  alt="Tether"
                  width={16}
                  height={16}
                  className="ml-2"
                />
              </p>
            </div>
  
            <div className="mb-4 text-center">
              <label className="block text-sm font-medium text-gray-700">Quantity:</label>
              <p>1x</p>
            </div>
  
            <div className="mb-4 text-center">
              <label className="block text-sm font-medium text-gray-700">Address to:</label>
              <WalletStatus />
            </div>
  
            <div className="mb-4 text-center relative">
              <label className="block text-sm font-medium text-gray-700">Total Price:</label>
              <p className="font-bold flex justify-center items-center">  
                {calculateTotalPrice()} USDT
                <Image
                  src="https://optimistic.etherscan.io/token/images/tether_32.png"
                  alt="Tether"
                  width={16}
                  height={16}
                  className="ml-2"
                />
              </p>
  
              <div className="relative inline-block group">
                <small
                  className="cursor-pointer text-black rounded-full border border-black bg-white"
                  style={{
                    padding: '2px 6px',
                    display: 'inline-block',
                    lineHeight: '1em',
                    textAlign: 'center',
                    fontSize: '12px',
                  }}
                >
                  ?
                </small>
                <div
                  className="absolute left-0 transform -translate-x-full mt-1 w-max bg-white text-gray-800 text-sm border border-gray-300 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                  style={{ whiteSpace: 'pre-line', padding: '8px 12px' }}
                >
                  <div><b>Breakdown:</b> </div>
                  {`Ticket Price: ${ticketPriceFormatted} USDT
  Gas Fees Estimate: ${estimatedGasFees} USDT
  (Gas fees are used to process the purchase onchain and do not go to us.)`}
                </div>
              </div>
            </div>
  
            <Buttons type="primary" size="large" onClick={purchaseTicket}>
              {buttonText}
            </Buttons>
          </div>
        </div>
      )}
  
      {purchaseSuccessful && (
        <div className="fixed bottom-5 right-5 z-50">
          <a href="https://oncyber.io/spaces/89cp8FpYgF5hgrHk1i3N" target="_blank" rel="noopener noreferrer">
            <Buttons type="secondary" size="large">
              View Exhibit
            </Buttons>
          </a>
        </div>
      )}
  
      <div
        className={`bg-green-500 border w-[90%] md:w-fit rounded-md p-3 fixed right-5 z-50 transition-transform duration-500 border-green-300 ${
          isVisible ? 'translate-y-0 bottom-5' : 'translate-y-full -bottom-20'
        }`}
      >
        {status && <p className="text-sm text-white font-semibold">{status}</p>}
      </div>
    </>
  );
};
  
export default TicketPurchaseComponent;