import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { gql } from "graphql-tag";
const Book = require("../../models/books");
const typeDefs = gql`
  type Book {
    title: String!
    description: String!
    publishedAt: String!
    author: Author!
  }

  type Author {
    name: String!
    biography: String!
    books: [Book!]!
    dateOfBirth: String!
  }

  type Query {
    book: Book
    books: [Book!]!
    author: Author
    authors: [Author!]!
  }
`;
const resolvers = {
  Query: {
    books: async () => {
      return await Book.findAll();
    },
  },
};

const server = new ApolloServer({
  resolvers,
  typeDefs,
});

const handler = startServerAndCreateNextHandler(server);
export { handler as GET, handler as POST };
