import { ApolloClient, gql, HttpLink, InMemoryCache } from "@apollo/client";
//import client from "../../apolloClient";
import AuthorItem from "../AuthorItem";
import styles from "../authors.module.css";

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

function createApolloClient() {
  return new ApolloClient({
    ssrMode: true,
    link: new HttpLink({
      uri: "http://localhost:3000/api", // Replace with your actual GraphQL endpoint
    }),
    cache: new InMemoryCache(),
  });
}

export default async function AuthorServerComponent({ params }) {
  try {
    const authorId = parseInt(params.authorId);
    const client = createApolloClient();
    const { data } = await client.query({
      query: GET_AUTHOR,
      variables: { id: authorId },
    });
    const { author } = data;

    return (
      <div className={styles.authorsContainer}>
        <h1 className={styles.pageTitle}>Author Details</h1>
        <div className={styles.authorBooksCard}>
          <div className={styles.authorSection}>
            <h2 className={styles.sectionTitle}>Author Information</h2>
            <AuthorItem
              name={author.name}
              biography={author.biography}
            ></AuthorItem>
            <EditAuthorClientComponent author={author} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.log(error.stack);
    return <p>Error fetching author</p>;
  }

  return author ? (
    <div className={styles.authorsContainer}>
      <h1 className={styles.pageTitle}>Author Details</h1>
      <div className={styles.authorBooksCard}>
        <div className={styles.authorSection}>
          <h2 className={styles.sectionTitle}>Author Information</h2>
          <AuthorItem
            name={author.name}
            biography={author.biography}
          ></AuthorItem>
          <EditAuthorClientComponent author={author} />
        </div>
      </div>
    </div>
  ) : (
    <p> Couldn't fetch author </p>
  );
}

// export async function getServerSideProps({ params }) {
//   try {
//     const authorId = parseInt(params.authorId);
//     const client = createApolloClient();
//     const { data } = await client.query(GET_AUTHOR, {
//       variables: { id: authorId },
//     });
//     const { author } = data;

//     return {
//       props: {
//         author,
//       },
//     };
//   } catch (error) {
//     return {
//       props: {
//         author: null,
//       },
//     };
//   }
// }
