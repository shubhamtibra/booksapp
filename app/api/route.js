import Author from "@/models/authors";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import DataLoader from "dataloader";
import { gql } from "graphql-tag";
import moment from "moment/moment";
import { validateImageUrl } from "../utils/imageValidator";
const Book = require("../../models/books");
const { Op } = require("sequelize");

const typeDefs = gql`
  type Book {
    id: Int!
    title: String!
    description: String!
    publishedAt: String!
    profilePhotoUrl: String
    author: Author!
    author_id: Int!
    reviews: [Review]
  }

  type Review {
    rating: Int!
    comment: String
  }

  type Author {
    id: Int!
    name: String!
    biography: String!
    profilePhotoUrl: String
    books: [Book]
    date_of_birth: String!
  }

  type BookConnection {
    books: [Book!]!
    totalCount: Int!
    hasMore: Boolean!
  }

  type AuthorConnection {
    authors: [Author!]!
    totalCount: Int!
    hasMore: Boolean!
  }

  type Query {
    book(id: Int!): Book
    books(page: Int, size: Int, searchTitle: String): BookConnection!
    author(id: Int!): Author
    authors(page: Int, size: Int, searchName: String): AuthorConnection!
    allAuthors: [Author!]!
  }
  type Mutation {
    addBook(
      title: String!
      description: String!
      author_id: Int!
      profilePhotoUrl: String
      publishedAt: String!
    ): Book
    addAuthor(
      name: String!
      biography: String!
      profilePhotoUrl: String
      date_of_birth: String!
    ): Author
    updateBook(
      id: Int!
      title: String
      description: String
      publishedAt: String
      author_id: Int
      profilePhotoUrl: String
    ): Book
    updateAuthor(
      id: Int!
      name: String
      biography: String
      date_of_birth: String
      profilePhotoUrl: String
    ): Author
    deleteBook(id: Int!): Int
    deleteAuthor(id: Int!): Int
    addReview(bookId: Int!, rating: Int!, comment: String): Book
  }
`;

const batchAuthors = new DataLoader(async (author_ids) => {
  let authorsList = await Author.findAll({
    where: {
      id: {
        [Op.in]: author_ids,
      },
    },
  });
  authorsList = Promise.all(
    authorsList.map(async (author) => {
      return {
        ...author.toJSON(),
        profilePhotoUrl: await validateImageUrl(
          author.profilePhotoUrl,
          "author"
        ),
      };
    })
  );
  const idToAuthor = authorsList.reduce((mapping, author) => {
    mapping[author.id] = author;
    return mapping;
  }, {});
  return author_ids.map((id) => idToAuthor[id]);
});

const batchBooks = new DataLoader(async (author_ids) => {
  let booksList = await Book.findAll({
    where: {
      author_id: {
        [Op.in]: author_ids,
      },
    },
  });
  booksList = Promise.all(
    booksList.map(async (book) => {
      return {
        ...book.toJSON(),

        profilePhotoUrl: await validateImageUrl(book.profilePhotoUrl, "book"),
      };
    })
  );
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
    books: async (_, { page = 0, size = 5, searchTitle = null }) => {
      const offset = page * size;
      const where = searchTitle
        ? {
            title: {
              [Op.iLike]: `%${searchTitle}%`,
            },
          }
        : {};

      const { rows, count } = await Book.findAndCountAll({
        where,
        limit: size,
        offset: offset,
      });

      const validatedBooks = await Promise.all(
        rows.map(async (book) => ({
          ...book.toJSON(),
          profilePhotoUrl: await validateImageUrl(book.profilePhotoUrl, "book"),
        }))
      );

      return {
        books: validatedBooks,
        totalCount: count,
        hasMore: offset + rows.length < count,
      };
    },
    authors: async (_, { page = 0, size = 5, searchName = null }) => {
      const offset = page * size;
      const where = searchName
        ? {
            name: {
              [Op.iLike]: `%${searchName}%`,
            },
          }
        : {};

      const { rows, count } = await Author.findAndCountAll({
        where,
        limit: size,
        offset: offset,
      });

      const validatedAuthors = await Promise.all(
        rows.map(async (author) => ({
          ...author.toJSON(),
          profilePhotoUrl: await validateImageUrl(
            author.profilePhotoUrl,
            "author"
          ),
        }))
      );

      return {
        authors: validatedAuthors,
        totalCount: count,
        hasMore: offset + rows.length < count,
      };
    },
    book: async (parent, { id }, context, info) => {
      const book = await Book.findByPk(id);
      if (!book) {
        throw new Error("Book not found");
      }
      return book;
    },
    author: async (parent, args, context, info) => {
      return Author.findByPk(args.id);
    },
    allAuthors: async () => {
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
  Mutation: {
    addBook: async (parent, args, context, info) => {
      return await Book.create(args, { returning: true });
    },
    addAuthor: async (parent, args, context, info) => {
      const result = await Author.create(args, { returning: true });
      return result;
    },
    updateBook: async (parent, args, context, info) => {
      if (args.publishedAt) {
        args.publishedAt = moment(args.publishedAt);
      }
      return (
        await Book.update(args, {
          where: { id: args.id },
          returning: true,
        })
      )[1][0];
    },
    updateAuthor: async (parent, args, context, info) => {
      try {
        if (args.date_of_birth) {
          args.date_of_birth = moment(args.date_of_birth);
        }
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
    addReview: async (_, { bookId, rating, comment }) => {
      try {
        const book = await Book.findByPk(bookId);
        if (!book) {
          throw new Error("Book not found");
        }
        const reviews = book.toJSON().reviews || [];
        reviews.push({ rating, comment });
        await book.update({ reviews });
        return book;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
  },
};

const server = new ApolloServer({
  resolvers,
  typeDefs,
});

const handler = startServerAndCreateNextHandler(server);
export { handler as DELETE, handler as GET, handler as POST, handler as PUT };
