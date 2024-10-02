"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../styles/shared.module.css";

export default function SearchForm({ placeholder }) {
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsButtonEnabled(searchTerm.trim() !== "");
  }, [searchTerm]);

  function handleSearch(e) {
    e.preventDefault();
    setIsSubmitting(true);
    router.push(searchTerm ? `${pathname}?search=${searchTerm}` : pathname);
    setIsSubmitting(false);
  }

  return (
    <form className={styles.searchForm} onSubmit={handleSearch}>
      <input
        className={`${styles.input}`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
      />
      <button
        className={styles.button}
        type="submit"
        disabled={!isButtonEnabled || isSubmitting}
      >
        Search
      </button>
    </form>
  );
}
