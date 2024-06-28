import { HttpLink, from } from '@apollo/client';
import {
  InMemoryCache,
  ApolloClient,
} from '@apollo/experimental-nextjs-app-support';
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support';
import { onError } from './apolloErrorHandler';

// apolloErrorHandler
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      });
    }

    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }

    return forward(operation);
  }
);

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: from([
      errorLink,
      new HttpLink({
        uri: 'https://api.studio.thegraph.com/query/76738/summitshare-dev/version/latest',
      }),
    ]),
  });
});
