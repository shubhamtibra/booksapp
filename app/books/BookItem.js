import React from "react";
import styles from "./BookItem.module.css";

const BookItem = ({ title, description }) => (
  <div className={styles.bookItem}>
    <h3 className={styles.bookTitle}>{title}</h3>
    <p className={styles.bookDescription}>{description}</p>
  </div>
);

export default BookItem;
