import dynamic from "next/dynamic";

const BookComponent = dynamic(() => import("./BookComponent"), {
  ssr: false,
});

export default function Book({ params }) {
  const bookId = parseInt(params.bookId);
  return <BookComponent bookId={bookId} />;
}
