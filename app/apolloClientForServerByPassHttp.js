import { ApolloClient, InMemoryCache } from '@apollo/client'
import { SchemaLink } from '@apollo/client/link/schema';
import typeDefs from './api/schema'

// ...

const client = new ApolloClient({
  ssrMode: true,
  link: new SchemaLink({ typeDefs }),
  cache: new InMemoryCache(),
});
export default client