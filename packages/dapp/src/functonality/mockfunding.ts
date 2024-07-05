import { ethers } from 'ethers';
import usdcABI from '../utils/artifacts/contracts/MUSDC.sol/MUSDC.json';
const musdcABI = usdcABI as unknown as ethers.ContractInterface;

const musdcAddress = '0xDd4c60185608108D073C19432eef0ae50AB3830d';
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(musdcAddress, musdcABI, signer);

// Assuming the contract has a mint or faucet function
// Replace `amount` with the amount of mock USDC you want
await contract.mint(signer.getAddress(), 200);
