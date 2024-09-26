import Author from "@/models/authors";
import DataLoader from "dataloader";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { gql } from "graphql-tag";
const Book = require("../../models/books");
const { Op } = require("sequelize");
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
  return author_ids.map((author_id) =>
    author_id in authorIdToBook ? authorIdToBook[author_id] : []
  );
});

const resolvers = {
  Query: {
    books: async () => {
      return await Book.findAll();
    },
    authors: async () => {
      return await Author.findAll();
    },
    book: async (parent, args, context, info) => {
      return Book.findByPk(args.id);
    },
    author: async (parent, args, context, info) => {
      return Author.findByPk(args.id);
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
  Mutation: {
    addBook: async (parent, args, context, info) => {
      return await Book.create(args, { returning: true });
    },
    addAuthor: async (parent, args, context, info) => {
      return await Author.create(args, { returning: true });
    },
    updateBook: async (parent, args, context, info) => {
      return (
        await Book.update(args, {
          where: { id: args.id },
          returning: true,
        })
      )[1][0];
    },
    updateAuthor: async (parent, args, context, info) => {
      try {
        let result = await Author.update(args, {
          where: { id: args.id },
          returning: true,
        });
        return result[1][0];
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    deleteBook: async (parent, args, context, info) => {
      return await Book.destroy({ where: { id: args.id }, returning: true });
    },
    deleteAuthor: async (parent, args, context, info) => {
      return await Author.destroy({ where: { id: args.id } });
    },
  },
};

const server = new ApolloServer({
  resolvers,
  typeDefs,
});

const handler = startServerAndCreateNextHandler(server);
export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
