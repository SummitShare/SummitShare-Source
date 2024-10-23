// Function to fetch the current ETH/USDT price
export const fetchEthUsdtPrice = async () => {
   try {
      const response = await fetch(
         'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
      );
      const data = await response.json();
      return data.ethereum.usd;
   } catch (error) {
      console.error('Error fetching ETH/USDT price:', error);
      throw error;
   }
};
