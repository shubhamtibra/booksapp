import styles from "./BookItem.module.css";

const BookItem = ({ title, description }) => (
  <div className={styles.bookItem}>
    <label className={styles.label}>Book Title:</label>
    <h3 className={styles.bookTitle}>{title}</h3>
    <label className={styles.label}>Book description:</label>
    <p className={styles.bookDescription}>{description}</p>
  </div>
);

export default BookItem;
