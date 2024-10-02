"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
    <form className="flex items-center" onSubmit={handleSearch}>
      <input
        className="input flex-grow mr-2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
      />
      <button
        className="btn whitespace-nowrap"
        type="submit"
        disabled={!isButtonEnabled || isSubmitting}
      >
        Search
      </button>
    </form>
  );
}
