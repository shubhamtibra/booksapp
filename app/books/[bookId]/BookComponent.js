"use client";

import { gql, useMutation, useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import BookItem from "../../components/BookItem";
import { validateImageUrl } from "../../utils/imageValidator";

const GET_BOOK = gql`
  query GetBook($id: Int!) {
    book(id: $id) {
      id
      title
      description
      profilePhotoUrl
      publishedAt
      author_id
    }
  }
`;

const UPDATE_BOOK = gql`
  mutation UpdateBook(
    $id: Int!
    $title: String
    $description: String
    $publishedAt: String
    $profilePhotoUrl: String
    $author_id: Int
  ) {
    updateBook(
      id: $id
      title: $title
      description: $description
      publishedAt: $publishedAt
      profilePhotoUrl: $profilePhotoUrl
      author_id: $author_id
    ) {
      id
      title
      description
      profilePhotoUrl
      publishedAt
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

export default function BookComponent() {
  const params = useParams();
  const bookId = parseInt(params.bookId);

  const { loading, error, data } = useQuery(GET_BOOK, {
    variables: { id: bookId },
  });
  const [updateBook] = useMutation(UPDATE_BOOK);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBook, setEditedBook] = useState({});
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const { data: authorsData, loading: authorsLoading } =
    useQuery(GET_ALL_AUTHORS);
  useEffect(() => {
    if (data && data.book) {
      const book = data.book;
      setEditedBook(book);
    }
  }, [data]);

  useEffect(() => {
    async function localValidateImageUrl() {
      let validUrl = await validateImageUrl(editedBook.profilePhotoUrl, "book");
      setProfilePhotoUrl(validUrl);
    }
    localValidateImageUrl();
  }, [editedBook.profilePhotoUrl]);

  const handleEdit = () => {
    setIsEditing(true);
    setIsFormChanged(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateBook({
        variables: { ...editedBook, author_id: parseInt(editedBook.author_id) },
      });
      setIsEditing(false);
      setIsFormChanged(false);
      let validUrl = await validateImageUrl(editedBook.profilePhotoUrl, "book");
      setProfilePhotoUrl(validUrl);
    } catch (error) {
      console.error("Error updating book:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setEditedBook({
      ...editedBook,
      [e.target.name]: e.target.value,
    });
    setIsFormChanged(true);
  };
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin-slow rounded-full h-32 w-32 border-t-2 border-b-2 border-dark-primary"></div>
      </div>
    );
  if (error) return <p>Error: {error.message}</p>;
  return (
    editedBook && (
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-dark-primary">
          Book Details
        </h1>

        {isEditing ? (
          <form className="space-y-4">
            <label htmlFor="title" className="block text-dark-primary mb-1">
              Book Title:
            </label>
            <input
              className="input w-full text-dark-foreground"
              name="title"
              id="title"
              value={editedBook.title}
              onChange={handleChange}
              required
            />

            <label
              htmlFor="description"
              className="block text-dark-primary mb-1"
            >
              Book Description:
            </label>
            <textarea
              className="input w-full h-32 text-dark-foreground"
              name="description"
              id="description"
              value={editedBook.description}
              onChange={handleChange}
              required
            />
            <label
              htmlFor="profilePhotoUrl"
              className="block text-dark-primary mb-1"
            >
              Profile Photo URL:
            </label>
            <input
              className="input w-full text-dark-foreground"
              name="profilePhotoUrl"
              id="profilePhotoUrl"
              value={editedBook.profilePhotoUrl || ""}
              onChange={handleChange}
            />

            <select
              className="input w-full text-dark-foreground"
              value={editedBook.author_id}
              onChange={handleChange}
              required
              name="author_id"
            >
              <option value="">Select an author</option>
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
              onClick={handleSave}
              disabled={!isFormChanged || isSubmitting}
            >
              Save Changes
            </button>
          </form>
        ) : (
          <>
            <BookItem
              title={editedBook.title}
              description={editedBook.description}
              profilePhotoUrl={profilePhotoUrl}
              publishedAt={editedBook.publishedAt}
            />
            <button className="btn w-full mt-4" onClick={handleEdit}>
              Edit Book
            </button>
          </>
        )}
      </div>
    )
  );
}
