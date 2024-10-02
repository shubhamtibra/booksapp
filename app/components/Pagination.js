"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "../styles/shared.module.css";

export default function Pagination() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") || "0");

  const createPageUrl = (pageNumber) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber);
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className={styles.pagination}>
      <Link href={createPageUrl(currentPage + 1)} className={styles.button}>
        Next Page
      </Link>
    </div>
  );
}
