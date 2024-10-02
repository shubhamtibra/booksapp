'use client'
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./books.module.css";

export default function SearchBooks() {
    const pathname = usePathname();
    const [searchTerm, setSearchTerm] = useState("")
    const router = useRouter()
    function handleClick () {
        router.push(searchTerm ? `${pathname}?search=${searchTerm}` : pathname)
    }
    return (
        <div className={styles.searchForm}>
            <input 
                className={styles.editInput}
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                placeholder="Enter title or description"
            />
            <button className={styles.editButton} onClick={handleClick}>Search Books</button>
        </div>
    )
}