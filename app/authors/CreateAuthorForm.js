"use client";

import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import styles from "./authors.module.css";
import { useRouter } from "next/navigation";

const CREATE_AUTHOR = gql`
  mutation CreateAuthor($name: String!, $biography: String!) {
    addAuthor(name: $name, biography: $biography) {
      id
      name
      biography
    }
  }
`;

export default function CreateAuthorForm() {
  const [name, setName] = useState("");
  const [biography, setBiography] = useState("");
  const [createAuthor] = useMutation(CREATE_AUTHOR);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newAuthor = await createAuthor({ variables: { name, biography } });
      router.push(`/authors/${newAuthor.data.addAuthor.id}`);
    } catch (error) {
      console.error("Error creating author:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.editForm}>
      <input
        className={styles.editInput}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Author Name"
        required
      />
      <textarea
        className={styles.editTextarea}
        value={biography}
        onChange={(e) => setBiography(e.target.value)}
        placeholder="Author Biography"
        required
      />
      <button type="submit" className={styles.editButton}>
        Create Author
      </button>
    </form>
  );
}
