# RVS-m Smart Contracts README

## General Overview

At the heart of the SummitShare platform lies a sophisticated network of smart contracts, each serving as a cornerstone in the digital repatriation and virtual exhibition ecosystem. Imagine a well-orchestrated symphony, where each musician plays a critical role in creating a harmonious performance. Similarly, our smart contracts work in concert to enable a seamless and secure experience for users, artifacts, and exhibitions.

The **RVS-m** *(Revenue Sharing Smart Contract Mesh)* suite forms the backbone of the SummitShare platform, enabling digital repatriation and virtual exhibition management. It comprises systems for token management, consensus-driven decision making, revenue distribution, and digital escrow services, each designed to facilitate transparent, secure, and efficient operations.

```
EventOrganizerService
├──► ArtifactNFT        - Manages digital tokens representing artifacts.
├──► EventEscrow        - Handles escrow and revenue distribution.
├──► Museum             - Organizes exhibits and manages artifact indexing.
└──► ExhibitNFT         - Responsible for minting tickets and allocations.

ArtifactNFT
└──► Museum             - Artifacts are indexed under museums.

Museum
├──► ExhibitNFT         - Requests ticket minting for exhibitions.
└──► EventEscrow        - Receives distributions from escrow.

ExhibitNFT
└──► EventEscrow        - Managed by EventEscrow for ticket sales and revenue handling.

```

---

## System Components and Execution Flow Analysis 💻


### Artifact Management System (AMS)

