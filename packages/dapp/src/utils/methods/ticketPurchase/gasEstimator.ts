// gasEstimator.ts

import { ethers } from 'ethers';
import { fetchEthUsdtPrice } from './eth_usd_price';
import { CONTRACT_ADDRESSES, estimateGas } from '@/utils/dev/contractInit';

export const estimateGasFees = async (
  provider: any,
  contracts: any,
  ticketPrice: string,
  eventId: string,
  setStatus: React.Dispatch<React.SetStateAction<string>>,
  setEstimatedGasFees: React.Dispatch<React.SetStateAction<string>>,
  setIsEstimating: React.Dispatch<React.SetStateAction<boolean>>
) => {
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

    const estimatedGasFeesApproveWei = ethers.BigNumber.from(
      gasLimitApprove.toString()
    ).mul(ethers.BigNumber.from(gasPriceApprove.toString()));

    // Estimate gas for purchase
    let gasLimitPurchase;
    try {
      gasLimitPurchase = await estimateGas(museumContract, 'purchaseTicket', [
        eventId,
        ticketPrice,
      ]);
    } catch (error) {
      console.error('Error estimating gas for purchaseTicket:', error);
      gasLimitPurchase = ethers.BigNumber.from('100000'); // fallback gas limit
    }
    const gasPricePurchase = await provider.getGasPrice();
    const estimatedGasFeesPurchaseWei = ethers.BigNumber.from(
      gasLimitPurchase.toString()
    ).mul(ethers.BigNumber.from(gasPricePurchase.toString()));

    // Sum up the estimated gas fees
    const totalEstimatedGasFeesWei = estimatedGasFeesApproveWei.add(
      estimatedGasFeesPurchaseWei
    );

    // Convert Wei to ETH and fetch ETH/USDT price
    const totalEstimatedGasFeesETH = ethers.utils.formatEther(
      totalEstimatedGasFeesWei
    );
    const ethUsdtPrice = await fetchEthUsdtPrice();
    const totalEstimatedGasFeesUSDT =
      parseFloat(totalEstimatedGasFeesETH) * ethUsdtPrice;

    // Format the result
    const formattedGasFees = formatNumber(totalEstimatedGasFeesUSDT);
    setEstimatedGasFees(formattedGasFees);
  } catch (error) {
    console.error(error);
    setStatus('Error estimating gas fees. Please try again.');
  } finally {
    setIsEstimating(false);
  }
};

const formatNumber = (num: number): string => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
