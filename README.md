#SummitShare Platform

This repository contains the source code and documentation for SummitShare, a platform designed to address the socio-economic and cultural gaps created by the displacement and decontextualization of cultural artifacts. SummitShare employs blockchain technology, smart contracts, and web3 interfaces to enable two primary modules: 1) Revenue-Sharing Based Event Management and Ticketing, and 2) Virtual Museum. This document provides an overview of the architecture, components, and functionalities of the system, which is still under active development.

Table of Contents
System Overview
Modules
Revenue Sharing Based Event Management
Virtual Museum
Technologies
Interconnections
Security and Validation
Social Implications
System Overview

The SummitShare platform operates on an Ethereum-based blockchain and consists of multiple smart contracts written in Solidity. It features a robust event-logging system capturing event parameters and transactions, facilitating interactions via Hardhat scripts and web3 interfaces. Here's a brief layout:

Smart Contracts: Handles core business logic for revenue sharing and event management.
Hardhat Scripts: Responsible for smart contract deployments and interactions.
Web3 Interface: The front-end layer for users to interact with the blockchain.

#Modules

**Module 1: Revenue Sharing Based Event Management**

Features
Event Creation Form:
General Info: Collects event details such as name, description, location, ticket types, and pricing.
Revenue Split: Allows specifying wallet addresses and corresponding revenue share percentages.
NFT-based Ticketing System:
Utilizes an event logger that captures the public address of the purchaser to create a UUID.
Contract addresses of minted artifacts generate QR codes for verification.
Event Dashboard and Analytics:
Displays various KPIs, logs, and revenue distribution analytics.
Messaging and Consensus System:
A forum for stakeholders to discuss and vote on revenue-sharing proposals.

**Module 2: Virtual Museum**

Features
Offchain Hosted Environment:
Users can purchase tickets to specific exhibitions or entire levels.
Digital Artifacts:
Hosted offchain but linked to their onchain descriptions, complete with metadata.
Technologies
Smart Contracts: Solidity (EVM-based)
Backend: Hardhat for script execution
Frontend: Web3.js for blockchain interactions
Data Serialization: JSON for event and parameter logging

#Interconnections
The two modules are interconnected through:

Revenue Distribution Mesh: A series of smart contracts that facilitate revenue distribution.
Consensus Mechanism: Shared between the two modules to facilitate voting and data validation.

#Security and Validation

Due diligence is exercised at every step for security, including:
Input validation for front-end forms
Authentication and authorization for sensitive contract functions


#Social Implications
**The Problem of Displacement and Decontextualization**

Cultural artifacts hold immense socio-economic and spiritual value to their countries of origin. However, a significant number of these items reside in foreign museums or private collections, depriving native populations of economic benefits and cultural enrichment.

**Leveraging Digital Information for Socio-economic Gains**
The SummitShare Platform aims to counter this gap by providing a digital space where artifacts regain their contextual settings. It uses immutable metadata tags recorded on a blockchain to preserve each artifact's cultural and historical significance.



Note: This is a work in progress, and the functionalities might be subject to changes.

