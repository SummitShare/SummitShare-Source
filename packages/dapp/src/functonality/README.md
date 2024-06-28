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
