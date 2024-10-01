"use client";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "../authors.module.css";

const UPDATE_AUTHOR = gql`
  mutation UpdateAuthor($id: Int!, $name: String, $biography: String) {
    updateAuthor(id: $id, name: $name, biography: $biography) {
      id
      name
      biography
    }
  }
`;
export default function EditAuthorClientComponent({ author }) {
  const router = useRouter();
  const [updateAuthor] = useMutation(UPDATE_AUTHOR);
  const [isEditing, setIsEditing] = useState(false);
  const [editedAuthor, setEditedAuthor] = useState(author);
  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleSave = (e) => {
    e.preventDefault();
    updateAuthor({ variables: { ...editedAuthor } });
    setIsEditing(false);
    router.refresh();
  };
  const handleChange = (e) => {
    setEditedAuthor({
      ...editedAuthor,
      [e.target.name]: e.target.value,
    });
  };
  return isEditing ? (
    <>
      <form onSubmit={handleSave} className={styles.editForm}>
        <input type="hidden" name="id" value={author.id}></input>
        <input
          className={styles.editInput}
          name="name"
          value={editedAuthor.name}
          onChange={handleChange}
        />
        <textarea
          className={styles.editTextarea}
          name="biography"
          value={editedAuthor.biography}
          onChange={handleChange}
        />
        <button className={styles.editButton} type="submit">
          Save Changes
        </button>
      </form>
    </>
  ) : (
    <>
      <button className={styles.editButton} onClick={handleEdit}>
        Edit Author
      </button>
    </>
  );
}

export async function EditAuthorServerAction(formData) {}
