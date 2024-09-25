"use client";
import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./nextPage.module.css";

export default function NextPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  let page = 0;
  if (searchParams.has("page")) {
    page = Number(searchParams.get("page"));
  }
  const createQueryString = (name, value) => {
    const params = new URLSearchParams(searchParams);
    params.set(name, value);
    return params.toString();
  };
  return (
    <div className={styles.nextPageContainer}>
      <Link
        href={pathname + "?" + createQueryString("page", page + 1)}
        className={styles.nextPageButton}
      >
        Next Page
        <span className={styles.nextPageIcon}>→</span>
      </Link>
    </div>
  );
}
