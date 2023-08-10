# Revenue-Sharing-Source
This repository hosts the proof-of-concept version of the revenue-sharing platform. It includes the source files and provides an overview of the core functionality.

# Overview

# 1. Wallet Integration and Event Creation Form:
The user interface provides an entry point for the participants to interact with the Revenue Sharing Contract (RVS). Here's how it functions:

 a. Wallet Connection:
- The user is prompted to connect their wallet (e.g., MetaMask) to the platform.
- Upon successful connection, the user's wallet address (rs1) is extracted and logged into a JSON file as an event.
- This address will represent the contract owner (rs1) in the Revenue Sharing Contract.

 b. Event Creation Form:
- The form collects additional parameters: `rs2`, `rs3`, and `ps`, which represent the addresses of other participants and the percentage share for `rs2`.
- Once the form is submitted, these parameters are logged into the same JSON file.

# 2. Hardhat Script:
A Hardhat script plays a crucial role in interacting with the Ethereum blockchain and the Revenue Sharing Contract. Here's how it operates:

 a. Importing Parameters:
- The Hardhat script reads the JSON file to import the parameters: `rs1`, `rs2`, `rs3`, and `ps`.
- These parameters are used to deploy or interact with the Revenue Sharing Contract (RVS).

 b. Contract Interaction:
- The script initiates the `RVS` contract by filling out the constructor parameters.
- The contract owner (rs1) funds the contract by calling the `fundContract` function.
- The `distributeFunds` function is called to distribute the funds between `rs2` and `rs3`, based on the specified percentage share.

 c. Logging Events:
- Events emitted by the contract are captured and logged into a secondary JSON file.
- This can include details such as the amounts distributed, transaction hashes, and timestamps.

# 3. Revenue Sharing Contract (RVS):
- This is the provided Solidity contract that manages the revenue sharing among the participants.
- It includes functions to fund the contract, distribute the funds, and handle security considerations.

# 4. Security and Validation:
- Proper validation and security measures must be implemented at every step, including input validation, authentication, and authorization.

