export function getPaginationParams(searchParams, defaultSize = 10) {
  let page = 0;
  let size = defaultSize;

  if (searchParams && "page" in searchParams) {
    page = Number(searchParams.page);
  }
  if (searchParams && "size" in searchParams) {
    size = Number(searchParams.size);
  }

  return { page, size };
}
