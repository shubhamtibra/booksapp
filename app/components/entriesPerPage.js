"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function EntriesPerPageDropdown({ currentSize }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const createPageUrl = (size) => {
    const params = new URLSearchParams(searchParams);
    params.set("size", size);
    return `${pathname}?${params.toString()}`;
  };
  //const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    startTransition(() => {
      const newSize = e.target.value;
      router.push(createPageUrl(newSize));
    });

    //setIsLoading(true);
  };

  return (
    <div>
      <select
        value={currentSize}
        onChange={handleChange}
        className="bg-dark-background text-dark-foreground border border-dark-secondary rounded p-2 focus:border-dark-primary focus:ring-1 focus:ring-dark-primary transition-all duration-200"
      >
        <option value="10">10 per page</option>
        <option value="20">20 per page</option>
        <option value="50">50 per page</option>
        <option value="100">100 per page</option>
      </select>
      {isPending && (
        <div className="top-1/2 left-1/2 fixed text-center align-middle h-screen w-screen z-50">
          <div className="animate-spin-slow rounded-full h-32 w-32 border-t-2 border-b-2 border-dark-primary"></div>
        </div>
      )}
    </div>
  );
}
