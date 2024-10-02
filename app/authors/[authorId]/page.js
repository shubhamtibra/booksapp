import dynamic from "next/dynamic";

const AuthorComponent = dynamic(() => import("./AuthorComponent"), {
  ssr: false,
});

export default function Author({ params }) {
  const authorId = parseInt(params.authorId);
  return <AuthorComponent authorId={authorId} />;
}
