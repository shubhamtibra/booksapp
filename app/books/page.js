import Author from "@/models/authors";
import Book from "@/models/books";
import Link from "next/link";
import { Op } from "sequelize";
import AuthorItem from "../components/AuthorItem";
import BookItem from "../components/BookItem";
import Pagination from "../components/Pagination";
import SearchForm from "../components/SearchForm";
import { validateImageUrl } from "../utils/imageValidator";
import { getPaginationParams } from "../utils/pagination";
import CreateBookForm from "./CreateBookForm";

export default async function ServerBooksComponent({ params, searchParams }) {
  const { page, size, searchTerm } = getPaginationParams(searchParams);
  let data = [];
  const offset = page * size;
  const where = searchTerm
    ? {
        title: {
          [Op.like]: `%${searchTerm}%`,
        },
      }
    : {};

  const { rows, count } = await Book.findAndCountAll({
    where,
    limit: size,
    offset: offset,
    include: [Author],
  });

  const validatedBooks = await Promise.all(
    rows.map(async (book) => ({
      ...book.toJSON(),
      profilePhotoUrl: await validateImageUrl(book.profilePhotoUrl, "book"),
      Author: {
        ...book.Author.toJSON(),
        profilePhotoUrl: await validateImageUrl(
          book.Author.profilePhotoUrl,
          "author"
        ),
      },
    }))
  );

  data = validatedBooks;

  return (
    <>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-dark-primary">
          Books and Authors
        </h1>
        <div className="flex flex-col justify-center items-center gap-8 mb-8">
          <div className="w-1/2">
            <SearchForm placeholder="Search Books" />
          </div>
          <div className="w-1/2">
            <CreateBookForm />
          </div>
        </div>

        <table className="w-full border-collapse mb-8">
          <thead>
            <tr>
              <th className="bg-dark-primary text-dark-foreground font-bold text-left p-4">
                Book
              </th>
              <th className="bg-dark-primary text-dark-foreground font-bold text-left p-4">
                Author
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((book) => (
              <tr key={book.id} className="border-b border-dark-secondary">
                <td className="p-4">
                  <Link
                    href={`/books/${book.id}`}
                    className="block hover:bg-dark-secondary rounded transition-all duration-200 transform hover:scale-105 cursor-pointer"
                  >
                    <BookItem
                      title={book.title}
                      description={book.description}
                      profilePhotoUrl={book.profilePhotoUrl}
                      publishedAt={book.publishedAt}
                    />
                  </Link>
                </td>
                <td className="p-4">
                  {book.Author && (
                    <Link
                      href={`/authors/${book.Author.id}`}
                      className="block hover:bg-dark-secondary rounded transition-all duration-200 transform hover:scale-105 cursor-pointer"
                    >
                      <AuthorItem
                        name={book.Author.name}
                        biography={book.Author.biography}
                        profilePhotoUrl={book.Author.profilePhotoUrl}
                        date_of_birth={book.Author.date_of_birth}
                      />
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination />
    </>
  );
}
