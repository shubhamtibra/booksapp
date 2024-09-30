import Author from "@/models/authors";
import Book from "@/models/books";
import Link from "next/link";
import { Op } from "sequelize";
import Pagination from "../components/Pagination";
import SearchForm from "../components/SearchForm";
import styles from "../styles/shared.module.css";
import { getPaginationParams } from "../utils/pagination";
import authorStyles from "./authors.module.css";
import CreateAuthorForm from "./CreateAuthorForm";

export default async function ServerAuthorsComponent({ params, searchParams }) {
  const { page, size } = getPaginationParams(searchParams);
  let data = [];
  if (searchParams && "search" in searchParams) {
    const searchTerm = searchParams["search"];
    data = await Author.findAll({
      include: Book,
      where: {
        [Op.or]: {
          name: {
            [Op.like]: `%${searchTerm}%`,
          },
          biography: {
            [Op.like]: `%${searchTerm}%`,
          },
        },
      },
      offset: page * size,
      limit: size,
    });
  } else {
    data = await Author.findAll({
      include: Book,
      offset: page * size,
      limit: size,
    });
  }

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Authors and Their Books</h1>
        <div className={styles.searchFormCreateFormContainer}>
          <SearchForm placeholder="Search Authors" />
          <CreateAuthorForm />
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.tableHeader}>Author</th>
              <th className={styles.tableHeader}>Books</th>
            </tr>
          </thead>
          <tbody>
            {data.map((author) => (
              <tr key={author.id} className={styles.tableRow}>
                <td className={styles.tableCell}>
                  <Link
                    href={`/authors/${author.id}`}
                    className={authorStyles.authorLink}
                  >
                    <div className={authorStyles.authorInfo}>
                      <p>
                        <span className={authorStyles.label}>Name:</span>
                        {author.name}
                      </p>
                      <p>
                        <span className={authorStyles.label}>Biography:</span>
                        {author.biography}
                      </p>
                    </div>
                  </Link>
                </td>
                <td className={styles.tableCell}>
                  <ul className={authorStyles.bookList}>
                    {author.Books.map((book) => (
                      <li key={book.id}>
                        <Link
                          href={`/books/${book.id}`}
                          className={authorStyles.bookLink}
                        >
                          <div className={authorStyles.bookInfo}>
                            <p>
                              <span className={authorStyles.label}>Title:</span>
                              {book.title}
                            </p>
                            <p>
                              <span className={authorStyles.label}>
                                Description:
                              </span>
                              {book.description}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
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
