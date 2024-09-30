'use client'
import {useState, usePathname} from "react";
import { useRouter } from "next/navigation";
export default function SearchAuthor () {
    const pathname = usePathname();
    const [searchTerm, setSearchTerm] = useState("")
    const router = useRouter()
    handleClick () {
        router.push(pathname + `?search=${searchTerm}`)
    }
    return (
    <>
    <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Enter name or biography">
        
        </input>
        <button onClick={handleClick}> Search Author </button>
    </>
    
    
    )
}