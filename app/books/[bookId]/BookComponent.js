"use client";

import { gql, useMutation, useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import BookItem from "../../components/BookItem";
import styles from "../../styles/shared.module.css";
import bookStyles from "../books.module.css";

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

export default function BookComponent() {
  const params = useParams();
  const bookId = parseInt(params.bookId);

  const { loading, error, data } = useQuery(GET_BOOK, {
    variables: { id: bookId },
  });
  const [updateBook] = useMutation(UPDATE_BOOK);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBook, setEditedBook] = useState();
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (data && data.book) {
      setEditedBook(data.book);
    }
  }, [data]);

  const handleEdit = () => {
    setIsEditing(true);
    setIsFormChanged(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateBook({ variables: { ...editedBook } });
      setIsEditing(false);
      setIsFormChanged(false);
    } catch (error) {
      console.error("Error updating book:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setEditedBook({
      ...editedBook,
      [e.target.name]: e.target.value,
    });
    setIsFormChanged(true);
  };
  if (loading) return <div className={styles.loadingIcon}></div>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    editedBook && (
      <div className={`${styles.container} ${styles.narrowContainer}`}>
        <h1 className={styles.pageTitle}>Book Details</h1>
        <div className={styles.card}>
          <div className={bookStyles.bookSection}>
            <h2 className={styles.sectionTitle}>Book Information</h2>
            {isEditing ? (
              <form className={styles.form}>
                <label htmlFor="title" className={styles.label}>
                  {" "}
                  Book Title:
                </label>

                <input
                  className={styles.input}
                  name="title"
                  id="title"
                  value={editedBook.title}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="description" className={styles.label}>
                  Book Description
                </label>

                <textarea
                  className={styles.textarea}
                  name="description"
                  id="description"
                  value={editedBook.description}
                  onChange={handleChange}
                  required
                />

                <button
                  type="submit"
                  className={styles.button}
                  onClick={handleSave}
                  disabled={!isFormChanged || isSubmitting}
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <>
                <BookItem
                  title={editedBook.title}
                  description={editedBook.description}
                />
                <button className={styles.button} onClick={handleEdit}>
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
