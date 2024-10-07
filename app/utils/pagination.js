export function getPaginationParams(searchParams) {
  let page = 0;
  let size = 5;
  let searchTerm = null;

  if (searchParams && "page" in searchParams) {
    page = Number(searchParams.page);
  }
  if (searchParams && "size" in searchParams) {
    size = Number(searchParams.size);
  }
  if (searchParams && "search" in searchParams) {
    searchTerm = searchParams.search;
  }

  return { page, size, searchTerm };
}
