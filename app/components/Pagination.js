import Link from "next/link";

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams,
}) {
  const createPageUrl = (pageNumber) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const renderPageButton = (pageNumber) => (
    <Link
      key={pageNumber}
      href={createPageUrl(pageNumber)}
      className={`px-4 py-2 rounded-md font-semibold transition-colors duration-200 ${
        pageNumber === currentPage
          ? "bg-dark-primary text-dark-foreground"
          : "bg-dark-background text-dark-foreground border border-dark-secondary hover:bg-dark-accent hover:text-dark-foreground"
      }`}
    >
      {pageNumber + 1}
    </Link>
  );

  const renderEllipsis = (key) => (
    <span key={key} className="px-3 py-2 text-dark-foreground">
      ...
    </span>
  );

  const pageButtons = [];

  if (totalPages <= 7) {
    for (let i = 0; i < totalPages; i++) {
      pageButtons.push(renderPageButton(i));
    }
  } else {
    pageButtons.push(renderPageButton(0));

    if (currentPage > 3) {
      pageButtons.push(renderEllipsis("start-ellipsis"));
    }

    const start = Math.max(1, currentPage - 2);
    const end = Math.min(currentPage + 2, totalPages - 2);

    for (let i = start; i <= end; i++) {
      pageButtons.push(renderPageButton(i));
    }

    if (currentPage < totalPages - 4) {
      pageButtons.push(renderEllipsis("end-ellipsis"));
    }

    pageButtons.push(renderPageButton(totalPages - 1));
  }

  return (
    <div className="flex justify-center space-x-2 mt-4">{pageButtons}</div>
  );
}
