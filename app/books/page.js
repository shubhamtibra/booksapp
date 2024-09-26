import Author from "@/models/authors";
import React from "react";
const Book = require("../../models/books");
import BookItem from "./BookItem";
import AuthorItem from "../authors/AuthorItem";
import styles from "./books.module.css";
import NextPage from "./nextPage";
import Link from "next/link";
import * as linkStyle from "../styles/link.module.css";
import CreateBookForm from "./CreateBookForm";

export default async function ServerBooksComponent({ params, searchParams }) {
  let [page, size] = [0, 10];
  if (searchParams && "page" in searchParams) {
    page = Number(searchParams["page"]);
  }
  if (searchParams && "size" in searchParams) {
    size = searchParams["size"];
  }

  const data = await Book.findAll({
    include: Author,
    offset: page * size,
    limit: size,
  });

  return (
    <>
      <div className={styles.booksContainer}>
        <h1 className={styles.pageTitle}>Books and Authors</h1>
        <CreateBookForm />
        {data.map((bookObject) => (
          <div key={bookObject.id} className={styles.bookAuthorCard}>
            <div className={styles.bookSection}>
              <h2 className={styles.sectionTitle}>Book Details</h2>
              <Link
                href={`/books/${bookObject.id}`}
                className={linkStyle.customLink}
              >
                <BookItem
                  title={bookObject.title}
                  description={bookObject.description}
                />
              </Link>
            </div>
            {bookObject.Author && (
              <div className={styles.authorSection}>
                <h2 className={styles.sectionTitle}>Author Details</h2>
                <Link
                  href={`/authors/${bookObject.Author.id}`}
                  className={linkStyle.customLink}
                >
                  <AuthorItem
                    name={bookObject.Author.name}
                    biography={bookObject.Author.biography}
                  />
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
      <NextPage></NextPage>
    </>
  );
}
