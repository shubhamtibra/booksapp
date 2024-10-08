import Author from "@/models/authors";
import Book from "@/models/books";
import Link from "next/link";
import { RxAvatar } from "react-icons/rx";
import { Op } from "sequelize";
import AuthorItem from "../components/AuthorItem";
import BookItem from "../components/BookItem";
import EntriesPerPageDropdown from "../components/entriesPerPage";
import Pagination from "../components/Pagination";
import SearchForm from "../components/SearchForm";
import { validateImageUrl } from "../utils/imageValidator";
import { getPaginationParams } from "../utils/pagination";
import CreateAuthorForm from "./CreateAuthorForm";

export default async function ServerAuthorsComponent({ params, searchParams }) {
  const { page, size, searchTerm } = getPaginationParams(searchParams);
  let data = [];
  const offset = page * size;
  const where = searchTerm
    ? {
        name: {
          [Op.iLike]: `%${searchTerm}%`,
        },
      }
    : {};

  const { rows, count } = await Author.findAndCountAll({
    where,
    limit: size,
    offset: offset,
    include: [Book],
    distinct: true,
  });

  const validatedAuthors = await Promise.all(
    rows.map(async (author) => ({
      ...author.toJSON(),
      profilePhotoUrl: await validateImageUrl(author.profilePhotoUrl, "author"),
      Books: await Promise.all(
        author.Books.map(async (book) => ({
          ...book.toJSON(),
          profilePhotoUrl: await validateImageUrl(book.profilePhotoUrl, "book"),
        }))
      ),
    }))
  );

  data = validatedAuthors;
  const totalPages = Math.ceil(count / size);
  const hasEntries = rows.length > 0;

  return (
    <>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-dark-primary">
          Authors and Their Books
        </h1>
        <div className="flex flex-col justify-center items-center gap-8 mb-8">
          <div className="w-1/2">
            <SearchForm placeholder="Search Authors" />
          </div>
          <div className="w-1/2">
            <CreateAuthorForm />
          </div>
        </div>
        <div className="flex items-center justify-end gap-4 mb-4">
          <EntriesPerPageDropdown currentSize={size} />
          {hasEntries && (
            <div className="text-dark-foreground">
              Showing {offset + 1} to {Math.min(offset + size, count)} of{" "}
              {count} entries
            </div>
          )}
        </div>

        <table className="w-full border-collapse mb-8">
          <thead>
            <tr>
              <th className="bg-dark-primary text-dark-foreground font-bold text-left p-4">
                Author
              </th>
              <th className="bg-dark-primary text-dark-foreground font-bold text-left p-4">
                Books
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((author) => (
              <tr key={author.id} className="border-b border-dark-secondary">
                <td className="p-4">
                  <Link
                    href={`/authors/${author.id}`}
                    className="block hover:bg-dark-secondary rounded transition-all duration-200 transform hover:scale-105 cursor-pointer"
                  >
                    <AuthorItem
                      name={author.name}
                      biography={author.biography}
                      profilePhotoUrl={author.profilePhotoUrl}
                      date_of_birth={author.date_of_birth}
                    />
                  </Link>
                </td>
                <td className="p-4">
                  {author.Books.map((book) => (
                    <Link
                      key={book.id}
                      href={`/books/${book.id}`}
                      className="block hover:bg-dark-secondary rounded transition-all duration-200 transform hover:scale-105 cursor-pointer mb-2"
                    >
                      <BookItem
                        title={book.title}
                        description={book.description}
                        profilePhotoUrl={book.profilePhotoUrl}
                        publishedAt={book.publishedAt}
                        reviews={book.reviews}
                      />
                    </Link>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!hasEntries && (
        <div className="flex flex-col items-center justify-center h-64">
          <RxAvatar className="text-6xl text-dark-primary mb-4" />
          <p className="text-xl text-dark-foreground">
            No authors found on this page
          </p>
        </div>
      )}
      {count > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          baseUrl="/authors"
          searchParams={searchParams}
        />
      )}
    </>
  );
}
