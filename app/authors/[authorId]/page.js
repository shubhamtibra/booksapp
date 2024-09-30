import { gql } from "@apollo/client";
import AuthorItem from "../AuthorItem";
import styles from "../authors.module.css";
import client from "../../apolloClientForServerByPassHttp"

// import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import EditAuthorClientComponent from "./editAuthorClientComponent";
const GET_AUTHOR = gql`
  query GetAuthor($id: Int!) {
    author(id: $id) {
      id
      name
      biography
    }
  }
`;

export default async function AuthorServerComponent({params}) {
  const authorId = parseInt(params.authorId);
  let author, loading, error, data;
  try {
    const { loading, error, data } = await client.query(GET_AUTHOR, {
      variables: { id: authorId },
    });
    const { author } = data;
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    return (
      author && (
        <div className={styles.authorsContainer}>
          <h1 className={styles.pageTitle}>Author Details</h1>
          <div className={styles.authorBooksCard}>
            <div className={styles.authorSection}>
              <h2 className={styles.sectionTitle}>Author Information</h2>
              <AuthorItem name={author.name} biography={author.biography}></AuthorItem>
              <EditAuthorClientComponent author={author} />
            </div>
          </div>
        </div>
      )
    );
  }
 catch (error) {
    return <p>Error: {error.message}</p>;
 }
 
}

