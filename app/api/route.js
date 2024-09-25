import Author from "@/models/authors";
import DataLoader from "dataloader";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { gql } from "graphql-tag";
const Book = require("../../models/books");
const { Op } = require("sequelize");
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

const batchAuthors = new DataLoader(async (author_ids) => {
  const authorsList = await Author.findAll({
    where: {
      id: {
        [Op.in]: author_ids,
      },
    },
  });
  // Dataloader expects you to return a list with the results ordered just like the list in the arguments were
  // Since the database might return the results in a different order the following code sorts the results accordingly
  const idToAuthor = authorsList.reduce((mapping, author) => {
    mapping[author.id] = author;
    return mapping;
  }, {});
  return author_ids.map((id) => idToAuthor[id]);
});

const batchBooks = new DataLoader(async (author_ids) => {
  const booksList = await Book.findAll({
    where: {
      author_id: {
        [Op.in]: author_ids,
      },
    },
  });
  // Dataloader expects you to return a list with the results ordered just like the list in the arguments were
  // Since the database might return the results in a different order the following code sorts the results accordingly
  const authorIdToBook = booksList.reduce((mapping, book) => {
    if (book.author_id in mapping) {
      mapping[book.author_id].push(book);
    } else {
      mapping[book.author_id] = [book];
    }
    return mapping;
  }, {});
  return author_ids.map((author_id) => authorIdToBook[author_id]);
});

const resolvers = {
  Query: {
    books: async () => {
      return await Book.findAll();
    },
    authors: async () => {
      return await Author.findAll();
    },
  },
  Book: {
    author: async (parent, args, context, info) => {
      return batchAuthors.load(parent.author_id);
    },
  },
  Author: {
    books: async (parent, args, context, info) => {
      return batchBooks.load(parent.id);
    },
  },
};

const server = new ApolloServer({
  resolvers,
  typeDefs,
});

const handler = startServerAndCreateNextHandler(server);
export { handler as GET, handler as POST };
