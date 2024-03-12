# Subgraph README

## Overview

The SummitShare Subgraph plays a pivotal role in the platform's ecosystem, acting as a bridge between the blockchain and the application's frontend. It aggregates and indexes data emitted by smart contract events, storing this information in a Graph database. This setup allows for efficient, queryable access to data, which is essential for rendering frontend components and enabling seamless contract functionality.

### Role in the Application

- **Data Aggregation**: The subgraph listens for specific events emitted by SummitShare's smart contracts, capturing essential data points related to artifacts, exhibitions, escrow transactions, and more.
- **Frontend Integration**: Through GraphQL queries powered by Apollo Client, the frontend can dynamically fetch data, ensuring users have access to the latest information and interactions within the platform.
- **Contract Functionality Support**: By providing a comprehensive view of transaction histories, artifact statuses, and user interactions, the subgraph aids in the logic and decision-making processes of smart contracts.

## Development Workflow with pnpm Commands 💻

Given the project's use of `pnpm` for package management, here are the key commands for managing the subgraph development lifecycle:

### Setup

Ensure all dependencies are installed:

```bash
pnpm install
```

### Code Generation

Generate AssemblyScript types from smart contract ABIs and GraphQL schema:

```bash
pnpm run codegen
```

### Build

Compile the subgraph and prepare it for deployment:

```bash
pnpm run build
```

### Deploy

Deploy the subgraph to The Graph's hosted service for public access:

```bash
pnpm run deploy:dev
```

### Local Development

For testing and local development (ensure a local Graph Node instance is running):

Initialize the subgraph on a local Graph Node:

```bash
pnpm run create-local
```

Deploy the subgraph to a local Graph Node:

```bash
pnpm run deploy-local
```

## Hosted Service Website

Explore and interact with the SummitShare Subgraph on The Graph's hosted service:

- [SummitShare Subgraph](https://thegraph.com/hosted-service/subgraph/daodesigner/revenue-sharing-source)

This link provides direct access to the subgraph, offering tools for querying data, exploring the schema, and more.

## Manifest and Resources

The `subgraph.yaml` manifest file is the heart of the subgraph's configuration, specifying the smart contracts of interest, the events to listen for, and how these events map to entities in the GraphQL schema.

### Key Components:

- **Data Sources**: Define the smart contracts the subgraph indexes, including addresses, ABIs, and starting blocks.
- **Entities**: Represent the data structures stored by the subgraph, derived from events and function calls.
- **Event Handlers**: Specify the logic for transforming blockchain events into stored entities.