# Ticketing System README

## User Flow
1. Users interact with the front-end UI to select an event and click "Buy Ticket."
2. The UI communicates with the Controller Contract.
3. The Controller Contract deploys or uses existing contracts: Storage Contract, Conversion Contract, and Revenue Sharing Contract.
4. Users provide payment in either USDT or USDC tokens.
5. The Ticketing Contract mints ERC721 tickets with associated event details.
6. If USDT is used, the Conversion Contract converts it to USDC and sends it to the Storage Contract.
7. The Storage Contract accumulates tokens until a threshold is met or exceeded.
8. When the threshold is reached, the Storage Contract sends the tokens to the Revenue Sharing Contract.
9. The Revenue Sharing Contract distributes the received tokens among the participants.

## Contract Interactions
- **Ticketing Contract:** Allows users to purchase event tickets and mints ERC721 tokens.
- **Controller Contract:** Manages and coordinates the deployment of other contracts and provides an interface for user interactions.
- **Storage Contract:** Stores received tokens and sends them to the Revenue Sharing Contract when a threshold is met.
- **Conversion Contract:** Converts USDT to USDC and sends the converted tokens to the Storage Contract.
- **Revenue Sharing Contract:** Distributes received tokens among participants.
