"use client";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AuthorItem from "../../components/AuthorItem";
import styles from "../../styles/shared.module.css";
import authorStyles from "../authors.module.css";

const GET_AUTHOR = gql`
  query GetAuthor($id: Int!) {
    author(id: $id) {
      id
      name
      biography
    }
  }
`;

const UPDATE_AUTHOR = gql`
  mutation UpdateAuthor($id: Int!, $name: String, $biography: String) {
    updateAuthor(id: $id, name: $name, biography: $biography) {
      id
      name
      biography
    }
  }
`;

export default function AuthorComponent() {
  const params = useParams();
  const authorId = parseInt(params.authorId);
  const { data, loading, error } = useQuery(GET_AUTHOR, {
    variables: { id: authorId },
  });
  useEffect(() => {
    if (data && data.author) {
      setEditedAuthor(data.author);
    }
  }, [data]);
  const [updateAuthor] = useMutation(UPDATE_AUTHOR);
  const [isEditing, setIsEditing] = useState(false);
  const [editedAuthor, setEditedAuthor] = useState();
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setIsFormChanged(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateAuthor({ variables: { ...editedAuthor } });
      setIsEditing(false);
      setIsFormChanged(false);
    } catch (error) {
      console.error("Error updating author:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setEditedAuthor({
      ...editedAuthor,
      [e.target.name]: e.target.value,
    });
    setIsFormChanged(true);
  };

  if (loading) return <div className={styles.loadingIcon}></div>;
  if (error) return <p>Error: {error.stack}</p>;
  return (
    editedAuthor && (
      <div className={`${styles.container} ${styles.narrowContainer}`}>
        <h1 className={styles.pageTitle}>Author Details</h1>
        <div className={styles.card}>
          <div className={authorStyles.authorSection}>
            <h2 className={styles.sectionTitle}>Author Information</h2>
            {isEditing ? (
              <form className={styles.form}>
                <label htmlFor="name" className={styles.label}>
                  Author Name:
                </label>

                <input
                  className={styles.input}
                  name="name"
                  id="name"
                  value={editedAuthor.name}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="biography" className={styles.label}>
                  {" "}
                  Author Biography
                </label>

                <textarea
                  className={styles.textarea}
                  name="biography"
                  id="biography"
                  value={editedAuthor.biography}
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
                <AuthorItem
                  name={editedAuthor.name}
                  biography={editedAuthor.biography}
                />
                <button className={styles.button} onClick={handleEdit}>
                  Edit Author
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  );
}
