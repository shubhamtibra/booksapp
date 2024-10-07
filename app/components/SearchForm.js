"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export default function SearchForm({ placeholder }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setIsButtonEnabled(searchTerm.trim() !== "");
  }, [searchTerm]);

  function handleSearch(e) {
    e.preventDefault();
    setIsSubmitting(true);
    startTransition(() => {
      router.push(searchTerm ? `${pathname}?search=${searchTerm}` : pathname);
    });
    setIsSubmitting(false);
  }

  return (
    <>
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
      {isPending && (
        <div className="top-1/2 left-1/2 fixed text-center align-middle h-screen w-screen z-50">
          <div className="animate-spin-slow rounded-full h-32 w-32 border-t-2 border-b-2 border-dark-primary"></div>
        </div>
      )}
    </>
  );
}
