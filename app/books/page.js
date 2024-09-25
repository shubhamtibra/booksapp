import Author from "@/models/authors";
import React from "react";
const Book = require("../../models/books");
import BookItem from "./BookItem";
import AuthorItem from "../authors/AuthorItem";
import styles from "./books.module.css";

export default async function ServerBooksComponent() {
  const data = await Book.findAll({ include: Author });

  return (
    <div className={styles.booksContainer}>
      <h1 className={styles.pageTitle}>Books and Authors</h1>
      {data.map((bookObject) => (
        <div key={bookObject.id} className={styles.bookAuthorCard}>
          <div className={styles.bookSection}>
            <h2 className={styles.sectionTitle}>Book Details</h2>
            <BookItem
              title={bookObject.title}
              description={bookObject.description}
            />
          </div>
          <div className={styles.authorSection}>
            <h2 className={styles.sectionTitle}>Author Details</h2>
            <AuthorItem
              name={bookObject.Author.name}
              biography={bookObject.Author.biography}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