- **Purpose:** Facilitates the representation of digital or physical artifacts as unique, indivisible tokens on the blockchain.
- **Key Contracts:** [`ArtifactNFT.sol`](https://github.com/bicos-io01/Revenue-Sharing-Source/blob/Central/packages/contracts/contracts/ArtifactNFT.sol)
- **Application Context:** This contract is responsible for minting NFTs that represent artifacts within the platform. Each token encapsulates metadata detailing the artifact's attributes, provenance, and ownership history.
- **Execution Flow:** Initiation of the `mint` function within `ArtifactNFT.sol` generates a new token. This process involves specifying the token's metadata, which includes details about the artifact it represents. Once minted, these tokens can be transferred between addresses, representing changes in ownership or loans to exhibitions.

### Event Management and Governance System (EMGS)

- **Purpose:** Enables the platform to manage virtual exhibitions and engage stakeholders in democratic decision-making processes.
- **Key Contracts:** [`EventOrganizerService.sol`](https://github.com/bicos-io01/Revenue-Sharing-Source/blob/Central/packages/contracts/contracts/EventOrganizerService.sol)
- **Application Context:** Utilized to organize exhibits, manage stakeholder proposals, and facilitate consensus-driven decisions. It acts as the central controller, coordinating between different components of the platform.
- **Execution Flow:** Stakeholders submit proposals that have succesfully been voted on and have reached consensus **(100%)** via the `EventOrganizerService`, which facilitates the posting of exhibtions onto chain as well as the management of contract events for data aggregation via the [subgraph](https://github.com/bicos-io01/Revenue-Sharing-Source/tree/Central/packages/subgraph).

### Revenue and Escrow Management System (REMS)

- **Purpose:** Manages the secure holding and distribution of funds, ensuring equitable revenue sharing and trust in transactions.
- **Key Contracts:** [`EventEscrow.sol`](https://github.com/bicos-io01/Revenue-Sharing-Source/blob/Central/packages/contracts/contracts/EventEscrow.sol)
- **Interaction Script within Dapp:** [`eventEscrowComponent.tsx`](https://github.com/bicos-io01/Revenue-Sharing-Source/blob/Central/packages/dapp/src/functonality/eventEscrowComponent.tsx)
- **Application Context:** This contract holds funds in escrow for exhibitions

and distributes revenue according to predefined rules once certain conditions are met. It supports the platform's revenue sharing model by automating payouts to artifact owners, museums, and other stakeholders involved in an exhibition.
- **Execution Flow:** Upon the setup of an exhibition, funds from ticket sales or sponsorships are held by `EventEscrow.sol`. The contract then distributes these funds based on the outcomes of the exhibition—such as its success or adherence to agreed terms. Distribution parameters are predefined, ensuring transparency and fairness in revenue sharing among contributors.

### Ticketing and Exhibition Access System (TEAS)

- **Purpose:** Provides a mechanism for minting tickets as NFTs, facilitating access control to virtual exhibitions.
- **Key Contracts:** [`ExhibitNFT.sol`](https://github.com/bicos-io01/Revenue-Sharing-Source/blob/Central/packages/contracts/contracts/ExhibitNFT.sol)
- **Application Context:** `ExhibitNFT.sol` is pivotal for creating and managing access passes to virtual exhibitions. It mints NFT tickets, which grant holders the right to enter and participate in specific virtual exhibitions hosted on the platform.
- **Execution Flow:** When an exhibition is organized, `ExhibitNFT.sol` mints tickets as NFTs, which are then sold or distributed to attendees. These NFTs serve as verifiable proofs of purchase, allowing holders access to the exhibition. The contract ensures that each ticket is unique and tied to a specific event, enhancing security and providing a collectible aspect to exhibition participation.

### Museum and Artifact Indexing System (MAIS)

- **Purpose:** Manages the association of artifacts with owners and museums, indexing artifacts for easy discovery and verification of ownership.
- **Key Contracts:** [`Museum.sol`](https://github.com/bicos-io01/Revenue-Sharing-Source/blob/Central/packages/contracts/contracts/Museum.sol)
- **Interaction Script within Dapp:** [`ticketpurchasecomponent.tsx`](https://github.com/bicos-io01/Revenue-Sharing-Source/blob/Central/packages/dapp/src/functonality/ticketpurchasecomponent.tsx)
- **Application Context:** Facilitates the creation of digital representations for physical museums and galleries on the platform. It allows these entities to curate exhibitions, verify ownership of artifacts, and manage their collections digitally.
- **Execution Flow:** Museums use `Museum.sol` to register on the platform, create exhibitions, and list artifacts under their custody. The contract associates artifacts (represented by NFTs) with their respective museum or owner, creating a verifiable index of ownership and provenance. It also manages the process of ticket purchasing for events curated by museums, ensuring that funds are appropriately directed to the `EventEscrow` for revenue distribution.



## Development Tools and Scripts 🚀

The development environment utilizes Hardhat, with specific commands tailored for compiling, testing, deploying, and managing the smart contracts on the Sepolia network. The provided scripts ensure a streamlined workflow for developers:

```json
"scripts": {
  "test": "REPORT

_GAS=true hardhat test",
  "test:coverage": "hardhat coverage --solcoverjs ./.solcover.js --temp build/contracts --testfiles \"./test/*.ts\"",
  "build": "hardhat compile",
  "deploy:dev": "hardhat run --network sepolia scripts/deploy.ts",
  "configure:dev": "hardhat run --network sepolia scripts/configure.ts",
  "mock:dev": "hardhat run --network sepolia scripts/mock.ts"
}
```

## Gas Report (Sepolia)

The following gas report provides insights into the gas efficiency of key contract functions. It reflects the results under Solc version 0.8.20 with optimization enabled. 

For additional information please see contract [coverage](https://github.com/bicos-io01/Revenue-Sharing-Source/tree/Central/packages/contracts/coverage).
If contract coverage or any part of this readme is not up to date with latest RVS-m create an issue with a PR to update coverage and send an email to **summitshare.eth@gmail.com** with *'Documentation Update!* in the subject.

```
.. code-block:: shell

  ·---------------------------------------------------|---------------------------|-------------|-----------------------------·
  |               Solc version: 0.8.20                ·  Optimizer enabled: true  ·  Runs: 200  ·  Block limit: 30000000 gas  │
  ····················································|···························|·············|······························
  |  Methods                                          ·              100 gwei/gas               ·       3102.29 usd/eth       │
  ··························|·························|·············|·············|·············|···············|··············
  |  Contract               ·  Method                 ·  Min        ·  Max        ·  Avg        ·  # calls      ·  usd (avg)  │
  ··························|·························|·············|·············|·············|···············|··············
  |  ArtifactNFT            ·  mint                   ·          -  ·          -  ·     101833  ·            2  ·      31.59  │
  ··························|·························|·············|·············|·············|···············|··············
  |  Donations              ·  donate                 ·          -  ·          -  ·      69176  ·            2  ·      21.46  │
  ··························|·························|·············|·············|·············|···············|··············
  |  Donations              ·  updateWalletAddresses  ·          -  ·          -  ·      36137  ·            2  ·      11.21  │
  ··························|·························|·············|·············|·············|···············|··············
  |  EventEscrow            ·  distributePayments     ·          -  ·          -  ·      95793  ·            2  ·      29.72  │
  ··························|·························|·············|·············|·············|···············|··············
  |  EventOrganizerService  ·  organizeExhibit        ·    1786259  ·    1876680  ·    1821175  ·           13  ·     564.98  │
  ··························|·························|·············|·············|·············|···············|··············
  |  ExhibitNFT             ·  mintTicket             ·          -  ·          -  ·      97467  ·            5  ·      30.24  │
  ··························|·························|·············|·············|·············|···············|··············
  |  MUSDC                  ·  approve                ·      46347  ·      46383  ·      46369  ·           11  ·      14.39  │
  ··························|·························|·············|·············|·············|···············|··············
  |  MUSDC                  ·  transfer               ·      51632  ·      51644  ·      51637  ·            7  ·      16.02  │
  ··························|·························|·············|·············|·············|···············|··············
  |  Museum                 ·  curateExhibit          ·      32640  ·      49740  ·      47295  ·            7  ·      14.67  │
  ··························|·························|·············|·············|·············|···············|··············
  |  Museum                 ·  purchaseTicket         ·      93173  ·     149273  ·     123004  ·           13  ·      38.16  │
  ··························|·························|·············|·············|·············|···············|··············
  |  Deployments                                      ·                                         ·  % of limit   ·             │
  ····················································|·············|·············|·············|···············|··············
  |  ArtifactNFT                                      ·    1149394  ·    1149478  ·    1149441  ·        3.8 %  ·     356.59  │
  ····················································|·············|·············|·············|···············|··············
  |  Donations                                        ·          -  ·          -  ·     614059  ·          2 %  ·     190.50  │
  ····················································|·············|·············|·············|···············|··············
  |  EventEscrow                                      ·          -  ·          -  ·     495422  ·        1.7 %  ·     153.69  │
  ····················································|·············|·············|·············|···············|··············
  |  EventOrganizerService                            ·    4044400  ·    4044412  ·    4044410  ·       13.5 %  ·    1254.69  │
  ····················································|·············|·············|·············|···············|··············
  |  ExhibitNFT                                       ·          -  ·          -  ·    1410523  ·        4.7 %  ·     437.59  │
  ····················································|·············|·············|·············|···············|··············
  |  MUSDC                                            ·     553733  ·     553793  ·     553767  ·        1.8 %  ·     171.79  │
  ····················································|·············|·············|·············|···············|··············
  |  Museum                                           ·          -  ·          -  ·     603933  ·          2 %  ·     187.36  │
  ·---------------------------------------------------|-------------|-------------|-------------|---------------|-------------·
  ```