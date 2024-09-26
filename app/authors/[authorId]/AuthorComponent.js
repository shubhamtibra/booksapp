"use client";

import { useParams } from "next/navigation";
import { useQuery, gql, ApolloClient, useMutation } from "@apollo/client";
import AuthorItem from "../AuthorItem";
import BookItem from "../../books/BookItem";
import styles from "../authors.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";

import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";

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

  const { loading, error, data } = useSuspenseQuery(GET_AUTHOR, {
    variables: { id: authorId },
  });
  const [updateAuthor] = useMutation(UPDATE_AUTHOR);
  const { author } = data;
  const [isEditing, setIsEditing] = useState(false);
  const [editedAuthor, setEditedAuthor] = useState(author);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateAuthor({ variables: { ...editedAuthor } });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setEditedAuthor({
      ...editedAuthor,
      [e.target.name]: e.target.value,
    });
  };
  return (
    author && (
      <div className={styles.authorsContainer}>
        <h1 className={styles.pageTitle}>Author Details</h1>
        <div className={styles.authorBooksCard}>
          <div className={styles.authorSection}>
            <h2 className={styles.sectionTitle}>Author Information</h2>
            {isEditing ? (
              <form className={styles.editForm}>
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
                <button className={styles.editButton} onClick={handleSave}>
                  Save Changes
                </button>
              </form>
            ) : (
              <>
                <AuthorItem name={author.name} biography={author.biography} />
                <button className={styles.editButton} onClick={handleEdit}>
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
