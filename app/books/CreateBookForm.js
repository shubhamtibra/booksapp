"use client";

import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CREATE_BOOK = gql`
  mutation CreateBook(
    $title: String!
    $description: String!
    $author_id: Int!
    $publishedAt: String!
    $profilePhotoUrl: String
  ) {
    addBook(
      title: $title
      description: $description
      author_id: $author_id
      publishedAt: $publishedAt
      profilePhotoUrl: $profilePhotoUrl
    ) {
      id
      title
      description
      publishedAt
      profilePhotoUrl
    }
  }
`;

const GET_ALL_AUTHORS = gql`
  query GetAllAuthors {
    allAuthors {
      id
      name
    }
  }
`;

export default function CreateBookForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createBook] = useMutation(CREATE_BOOK);
  const router = useRouter();
  const [author_id, setAuthorId] = useState("");
  const { data: authorsData, loading: authorsLoading } =
    useQuery(GET_ALL_AUTHORS);

  useEffect(() => {
    setIsFormValid(
      title.trim() !== "" &&
        description.trim() !== "" &&
        author_id.trim() !== ""
    );
  }, [title, description, author_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newBook = await createBook({
        variables: {
          title,
          description,
          author_id: parseInt(author_id),
          profilePhotoUrl,
          publishedAt,
        },
      });
      router.push(`/books/${newBook.data.addBook.id}`);
    } catch (error) {
      console.error("Error creating book:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-dark-primary mb-4">Create Book</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="input w-full text-dark-foreground"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Book Title"
          required
        />
        <textarea
          className="input w-full h-32 text-dark-foreground"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Book Description"
          required
        />

        {/* <input
        className="input w-full text-dark-foreground"
        type="number"
        value={author_id}
        onChange={(e) => setAuthorId(e.target.value)}
        placeholder="Author ID"
        required
      /> */}
        <input
          className="input w-full text-dark-foreground"
          value={profilePhotoUrl}
          onChange={(e) => setProfilePhotoUrl(e.target.value)}
          placeholder="Profile Photo URL (optional)"
        />
        <input
          className="input w-full text-dark-foreground"
          value={publishedAt}
          onChange={(e) => setPublishedAt(e.target.value)}
          placeholder="Publish date"
          type="text"
          onFocus={(e) => (e.target.type = "date")}
          onBlur={(e) => (e.target.type = "text")}
        ></input>

        <select
          className="input w-full text-dark-foreground"
          value={author_id}
          onChange={(e) => setAuthorId(e.target.value)}
          required
        >
          <option value="">Select author</option>
          {authorsData &&
            authorsData.allAuthors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
        </select>
        <button
          type="submit"
          className="btn w-full"
          disabled={!isFormValid || isSubmitting}
        >
          Create Book
        </button>
      </form>
    </div>
  );
}
