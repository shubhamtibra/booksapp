"use client";

import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../styles/shared.module.css";

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
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createAuthor] = useMutation(CREATE_AUTHOR);
  const router = useRouter();

  useEffect(() => {
    setIsFormValid(name.trim() !== "" && biography.trim() !== "");
  }, [name, biography]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newAuthor = await createAuthor({ variables: { name, biography } });
      router.push(`/authors/${newAuthor.data.addAuthor.id}`);
    } catch (error) {
      console.error("Error creating author:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formDivider}></div>
      <input
        className={`${styles.input} ${styles.shortInput}`}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Author Name"
        required
      />
      <textarea
        className={styles.textarea}
        value={biography}
        onChange={(e) => setBiography(e.target.value)}
        placeholder="Author Biography"
        required
      />
      <button
        type="submit"
        className={styles.button}
        disabled={!isFormValid || isSubmitting}
      >
        Create Author
      </button>
    </form>
  );
}
