import { ApolloClient, gql, HttpLink, InMemoryCache } from "@apollo/client";
import BookItem from "../BookItem";
import styles from "../books.module.css";
import EditBookClientComponent from "./editBookClientComponent";

//import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";

const GET_BOOK = gql`
  query GetBook($id: Int!) {
    book(id: $id) {
      id
      title
      description
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

export default async function BookSrverComponent({ params }) {
  const bookId = parseInt(params.bookId);
  const client = createApolloClient();
  const { loading, error, data } = await client.query({
    query: GET_BOOK,
    variables: { id: bookId },
  });
  const { book } = data;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    book && (
      <div className={styles.authorsContainer}>
        <h1 className={styles.pageTitle}>Book Details</h1>
        <div className={styles.authorBooksCard}>
          <div className={styles.authorSection}>
            <h2 className={styles.sectionTitle}>Book Information</h2>
            <BookItem title={book.title} description={book.description} />
            <EditBookClientComponent book={book} />
          </div>
        </div>
      </div>
    )
  );
}
