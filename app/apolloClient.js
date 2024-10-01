import { ApolloClient, InMemoryCache } from "@apollo/client";

const createApolloClient = () => {
  return new ApolloClient({
    uri: "http://localhost:3000/api",
    cache: new InMemoryCache(),
  });
};
const client = createApolloClient();
export default createApolloClient;
