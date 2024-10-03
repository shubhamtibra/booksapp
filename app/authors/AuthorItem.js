import React from "react";
import styles from "./AuthorItem.module.css";

const AuthorItem = ({ name, biography }) => (
  <div className={styles.authorItem}>
    <h3 className={styles.authorName}>{name}</h3>
    <p className={styles.authorBio}>{biography}</p>
  </div>
);

export default AuthorItem;
