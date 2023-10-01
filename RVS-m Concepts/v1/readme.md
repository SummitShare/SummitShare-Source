# RVS-m Smart Contract Mesh
## Proposed Functionality
The project aims to build a decentralized platform for event ticketing and revenue sharing. The mesh of smart contracts is designed to handle different aspects ranging from ticket purchasing, revenue storage, token conversion, to final revenue distribution. The contracts work in a synergistic manner, each playing a specific role in the ecosystem.
## Current Functionality
### Controller
- Has a constructor for initial setup.
- Contains external functions accessible from other contracts.
- Contains public functions accessible externally and internally.
- Contains internal functions for contract-internal logic.
- Uses modifiers to change the behavior of functions.
### RevenueSharingContract
- Has a constructor for initial setup.
- Contains external functions accessible from other contracts.
- Contains public functions accessible externally and internally.
- Uses modifiers to change the behavior of functions.
- Emits events for state changes.
### StorageContract
- Has a constructor for initial setup.
- Contains external functions accessible from other contracts.
- Contains public functions accessible externally and internally.
- Contains internal functions for contract-internal logic.
- Uses modifiers to change the behavior of functions.
- Emits events for state changes.
### TicketPurchase
- Has a constructor for initial setup.
- Contains external functions accessible from other contracts.
- Contains public functions accessible externally and internally.
- Contains internal functions for contract-internal logic.
- Emits events for state changes.
### TokenConversionContract
- Has a constructor for initial setup.
- Contains external functions accessible from other contracts.
- Contains public functions accessible externally and internally.
## Considerations and What's Missing
1. Error Handling: Comprehensive error handling and revert messages are needed.
2. Gas Optimization: Some functions may require optimization for gas usage.
3. Security Audits: Contracts should undergo thorough security audits to identify vulnerabilities.
4. Front-end Integration: The contracts need to be integrated with a user-friendly front-end.
5. Additional Features: Internal logic perfecting
