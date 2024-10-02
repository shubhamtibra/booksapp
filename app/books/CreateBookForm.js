"use client";

import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import styles from "./books.module.css";
import { useRouter } from "next/navigation";

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
  const [author_id, setauthor_id] = useState("");
  const [createBook] = useMutation(CREATE_BOOK);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newBook = await createBook({
        variables: { title, description, author_id: parseInt(author_id) },
      });
      router.push(`/books/${newBook.data.addBook.id}`);
    } catch (error) {
      console.error("Error creating book:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.editForm}>
      <input
        className={styles.editInput}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Book Title"
        required
      />
      <textarea
        className={styles.editTextarea}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Book Description"
        required
      />
      <input
        className={styles.editInput}
        type="number"
        value={author_id}
        onChange={(e) => setauthor_id(e.target.value)}
        placeholder="Author ID"
        required
      />
      <button type="submit" className={styles.editButton}>
        Create Book
      </button>
    </form>
  );
}
