import ClientOnly from "@/app/components/clientOnly";
import AuthorComponent from "./AuthorComponent";

export default function Author({ params }) {
  const authorId = parseInt(params.authorId);
  return (
    <>
      <ClientOnly>
        <AuthorComponent authorId={authorId} />;
      </ClientOnly>
    </>
  );
}
