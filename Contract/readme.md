# Current Contract Breakdown

# 1. Variables:
- rs1, rs2, rs3: Addresses representing three participants, with rs1 being the contract owner.
- ps: A percentage share for rs2. The remaining share goes to rs3.
- fundsDistributed: A boolean variable that ensures funds are distributed only once.
- MAX_RECEIVE_AMOUNT: A constant representing the maximum amount that can be received (11 Ether).

# 3. Events:
- FundsDistributed: Emitted when the funds are distributed.
- ContractFunded: Emitted when the contract is funded.
- RemainingBalanceReturned: Emitted when the remaining balance is returned to the contract owner.

# 5. Constructor:
- The constructor initializes the addresses of rs2 and rs3, as well as the percentage share (ps). It also conducts some basic validation of the input parameters.

# 6. Modifiers:
- onlyOwner: Ensures that only the contract owner (rs1) can perform certain actions.
- fundsNotDistributed: Ensures that the funds are not distributed more than once.

# 8. Functions:
- fundContract: Allows funding the contract with an amount up to 11 Ether. Emits an event to track funding.
- Distributes the funds between rs2 and rs3 based on the specified percentage share. Uses OpenZeppelin's nonReentrant modifier for additional security. Also -handles rounding errors by returning any leftover balance to rs1.
- getContractBalance: Returns the current balance of the contract.
- recoverStuckFunds: Allows the owner to recover any stuck funds.

# 10. Security Considerations:
- Reentrancy Guard: The contract imports OpenZeppelin's ReentrancyGuard to prevent reentrancy attacks.
- Validation: The contract performs validation checks on the addresses and percentage share.
