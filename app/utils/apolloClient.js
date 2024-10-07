import { ApolloClient, InMemoryCache } from "@apollo/client";

const createApolloClient = () => {
  return new ApolloClient({
    uri: "/api",
    cache: new InMemoryCache(),
  });
};
const client = createApolloClient();
export default createApolloClient;
