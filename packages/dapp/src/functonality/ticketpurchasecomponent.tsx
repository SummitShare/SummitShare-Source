import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  TicketPurchaseProps,
  EthereumWindow,
  TransactionReceipt,
} from '@/utils/dev/typeInit';
import {
  CONTRACT_ADDRESSES,
  contracts,
  estimateGas,
} from '@/utils/dev/contractInit';
import { fetchEthUsdtPrice } from '@/utils/methods/ticketPurchase/eth_usd_price';
import { handleContractError } from '@/utils/dev/handleContractError';
import useExhibit from '@/lib/useGetExhibitById';
import { useSession } from 'next-auth/react';
import Buttons from '@/app/components/button/Butons';
import WalletStatus from './walletStatus';
import Image from 'next/image';
import axios from 'axios';
import Link from 'next/link';

const TicketPurchaseComponent = ({ userAddress }: TicketPurchaseProps) => {
  const session = useSession();
  const [isVisible, setIsVisible] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [estimatedGasFees, setEstimatedGasFees] = useState('0.00');
  const [isEstimating, setIsEstimating] = useState(false);
  const [buttonType, setButtonType] = useState<
    'primary' | 'secondary' | 'tartary' | 'subTartary'
  >('primary');
  const [buttonText, setButtonText] = useState('Pay');
  const [isProcessing, setIsProcessing] = useState(false);

  const user_id = session.data?.user.id;
  const host = process.env.NEXT_PUBLIC_HOST;
  const url = '${host}/api/v1/events/tickets/create';

  // Hardcoded exhibit ID for demo
  const exhibitId = CONTRACT_ADDRESSES.exhibitId;
  const eventId = CONTRACT_ADDRESSES.eventId;

  // State hooks for managing component state
  const [status, setStatus] = useState<string>('');
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [purchaseSuccessful, setPurchaseSuccessful] = useState<boolean>(false);
  const [purchaseFailed, setPurchaseFailed] = useState<boolean>(false);
  const [hasTicket, setHasTicket] = useState(false);
  const exhibit = useExhibit(exhibitId);
  const [isHovering, setIsHovering] = useState(false);

  // Effect hook to check if the user has already purchased a ticket
  useEffect(() => {
    const validateTicket = async () => {
      try {
        const response = await axios.post('/api/validateTicket', {
          userAddress,
          eventId,
        });
        if (response.data.hasTicket) {
          setHasTicket(true);
          setButtonType('secondary');
          setButtonText('View Exhibit');
        }
      } catch (error) {
        console.error('Error validating ticket:', error);
      }
    };

    validateTicket();
  }, [userAddress, eventId]);

  // Effect hook for timeouts
  useEffect(() => {
    if (status) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 4000); // 2 seconds

      return () => clearTimeout(timer);
    }
  }, [status]);

  // Effect hook to trigger actions post successful ticketPurchase
  useEffect(() => {
    if (purchaseSuccessful) {
      setIsPopupVisible(false);
      setButtonType('secondary');
    }
  }, [purchaseSuccessful]);

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

  // Check for exhibitID from query client
  if (!exhibit) {
    return <div>Loading or no Matching Exhibit Found.</div>;
  }

  // set ticket price from object pulled from subgraph
  const ticketPrice = exhibit.exhibitDetails[0]?.ticketPrice || '';

  // Exhibit Details
  //console.log("details:", exhibit);

  // Assign ticekt price  from exhibit object and format to human readable (normal) integers
  const ticketPriceWei = BigInt(ticketPrice);
  const ticketPriceFormatted = ethers.utils.formatUnits(ticketPriceWei, 6);
  const ticketPriceWithToken = `${ticketPriceFormatted} USDT`;

  // Estimate gas fees function for app. and purchase to display on total tickt amount on purchase component
  const estimateGasFees = async () => {
    if (!provider) {
      setStatus('Please connect your web3 wallet.');
      return;
    }

    setIsEstimating(true);
    try {
      const usdcContract = contracts.getMUSDC();
      const museumContract = contracts.getMuseum();

      // Estimate gas for approval
      const gasLimitApprove = await estimateGas(usdcContract, 'approve', [
        CONTRACT_ADDRESSES.MuseumAdd,
        ticketPrice,
      ]);
      const gasPriceApprove = await provider.getGasPrice();

      const gasLimitApproveBN = ethers.BigNumber.from(
        gasLimitApprove.toString()
      );
      const gasPriceApproveBN = ethers.BigNumber.from(
        gasPriceApprove.toString()
      );
      const estimatedGasFeesApproveWei =
        gasLimitApproveBN.mul(gasPriceApproveBN);

      // Estimate gas for purchase
      let gasLimitPurchase;
      try {
        gasLimitPurchase = await estimateGas(museumContract, 'purchaseTicket', [
          eventId,
          ticketPrice,
        ]);
      } catch (error) {
        console.error('Error estimating gas for purchaseTicket:', error);
        // Fallback to a manual gas limit
        gasLimitPurchase = ethers.BigNumber.from('100000'); // fallback gas limit
      }
      const gasPricePurchase = await provider.getGasPrice();

      const gasLimitPurchaseBN = ethers.BigNumber.from(
        gasLimitPurchase.toString()
      );
      const gasPricePurchaseBN = ethers.BigNumber.from(
        gasPricePurchase.toString()
      );
      const estimatedGasFeesPurchaseWei =
        gasLimitPurchaseBN.mul(gasPricePurchaseBN);

      // Sum up the estimated gas fees in Wei
      const totalEstimatedGasFeesWei = estimatedGasFeesApproveWei.add(
        estimatedGasFeesPurchaseWei
      );

      // Convert Wei to ETH
      const totalEstimatedGasFeesETH = ethers.utils.formatEther(
        totalEstimatedGasFeesWei
      );

      // Fetch the current ETH/USDT price
      const ethUsdtPrice = await fetchEthUsdtPrice();
      // Convert ETH to USDT
      const totalEstimatedGasFeesUSDT =
        parseFloat(totalEstimatedGasFeesETH) * ethUsdtPrice;

      // Format the number to remove trailing zeros but keep up to 2 decimal places
      const formatNumber = (num: number): string => {
        return num.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      };

      const formattedGasFees = formatNumber(totalEstimatedGasFeesUSDT);

      console.log('Total gas estimate in USDT:', formattedGasFees);
      setEstimatedGasFees(formattedGasFees);
    } catch (error) {
      console.error(error);
      setStatus('Error estimating gas fees. Please try again.');
    } finally {
      setIsEstimating(false);
    }
  };

  // function to calculate total price incl. gas fees
  const calculateTotalPrice = () => {
    const ticketPrice = parseFloat(ticketPriceFormatted);
    const gasFees = parseFloat(estimatedGasFees);
    const total = ticketPrice + gasFees;
    return total.toFixed(2);
  };

  // pop up component
  const togglePopup = async () => {
    if (!isPopupVisible) {
      // Estimate gas fees when opening the popup
      await estimateGasFees();
    }
    setIsPopupVisible(!isPopupVisible);
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

      // Update states
      setStatus('Approving token transfer...');
      setIsProcessing(true);
      setButtonText('processing...');

      // approve method execution
      const gasLimitApprove = await estimateGas(usdcContract, 'approve', [
        CONTRACT_ADDRESSES.MuseumAdd,
        ticketPrice,
      ]);
      const approveTx = await usdcContract.approve(
        CONTRACT_ADDRESSES.MuseumAdd,
        ticketPrice,
        { gasLimit: gasLimitApprove }
      );
      await approveTx.wait(1);

      // Execute ticket purchase transaction
      setStatus('Purchasing ticket...');
      const gasLimitPurchase = await estimateGas(
        museumContract,
        'purchaseTicket',
        [eventId, ticketPrice]
      );
      const purchaseTx = await museumContract.purchaseTicket(
        eventId,
        ticketPrice,
        { gasLimit: gasLimitPurchase }
      );
      const receipt00: TransactionReceipt = await purchaseTx.wait(2);

      //State update after successful ticket purchase
      setPurchaseSuccessful(true);
      setStatus('Ticket purchased successfully!');

      try {
        // assign user ticket details post successful ticketPurchase
        const walletAddress = receipt00.from;
        const event_Id = '419a0b2d-dee9-4782-9cff-341c5f8343a6';
        const userId = user_id;
        const HOST = process.env.NEXT_PUBLIC_HOST;
        const eventLink = `${HOST}/exhibit`;
        const transactionId = receipt00.transactionHash;

        // prepare object for API call
        const userTicketData = {
          wallet_address: walletAddress,
          event_id: event_Id,
          user_id: userId,
          eventLink: eventLink,
          transaction_id: transactionId,
        };

        const response = await axios.post(
          'api/v1/events/tickets/create',
          userTicketData
        );

        if (response.status === 200) {
          console.log('Ticket created successfully!');
        } else {
          console.error(`Wife and kids have no home:`, response.data.message);
        }
        return response.data;
      } catch (error) {}
      setButtonText('Pay');
    } catch (error: any) {
      console.error('Smart Contract Interaction Failed:', error);
      const friendlyMessage = handleContractError(error as any); // Typecasting
      setStatus(friendlyMessage);
      setButtonText('Pay');
    }
  };

  // Render component UI
  return (
    <>
      <Buttons
        type={buttonType}
        size="large"
        onClick={
          purchaseSuccessful
            ? () =>
                window.open(
                  'https://oncyber.io/spaces/89cp8FpYgF5hgrHk1i3N',
                  '_blank'
                )
            : togglePopup
        }
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
            <h2 className="text-lg font-semibold mb-4 text-center">
              {exhibit.exhibitDetails[0]?.name}
            </h2>

            <div className="mb-4 text-center">
              <label className="block text-sm font-medium text-gray-700">
                Ticket Price:
              </label>
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
              <label className="block text-sm font-medium text-gray-700">
                Quantity:
              </label>
              <p>1x</p>
            </div>

            <div className="mb-4 text-center">
              <label className="block text-sm font-medium text-gray-700">
                Address to:
              </label>
              <WalletStatus />
            </div>

            <div className="mb-4 text-center relative">
              <label className="block text-sm font-medium text-gray-700">
                Total Price:
              </label>
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

              <div className="relative inline-block">
                <small
                  className="cursor-pointer text-black rounded-full border border-black bg-white px-2 py-1 inline-block leading-none text-center text-xs"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  ?
                </small>
                {isHovering && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-64 sm:w-350 bg-white text-gray-800 text-sm border border-gray-300 rounded-lg shadow-lg z-10 p-3">
                    <div className="font-bold mb-2">Breakdown:</div>
                    <div className="space-y-1">
                      <div>
                        <strong>
                          Ticket Price: {ticketPriceFormatted} USDT
                        </strong>
                      </div>
                      <div>
                        <strong>
                          Gas Fees Estimate: {estimatedGasFees} USDT
                        </strong>{' '}
                      </div>
                      <div className="text-xs mt-2">
                        (Gas fees are used to process the purchase on-chain and
                        do not go to us.)
                      </div>
                    </div>
                  </div>
                )}{' '}
              </div>
              <style jsx>{`
                @media (min-width: 640px) {
                  .group:hover > div {
                    width: 350px;
                  }
                }
              `}</style>
            </div>

            <Buttons type="primary" size="large" onClick={purchaseTicket}>
              {buttonText}
            </Buttons>
            <div className="text-center">
              <Link
                href="/help"
                className="text-sm text-orange-600 hover:underline"
              >
                Need help? Visit our Help Page
              </Link>
            </div>
          </div>
        </div>
      )}

      {purchaseSuccessful && (
        <div className="fixed bottom-5 right-5 z-50">
          <a
            href="https://oncyber.io/spaces/89cp8FpYgF5hgrHk1i3N"
            target="_blank"
            rel="noopener noreferrer"
          >
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
