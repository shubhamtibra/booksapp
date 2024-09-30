"use client";

import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, createHttpLink, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  ssrMode: true,
  link: createHttpLink({
    uri: '/api',
  }),
  cache: new InMemoryCache(),
});
const context = {};
export default function ClientComponentApolloProviderForSSROfficialDocs({children}) {
    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
  );
}
