import ClientOnly from "@/app/components/clientOnly";
import BookComponent from "./BookComponent";

export default function Book({ params }) {
  const bookId = parseInt(params.bookId);
  return (
    <ClientOnly>
      <BookComponent bookId={bookId} />
    </ClientOnly>
  );
}
