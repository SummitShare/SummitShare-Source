# SummitShare: A Digital Repatriation Solution
**Follow** [SummitShare](https://twitter.com/summitshare_zm) on X/Twitter for the latest updates and discussions.
[**Email**](mailto:summitshare.eth@gmail.com) the building team for collaborations, PRs, issues, bugs, etc. 


## Introduction

**SummitShare** stands as a pioneering digital platform dedicated to the repatriation of African cultural artifacts. Bridging the past and present, it serves as a beacon of hope and a testament to the resilience of African heritage, utilizing the power of blockchain technology to reclaim, celebrate, and share the rich tapestry of Africa's history with the world.

## The Problem

The quest for repatriation is not merely a logistical challenge; it's a moral imperative rooted in a profound need to restore dignity, acknowledge historical injustices, and reconnect African communities with their cultural identity. The dispersion of artifacts across global institutions, a legacy of colonialism and historical injustices, represents a deep cultural void and a fragmented heritage longing for reclamation.


At the heart of repatriation lies a poignant quest by African communities to reclaim the fragments of their rich tapestry of heritage, scattered across the globe in silent museums and private collections. This endeavor transcends mere logistical challenges, delving deep into the realms of cultural identity, memory, and the quest for historical justice. It’s akin to gathering the scattered leaves of a manuscript, each leaf a story, a piece of soul, yearning to be whole again.

## The Journey Thus Far
The path of repatriation is strewn with legal conundrums and diplomatic labyrinths. While steps like Germany's pledge to return the Benin Bronzes and France's initiatives offer glimmers of progress, the journey is akin to navigating a complex maze with the treasure – the rightful restoration of artifacts – often just out of reach. The discourse teeters between possession and moral duty, each step a delicate dance on the tightrope of international relations and ethical responsibility.

## Aims and Goals

SummitShare aims to establish a decentralized, comprehensive platform for digital repatriation. Its goals are multifaceted, focusing on:
- Creating a blockchain-based repository for African artifacts and their histories.
- Facilitating global access to African cultural heritage, transcending physical and geographical limitations.
- Advocating for and contributing to the physical repatriation efforts through digital means.
- Enabling economic benefits to flow back to the communities of origin, fostering economic justice and empowerment.

## System Architecture

The SummitShare platform integrates the following key technologies and components:

- **Token Management System (TMS):** Digitizes and manages artifacts as digital tokens, ensuring authenticity and provenance.
- **Consensus-Driven Decision Making (CDDM):** Empowers community governance and transparent decision-making.
- **Revenue Distribution Protocol (RDP):** Guarantees equitable sharing of revenues among stakeholders.
- **Digital Escrow Service (DES):** Ensures secure transactions and compliance with agreements.

The technological stack includes `Next.js` for robust web application development, `TypeScript` for type-safe code, `Solidity` for smart contract creation, `Hardhat` for smart contract deployment, `ether.js` for backend blockchain interactions, `React` for dynamic UIs, and `pnpm` for efficient package management.

## Repository Breakdown 📂

The SummitShare repository is meticulously organized into three main directories, each representing a core component of the platform's infrastructure:

### [`dapp/`](https://github.com/bicos-io01/Revenue-Sharing-Source/tree/Central/packages/dapp) - The Frontend Application 🌐
This directory contains the Next.js-based frontend application of the platform, crafted with TypeScript for type-safe code and `pnpm` for package management. It encompasses the React user interface, providing a dynamic and engaging experience for general users and exhibit creators alike. The `dapp/` directory is split into various subdirectories for components, pages, utilities, API interactions, and more, ensuring a modular and maintainable codebase.

- **Components**: The React components used across the application for various user interfaces.
- **Pages**: The application's pages constructed using Next.js's file-based routing system.
- **Utils**: Includes utilities for connecting to Ethereum wallets, handling contracts, and interacting with the subgraph.

### [`subgraph/`](https://github.com/bicos-io01/Revenue-Sharing-Source/tree/Central/packages/subgraph) - The Data Indexing Layer 📈
Housing the GraphQL schema and manifest for The Graph, the `subgraph/` directory is responsible for indexing blockchain data to support efficient data queries. It serves as a bridge between smart contract events and the frontend, enabling quick and reliable data retrieval for user interfaces and backend processing.

- **Schema**: Defines the GraphQL entities and their relationships.
- **Manifest**: Configures the data sources, entities, and mappings needed for indexing the smart contract events.

### [`contracts/`](https://github.com/bicos-io01/Revenue-Sharing-Source/tree/Central/packages/contracts) - Smart Contract Codebase) ⚙️
The smart contracts of SummitShare(RVS-m) are contained within this directory, including the Solidity code for the various contracts that power the platform's features. Here, you'll find the contracts for managing exhibits, revenue distribution, tokenization of

artifacts, and stakeholder governance.

- **Artifact Management**: Smart contracts related to the tokenization and management of digital artifacts.
- **Exhibit Management**: Contracts that handle the creation and administration of virtual and physical exhibitions.
- **Revenue Distribution**: Contains the logic for equitable revenue sharing among stakeholders using smart contracts.
- **Governance**: Contracts that enable consensus-driven decision-making for exhibit proposals and other platform governance matters.


## Functionality Overview

SummitShare is not merely a platform; it's a holistic ecosystem designed to honor and revitalize African cultural heritage through several core functionalities:

- **Digital Registry:** Utilizes blockchain technology to create a transparent and immutable ledger, recording each artifact's history and provenance.
- **Virtual Exhibitions:** Offers immersive digital spaces for interactive exploration of African heritage, bringing artifacts to life through detailed histories and narratives.
- **Community Engagement:** Provides tools for community contributions, facilitating discussions, research, and collaborative curation of cultural content.
- **Revenue Sharing and Governance:** Implements mechanisms for fair revenue distribution and democratic governance, allowing community-driven decisions and benefit sharing.

### The Application's Journey

The SummitShare experience begins with the creation of virtual and physical exhibitions aimed at distributing revenue to causes related to repatriation and highlighting digital collections. Leveraging virtual reality spaces and ERC-721 tokens, it enriches artifacts with comprehensive histories and narratives. Stakeholder consensus drives the exhibition approval process, ensuring that all parties—museums, galleries, communities, and institutions—participate in the governance and revenue distribution derived from these digital endeavors.

## The Dual Faces of SummitShare

SummitShare embodies both a project and a platform, intertwining digital and tangible realms to reclaim and celebrate African heritage. It represents a fusion of technology and culture, where digital repatriation acts as both a supplement to physical efforts and a standalone avenue for cultural preservation and education. The platform's architecture and functionalities are designed not just for artifact preservation but for fostering a deep, global connection to African heritage.



As SummitShare unfolds, it stands as a testament to the resilience of culture, the power of technology, and the unyielding spirit of communities striving to reclaim their heritage. It’s not just a platform;

it's a beacon of hope, a bridge spanning across time, connecting the past, present, and future in a continuous dialogue of cultural reclamation and celebration.

SummitShare is both a guardian of history and a harbinger of a future where every artifact reclaimed, every story retold, fortifies the fabric of African heritage. It's a sanctuary where the digital and tangible blend, creating a mosaic of African cultures that resonates across the digital expanse, inviting the world to partake in its rich legacy.

Through the tapestry of SummitShare, the whispers of ancestors find voice in the digital age, ensuring that the legacy of African civilizations is not just preserved but flourishes, inspiring generations to come. In this digital agora, heritage transcends borders, becoming a global treasure that enlightens, educates, and empowers.

SummitShare isn't just about reclaiming artifacts; it is about igniting the spirit of community, restoring honor to cultures past, and reshaping the narratives of history. Emblematic of unity and the pioneering use of technology, the platform forges a pathway through historical divides, transforming the digital landscape into an arena of cultural renaissance and jubilation. Critically, it introduces a digital mechanism for economic restitution, channeling financial benefits back to the diverse individuals, regions, and communities from which these cultural treasures originate. This project serves not only as a repository for artifacts but as a digital vessel for economic restoration, creating a new symbol of equity and empowerment for the people whose heritage it celebrates.

As SummitShare continues to evolve, it stands as a beacon, illuminating the path toward a future where digital repatriation not only complements physical efforts but paves new avenues for cultural preservation, understanding, and shared heritage. It is a call to action, a call to unity, and a call to celebrate the indomitable spirit of Africa and its people, ensuring that their stories echo through the ages, preserved in the annals of digital eternity.
