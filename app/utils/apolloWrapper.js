"use client";

import { ApolloProvider } from "@apollo/client";
import createApolloClient from "./apolloClient";

const client = createApolloClient();
export function ApolloWrapper({ children }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
