'use client'
import {useState} from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./authors.module.css";
export default function SearchAuthor () {
    const pathname = usePathname();
    const [searchTerm, setSearchTerm] = useState("")
    const router = useRouter()
    function handleClick () {
        router.push(searchTerm ? `${pathname}?search=${searchTerm}` : pathname)
    }
    return (
    <div className={styles.searchForm}>
    <input value={searchTerm} className={styles.editInput} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Enter name or biography">
        
        </input>
        <button className={styles.editButton} onClick={handleClick}> Search Author </button>
    </div>
    
    
    )
}