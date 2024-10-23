# SummitShare Dapp Directory README 📚

## Overview

The SummitShare Dapp Directory houses the platform's frontend, built on `Next.js` with `TypeScript` and managed with `pnpm`, set to strict type safety. This directory is crucial for enabling dynamic, user-centric interactions with the SummitShare event management and ticketing web application. It encompasses React frontend components, scripts for smart contract interactions, and APIs for comprehensive platform functionality.

### Frontend Breakdown 🎨

-  **Capabilities**: The frontend facilitates browsing exhibitions, connecting wallets, purchasing ERC-721 ticket tokens, and accessing virtual (and potentially IRL) exhibitions. For exhibit creators, it offers a comprehensive form for organizing exhibitions, including stakeholder invitations and proposal submissions.
-  **Architecture**: Leveraging Next.js and TypeScript, the architecture ensures robust, scalable, and type-safe development. Apollo Client is utilized for GraphQL queries to the subgraph, ensuring real-time data updates.

-  **Key Scripts and APIs**:
   -  **Event Organizer Smart Contract**: Serves as the controller for other contracts, with frontend interactions managed through dedicated scripts.
   -  **Apollo Wrapper**: Integrates Apollo Client for querying the subgraph, linking frontend components to blockchain data. See the [apolloWrapper](<https://github.com/bicos-io01/Revenue-Sharing-Source/blob/Central/packages/dapp/src/app/(UserPages)/apolloWrapper.tsx>) script and the other react hooks utilising [apollo](https://github.com/bicos-io01/Revenue-Sharing-Source/tree/Central/packages/dapp/src/lib) for more information.

## API Breakdown 🎨

-  **Capabilities**: The api facilitates user creation and exhibition/proposal creation as well as voting.
-  **Architecture**: Leveraging Next.js and TypeScript, the architecture ensures robust, scalable, and type-safe development

### Development Commands 🛠️

To get started with development, use the following `pnpm` commands:

```bash
pnpm dev      # Runs the development server
pnpm build    # Builds the application for production
pnpm start    # Starts a Next.js production server
pnpm lint     # Lints the project files
```

### File Hierarchy 📁

The Dapp Directory is organized into three main parts: frontend components, contract interaction scripts, and APIs. Here's an outline of the key directories:

-  **Components**: Contains React components for UI, divided into categories like Landing Page, User Dashboard, Admin Dashboard, and Help and Info.
-  **Scripts**: Hosts the scripts for interacting with smart contracts, enabling functionalities like ticket purchasing and exhibit creation.
-  **APIs**: Includes the APIs that bridge frontend actions with the subgraph and smart contracts, facilitating platform processes.

### Resources 📌

-  **Contracts Directory**: For a more in depth exploration into the [smart contracts (RVS-m)](https://github.com/bicos-io01/Revenue-Sharing-Source/tree/Central/packages/contracts) operating within the platform.

-  **Utils**: Collection of essential utility scripts and configurations in the [Utils directory](https://github.com/bicos-io01/Revenue-Sharing-Source/tree/Central/packages/dapp/src/utils), which provide the building blocks for Dapp development and maintenance.

-  **API**: Explore the [API directory](https://github.com/bicos-io01/Revenue-Sharing-Source/tree/Central/packages/dapp/src/app/api) for backend endpoints that handle everything from user authentication to exhibit management and contract interaction scripts, ensuring seamless data flow and functionality.

-  **lib**: The [lib directory](https://github.com/bicos-io01/Revenue-Sharing-Source/tree/Central/packages/dapp/src/lib) is home to our custom hooks and components that interface with the blockchain, offering a modular approach to building reactive frontend features.

-  **functionality**: Within the [Functionality directory](https://github.com/bicos-io01/Revenue-Sharing-Source/tree/Central/packages/dapp/src/functonality), you'll find scripts that are focussed client components covering ticketpurchase to escrow fund distribution.
