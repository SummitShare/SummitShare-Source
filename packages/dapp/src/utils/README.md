# Utils Directory README📂

## Overview 🌟

The 'utils' directory within the SummitShare Dapp is a central hub for utility scripts, smart contract ABIs, and TypeChain types, facilitating seamless interaction between the Dapp's frontend and the Ethereum blockchain. This directory is structured into several subdirectories, each serving a specific purpose in the development workflow.

### Subdirectories Breakdown 📚

-  **`artifacts` and `typechain-types`**: Contains ABI definitions📄 and TypeChain types🧬 for smart contracts. These are vital for interacting with the contracts on the blockchain, providing a strongly typed interface for contract methods.
-  **`dev` and `prod`**: Host environment-specific configurations and scripts🛠️ for interacting with contracts in development and production environments.

## Workflow and Integration 🔄

### Contract Compilation 🏗️

1. **Smart Contract Compilation**: Run `npx hardhat compile` in the contracts directory to compile smart contracts and generate ABI files and TypeChain types.
2. **Updating the Dapp**:
   -  **ABI and TypeChain Copy**: Post-compilation, copy the newly generated ABI files and TypeChain types from the `artifacts` and `typechain-types` directories into `Revenue-Sharing-Source\packages\dapp\src\utils` for access by the contract interaction scripts within the Dapp.
   -  This ensures that any updates or changes to the smart contracts are reflected in the Dapp, maintaining consistency and accuracy in contract interactions.

### Development Commands

Utilize the following commands for local development and testing:

-  **Development Environment**: Use scripts within the `dev` directory for local development, ensuring you're interacting with contracts deployed on test networks.
-  **Production Deployment**: Scripts within the `prod` directory should be used when interacting with live, deployed contracts on the mainnet or production testnets.

## Updating ABI and TypeChain Types

-  **Regular Updates**: Keep the ABI and TypeChain types updated with every significant change to the smart contracts to ensure seamless integration and interaction within the Dapp.

---

# Functionality Directory README

## Overview

The Functionality Directory is a core part of the SummitShare Dapp, containing scripts that handle various aspects of the platform's operations. These scripts facilitate user interactions with the smart contracts and manage internal logic for features such as ticket purchases, wallet connections, and exhibit management.

### Directories and Scripts

#### [`navBarController.tsx`](https://github.com/bicos-io01/Revenue-Sharing-Source/blob/Central/packages/dapp/src/functonality/navBarController.tsx)

This script provides a custom hook, `useToggle`, which manages the open/closed state of components, such as navigation bars, modals, etc. It is a fundamental UI utility for user interface state management.

#### [`walletconnect.tsx`](https://github.com/bicos-io01/Revenue-Sharing-Source/blob/Central/packages/dapp/src/functonality/walletconnect.tsx)

Integrates the ThirdwebProvider and allows users to connect their wallets via supported methods like MetaMask, Coinbase Wallet, WalletConnect, etc. It plays a pivotal role in user onboarding and authentication.

#### [`ticketpurchasecomponent.tsx`](https://github.com/bicos-io01/Revenue-Sharing-Source/blob/Central/packages/dapp/src/functonality/ticketpurchasecomponent.tsx)

This component interacts with the Museum contract to handle the purchasing of tickets. It allows users to approve USDC transfers and purchase tickets, which are represented as ERC-721 tokens, granting access to exhibitions.

#### [`eventEscrowComponent.tsx`](https://github.com/bicos-io01/Revenue-Sharing-Source/blob/Central/packages/dapp/src/functonality/eventEscrowComponent.tsx)

Connects with the Event Escrow contract to manage the distribution of funds from ticket sales to stakeholders. This component is essential for revenue distribution among participants in an exhibition.

#### [`mockfunding.ts`](https://github.com/bicos-io01/Revenue-Sharing-Source/blob/Central/packages/dapp/src/functonality/mockfunding.ts)

Utilizes a mock USDC contract for development purposes, allowing developers to mint tokens and simulate funding operations within the Dapp.

#### [`ImageUploader.tsx`](https://github.com/bicos-io01/Revenue-Sharing-Source/blob/Central/packages/dapp/src/functonality/ImageUploader.tsx)

Although commented out, this script is intended to handle the uploading of images to a server or cloud storage like S3, potentially to be used for exhibition imagery.
