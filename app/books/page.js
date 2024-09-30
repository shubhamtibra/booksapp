import Author from "@/models/authors";
import Book from "@/models/books";
import Link from "next/link";
import { Op } from "sequelize";
import Pagination from "../components/Pagination";
import SearchForm from "../components/SearchForm";
import styles from "../styles/shared.module.css";
import { getPaginationParams } from "../utils/pagination";
import bookStyles from "./books.module.css";
import CreateBookForm from "./CreateBookForm";

export default async function ServerBooksComponent({ params, searchParams }) {
  const { page, size } = getPaginationParams(searchParams);
  let data = [];
  if (searchParams && "search" in searchParams) {
    const searchTerm = searchParams["search"];
    data = await Book.findAll({
      include: Author,
      where: {
        [Op.or]: {
          title: {
            [Op.like]: `%${searchTerm}%`,
          },
          description: {
            [Op.like]: `%${searchTerm}%`,
          },
        },
      },
      offset: page * size,
      limit: size,
    });
  } else {
    data = await Book.findAll({
      include: Author,
      offset: page * size,
      limit: size,
    });
  }

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Books and Authors</h1>
        <div className={styles.searchFormCreateFormContainer}>
          <SearchForm placeholder="Search Books" />
          <CreateBookForm />
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.tableHeader}>Book</th>
              <th className={styles.tableHeader}>Author</th>
            </tr>
          </thead>
          <tbody>
            {data.map((book) => (
              <tr key={book.id} className={styles.tableRow}>
                <td className={styles.tableCell}>
                  <Link
                    href={`/books/${book.id}`}
                    className={bookStyles.bookLink}
                  >
                    <div className={bookStyles.bookInfo}>
                      <p>
                        <span className={bookStyles.label}>Title:</span>
                        {book.title}
                      </p>
                      <p>
                        <span className={bookStyles.label}>Description:</span>
                        {book.description}
                      </p>
                    </div>
                  </Link>
                </td>
                <td className={styles.tableCell}>
                  {book.Author && (
                    <Link
                      href={`/authors/${book.Author.id}`}
                      className={bookStyles.authorLink}
                    >
                      <div className={bookStyles.authorInfo}>
                        <p>
                          <span className={bookStyles.label}>Name:</span>
                          {book.Author.name}
                        </p>
                        <p>
                          <span className={bookStyles.label}>Biography:</span>
                          {book.Author.biography}
                        </p>
                      </div>
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
