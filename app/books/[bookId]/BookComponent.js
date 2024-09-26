"use client";

import { useParams } from "next/navigation";
import { useQuery, gql, ApolloClient, useMutation } from "@apollo/client";
import BookItem from "../BookItem";
import styles from "../books.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";

import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";

const GET_BOOK = gql`
  query GetBook($id: Int!) {
    book(id: $id) {
      id
      title
      description
    }
  }
`;

const UPDATE_BOOK = gql`
  mutation UpdateBook($id: Int!, $title: String, $description: String) {
    updateBook(id: $id, title: $title, description: $description) {
      id
      title
      description
    }
  }
`;

export default function AuthorComponent() {
  const params = useParams();
  const bookId = parseInt(params.bookId);

  const { loading, error, data } = useSuspenseQuery(GET_BOOK, {
    variables: { id: bookId },
  });
  const [updateBook] = useMutation(UPDATE_BOOK);
  const { book } = data;
  const [isEditing, setIsEditing] = useState(false);
  const [editedBook, setEditedBook] = useState(book);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateBook({ variables: { ...editedBook } });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setEditedBook({
      ...editedBook,
      [e.target.name]: e.target.value,
    });
  };
  return (
    book && (
      <div className={styles.authorsContainer}>
        <h1 className={styles.pageTitle}>Book Details</h1>
        <div className={styles.authorBooksCard}>
          <div className={styles.authorSection}>
            <h2 className={styles.sectionTitle}>Book Information</h2>
            {isEditing ? (
              <form className={styles.editForm}>
                <input
                  className={styles.editInput}
                  name="title"
                  value={editedBook.title}
                  onChange={handleChange}
                />
                <textarea
                  className={styles.editTextarea}
                  name="description"
                  value={editedBook.description}
                  onChange={handleChange}
                />
                <button className={styles.editButton} onClick={handleSave}>
                  Save Changes
                </button>
              </form>
            ) : (
              <>
                <BookItem title={book.title} description={book.description} />
                <button className={styles.editButton} onClick={handleEdit}>
                  Edit Book
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  );
}
