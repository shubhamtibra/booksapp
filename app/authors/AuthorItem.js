import React from "react";
import styles from "./AuthorItem.module.css";

const AuthorItem = ({ name, biography }) => (
  <div className={styles.authorItem}>
    <label className={styles.label}>Author Name:</label>
    <h3 className={styles.authorName}>{name}</h3>
    <label className={styles.label}>About Author:</label>
    <p className={styles.authorBio}>{biography}</p>
  </div>
);

export default AuthorItem;
