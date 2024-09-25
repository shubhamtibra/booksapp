import React from "react";
import Author from "@/models/authors";
import Book from "@/models/books";
import AuthorItem from "./AuthorItem";
import BookItem from "../books/BookItem";
import styles from "./authors.module.css";
import NextPage from "../books/nextPage";
export default async function ServerAuthorsComponent({ params, searchParams }) {
  let [page, size] = [0, 10];
  if (searchParams && "page" in searchParams) {
    page = Number(searchParams["page"]);
  }
  if (searchParams && "size" in searchParams) {
    size = searchParams["size"];
  }
  const data = await Author.findAll({
    include: Book,
    offset: page * size,
    limit: size,
  });

  return (
    <>
      <div className={styles.authorsContainer}>
        <h1 className={styles.pageTitle}>Authors and Their Books</h1>
        {data.map((authorObject) => (
          <div key={authorObject.id} className={styles.authorBooksCard}>
            <div className={styles.authorSection}>
              <h2 className={styles.sectionTitle}>Author Details</h2>
              <AuthorItem
                name={authorObject.name}
                biography={authorObject.biography}
              />
            </div>
            <div className={styles.booksSection}>
              <h2 className={styles.sectionTitle}>Books by This Author</h2>
              {authorObject.Books.map((book) => (
                <BookItem
                  key={book.id}
                  title={book.title}
                  description={book.description}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <NextPage></NextPage>
    </>
  );
}
