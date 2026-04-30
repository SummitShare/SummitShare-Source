---
title: Application Documentation Guidelines
tags: [Documentation]

---

This document outlines the structure and expectations for the documentation for contributors.







# Application Documentation Guidelines

This document outlines the structure and expectations for the documentation of the application. Documentation is essential for clarity, maintainability, and community engagement. It is organized into two primary layers: README files in each primary directory and documentation of core protocols.

## Primary Directories

Our application is structured into four primary directories, each with its unique focus and documentation requirements:

1. **Main**
2. **Dapp**
3. **Contracts**
4. **Subgraph**

### Documentation Layers

1. **README Files:** Each primary directory must have its README file detailing the directory's purpose, structure, and key components.
2. **Core Protocols Documentation:** Defined as any component or system that can be worked on by both the main development team and the community. This includes both high-level overviews and technical details.

## README.md Expectations

### Main Directory

- **Problem Definition:** Clearly state the problem your application aims to solve.
- **Aims and Goals:** Outline the objectives and expected outcomes of your codebase.
- **Functionality Overview:** Provide a summary of the current functionalities and the technologies that work together. Include both a general overview outside the context of the application and how these technologies are integrated within it.
- **Overall Architecture:** Describe the application's overall architecture, including key technologies like `pnpm`, `TypeScript`, `Next.js`, etc.

### Dapp Directory

- **Frontend Breakdown:** Describe the front end's capabilities, architecture, and key scripts and APIs.
- **Development Commands:** Include commands to run the development server.
- **File Hierarchy:** Document the file hierarchy for front-end components and backend/contract interaction scripts.
- **Component Categories:** Define front-end component categories based on the platform's processes (e.g., Landing Page, Help and Info, Admin Dashboard, User Dashboard).

### Contracts Directory

- **Architecture:** Describe the contracts' architecture, including libraries used and execution order.
- **Functionality:** Define generalized pieces such as escrow management, revenue distribution, tokenization, and attestation.
- **Development Tools:** List Hardhat commands and include a gas report.

### Subgraph Directory

- **Manifest Breakdown:** Provide details on the manifest structure.
- **Interactions:** Describe how the subgraph interacts with Apollo, the front end, and contract events.
- **Resources:** Include The Graph link for easy access.

## Code Documentation Expectations

Code documentation should be thorough and categorized as follows:

- Front-end components
- Back-end core scripts
- Contract interaction scripts
- Schemas
- Smart Contracts

### Documentation Guidelines

- **Component Category and Purpose:** At the beginning of each file, indicate the component's category and purpose using a structured comment. For example:

```plaintext
<----------- Category -> Admin Dashboard --- - --- Purpose -> Revenue Distribution ----->
```
- **Function Level Documentation:** Each function should have a concise comment above it, describing what it does in a single line.

```javascript
// Signs in the user, redirects to the signIn page, logs the path
const handleClickSignIn = () => {
  router.push("/auth/signIn");
  console.log(path);
}
```