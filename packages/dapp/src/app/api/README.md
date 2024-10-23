## API documentation

## Overview

The API directory within the SummitShare platform's Next.js app plays a pivotal role in interfacing the client-side application with various backend functionalities. It routes requests to the appropriate handlers for actions such as user authentication, exhibit management, event operations, and more. This application uses the NextJs [app router](https://nextjs.org/docs/app)

## Directory Breakdown 📁

Each subdirectory is dedicated to a specific aspect of the platform's backend operations, encapsulating the logic necessary for its corresponding features.

### [artifactNFT](https://github.com/bicos-io01/Revenue-Sharing-Source/tree/Central/packages/dapp/src/app/api/artifactNFT)

-  Handles interactions with Artifact NFTs, including their creation, management, and queries.

### [auth](https://github.com/bicos-io01/Revenue-Sharing-Source/tree/Central/packages/dapp/src/app/api/auth)

-  Contains the logic necessary for user authentication processes.

### [ deployExhibit](https://github.com/bicos-io01/Revenue-Sharing-Source/tree/Central/packages/dapp/src/app/api/deployExhibit)

-  Manages the functionalities used for deploying exhibits onto chain.

### [email](https://github.com/bicos-io01/Revenue-Sharing-Source/tree/Central/packages/dapp/src/app/api/email)

-  Manages email communications, such as notifications and templates.

### [events](https://github.com/bicos-io01/Revenue-Sharing-Source/tree/Central/packages/dapp/src/app/api/events)

-  **Subdirectories & Purpose**:
   -  [`createEvent`](https://github.com/bicos-io01/Revenue-Sharing-Source/tree/Central/packages/dapp/src/app/api/events/createEvent): Handles the creation of new exhibit proposals on the frontend.
   -  [`deploy`](https://github.com/bicos-io01/Revenue-Sharing-Source/tree/Central/packages/dapp/src/app/api/events/deploy): Manages the deployment of exhibitions to chain.
   -  [`images`](https://github.com/bicos-io01/Revenue-Sharing-Source/tree/Central/packages/dapp/src/app/api/events/images): Stores and manages images related to exhibitions.
   -  [`metadata`](https://github.com/bicos-io01/Revenue-Sharing-Source/tree/Central/packages/dapp/src/app/api/events/metadata): Handles the metadata associated with events.
   -  [`physicalEvents`](https://github.com/bicos-io01/Revenue-Sharing-Source/tree/Central/packages/dapp/src/app/api/events/physicalEvents): Specialized handling for physical (in-person) events.
   -  [`proposals`](https://github.com/bicos-io01/Revenue-Sharing-Source/tree/Central/packages/dapp/src/app/api/events/proposals): Manages event proposals.
      -  [`createNewProposal`](https://github.com/bicos-io01/Revenue-Sharing-Source/tree/Central/packages/dapp/src/app/api/events/proposals/createNewProposal): Facilitates the creation of new proposals.
      -  [`eventProposals`](https://github.com/bicos-io01/Revenue-Sharing-Source/tree/Central/packages/dapp/src/app/api/events/proposals/eventProposals): Maintains a list of event proposals for review and processing.
   -  [`vote`](https://github.com/bicos-io01/Revenue-Sharing-Source/tree/Central/packages/dapp/src/app/api/events/proposals/vote): Implements the voting mechanism for event proposals.
   -  [`requests`](https://github.com/bicos-io01/Revenue-Sharing-Source/tree/Central/packages/dapp/src/app/api/events/requests): Manages various types of requests to the backend.
   -  [`stakeholders`](https://github.com/bicos-io01/Revenue-Sharing-Source/tree/Central/packages/dapp/src/app/api/events/stakeholders): Handles the management of stakeholders involved in exhibitions.
   -  [`updateEvents`](https://github.com/bicos-io01/Revenue-Sharing-Source/tree/Central/packages/dapp/src/app/api/events/updateEvents): Provides functionality to update details of existing exhibitions.

### [VirtualEvents](https://github.com/bicos-io01/Revenue-Sharing-Source/tree/Central/packages/dapp/src/app/api/events/VirtualEvents)

-  **Subdirectories & Purpose**:
   -  `images`: Stores images related to virtual exhibitions.
   -  `metadata`: Manages metadata for virtual exhibitions.

### [signup](https://github.com/bicos-io01/Revenue-Sharing-Source/tree/Central/packages/dapp/src/app/api/signup)

-  Contains the logic for user signup and onboarding processes.

### [test](https://github.com/bicos-io01/Revenue-Sharing-Source/tree/Central/packages/dapp/src/app/api/test)

-  Facilitates testing of the API endpoints and their corresponding logic.

## Testing and Documentation

-  Ensure all new code is accompanied by relevant tests and documentation. Use structured comments to explain the purpose and functionality of your code snippets.
