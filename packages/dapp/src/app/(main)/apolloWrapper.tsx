'use client';
import { ApolloLink, HttpLink } from '@apollo/client';
import {
  ApolloNextAppProvider,
  InMemoryCache,
  ApolloClient,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support';

function makeClient() {
  const httpLink = new HttpLink({
    uri: 'https://api.studio.thegraph.com/query/76738/summitshare-dev/version/latest',
    fetchOptions: { cache: 'no-store' },
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link:
      typeof window === 'undefined'
        ? ApolloLink.from([
            new SSRMultipartLink({ stripDefer: true }),
            httpLink,
          ])
        : httpLink,
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
