# Contract Interaction Scripts

This repository contains two JavaScript scripts for interacting with the Ethereum network using the ethers.js library. The scripts are designed to fund a contract and distribute funds.

## Prerequisites

Before running the scripts, make sure you have the following:

- Node.js and npm installed
- Ethereum wallet (for private key)
- ethers.js installed
- Infura API key for Ethereum JSON-RPC provider
- dotenv library for managing environment variables (`npm install dotenv`)

## Getting Started

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/your-username/ethereum-interaction-scripts.git
   cd ethereum-interaction-scripts
2. npm install
3. Set up dotenv 
  INFURA_ID=your_infura_api_key
  CONTRACT_OWNER_PRIVATE_KEY=private_key_used_to_deploy
  CONTRACT_FUNDER_PRIVATE_KEY=your_private_key
4. Ensure you have the update the contract address and ABI with new the contract you have deployed on the sepolia test net
5. update all wallets involved rs1 ,rs2 ,rs3 as well as the contract CONTRACT_OWNER_PRIVATE_KEY
6. run node fundContract.js
7. run distributeFunds.js

