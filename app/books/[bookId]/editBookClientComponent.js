"use client";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import styles from "../books.module.css";
const { useRouter } = require("next/navigation");
const UPDATE_BOOK = gql`
  mutation UpdateBook($id: Int!, $title: String, $description: String) {
    updateBook(id: $id, title: $title, description: $description) {
      id
      title
      description
    }
  }
`;
export default function EditBookClientComponent({ book }) {
  const router = useRouter();
  const [updateBook] = useMutation(UPDATE_BOOK);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBook, setEditedBook] = useState(book);
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateBook({ variables: { ...editedBook } });
    setIsEditing(false);
    router.refresh();
  };

  const handleChange = (e) => {
    setEditedBook({
      ...editedBook,
      [e.target.name]: e.target.value,
    });
  };
  return isEditing ? (
    <form className={styles.editForm}>
      <input type="hidden" name="id" value={book.id}></input>
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
    <button className={styles.editButton} onClick={handleEdit}>
      Edit Book
    </button>
  );
}
