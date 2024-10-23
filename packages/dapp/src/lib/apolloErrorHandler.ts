import { onError } from '@apollo/client/link/error';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { from } from '@apollo/client/core';

// Creating an error handling link.
// This link intercepts every GraphQL operation and allows custom error handling.
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        // Additional error handling logic can be added here.
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      });
    }

    // Handling network errors (like issues with the internet connection)
    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }

    // Forward the operation to the next link in the middleware chain
    return forward(operation);
  }
);

const httpLink = new HttpLink({
  uri: 'https://api.studio.thegraph.com/query/76738/summitshare-dev/version/latest',
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([errorLink, httpLink]), // Include the errorLink here
});

export { onError };
