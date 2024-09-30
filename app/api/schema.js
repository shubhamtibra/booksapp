
  import {gql} from "@apollo/client";
  
const typeDefs = gql`
  type Book {
    id: Int!
    title: String!
    description: String!
    publishedAt: String!
    author: Author!
    author_id: Int!
  }

  type Author {
    id: Int!
    name: String!
    biography: String!
    books: [Book]
    date_of_birth: String!
  }

  type Query {
    book(id: Int!): Book
    books: [Book!]!
    author(id: Int!): Author
    authors: [Author!]!
  }
  type Mutation {
    addBook(title: String!, description: String!, author_id: Int!): Book
    addAuthor(name: String!, biography: String!): Author
    updateBook(
      id: Int!
      title: String
      description: String
      publishedAt: String
      author_id: Int
    ): Book
    updateAuthor(
      id: Int!
      name: String
      biography: String
      date_of_birth: String
    ): Author
    deleteBook(id: Int!): Int
    deleteAuthor(id: Int!): Int
  }
`;
export default typeDefs;
