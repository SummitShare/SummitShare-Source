# Dapp 'lib' Directory README

## Overview

The 'lib' directory within the Dapp houses essential Apollo React hooks and utility functions that facilitate seamless data querying from the SummitShare subgraph to the frontend. These components play a pivotal role in fetching and displaying data for various front-end components and ensuring smooth contract functionality through the Apollo client setup.

### Apollo React Hooks 🪝

The directory includes custom hooks that leverage Apollo Client's `useQuery` and `useMutation` to interact with the GraphQL API provided by the SummitShare subgraph. These hooks abstract query logic for reuse across components, streamlining data fetching processes.

-  [**`useGetExhibitById.tsx`**](https://github.com/bicos-io01/Revenue-Sharing-Source/blob/Central/packages/dapp/src/lib/useGetExhibitById.tsx): Fetches exhibit details by ID, including collections, ticket prices, and exhibit metadata.
-  [**`useGetRecentExhibits.tsx`**](https://github.com/bicos-io01/Revenue-Sharing-Source/blob/Central/packages/dapp/src/lib/useGetRecentExhibits.tsx): Retrieves a list of the most recent exhibits, showcasing them on the platform's landing page or dashboard.
-  [**`useSearch.tsx`**](https://github.com/bicos-io01/Revenue-Sharing-Source/blob/Central/packages/dapp/src/lib/useSearch.tsx): Powers the search functionality, allowing users to find exhibits based on keywords.

### Utility Functions and Apollo Client Setup 🛠️

-  [**`utils.ts`**](https://github.com/bicos-io01/Revenue-Sharing-Source/blob/Central/packages/dapp/src/lib/utils.ts): Provides utility functions, such as `cn` for class name merging using `clsx` and `tailwind-merge`, enhancing the DX (Developer Experience) by simplifying dynamic class name computations.
-  [**`client.tsx`**](https://github.com/bicos-io01/Revenue-Sharing-Source/blob/Central/packages/dapp/src/lib/client.tsx): Configures the Apollo Client specific to Next.js environments, including SSR (Server-Side Rendering) support, and registers the client for use within the Next.js application.
-  [**`apolloErrorHandler.ts`**](https://github.com/bicos-io01/Revenue-Sharing-Source/blob/Central/packages/dapp/src/lib/apolloErrorHandler.ts): Contains a custom error handling setup for Apollo Client, which logs GraphQL and network errors to the console, ensuring that errors are properly managed and debugged during development.

### File Hierarchy 🗂️

The directory is structured to separate concerns between data fetching (hooks), client setup, and utility functions, ensuring clarity and maintainability:

-  **Hooks**: Custom React hooks for querying the subgraph (`useGetExhibitById.tsx`, `useGetRecentExhibits.tsx`, `useSearch.tsx`)
-  **Apollo Setup**: Configuration and utilities for Apollo Client (`client.tsx`, `apolloErrorHandler.ts`)
-  **Utilities**: General utility functions for the frontend (`utils.ts`)
