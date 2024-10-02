"use client";

import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../styles/shared.module.css";

const CREATE_BOOK = gql`
  mutation CreateBook(
    $title: String!
    $description: String!
    $author_id: Int!
  ) {
    addBook(title: $title, description: $description, author_id: $author_id) {
      id
      title
      description
    }
  }
`;

export default function CreateBookForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author_id, setAuthorId] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createBook] = useMutation(CREATE_BOOK);
  const router = useRouter();

  useEffect(() => {
    setIsFormValid(
      title.trim() !== "" &&
        description.trim() !== "" &&
        author_id.trim() !== ""
    );
  }, [title, description, author_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newBook = await createBook({
        variables: { title, description, author_id: parseInt(author_id) },
      });
      router.push(`/books/${newBook.data.addBook.id}`);
    } catch (error) {
      console.error("Error creating book:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        className={styles.input}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Book Title"
        required
      />
      <textarea
        className={styles.textarea}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Book Description"
        required
      />
      <input
        className={styles.input}
        type="number"
        value={author_id}
        onChange={(e) => setAuthorId(e.target.value)}
        placeholder="Author ID"
        required
      />
      <button
        type="submit"
        className={styles.button}
        disabled={!isFormValid || isSubmitting}
      >
        Create Book
      </button>
    </form>
  );
}
