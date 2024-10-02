"use client";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AuthorItem from "../../components/AuthorItem";
import { validateImageUrl } from "../../utils/imageValidator";

const GET_AUTHOR = gql`
  query GetAuthor($id: Int!) {
    author(id: $id) {
      id
      name
      biography
      date_of_birth
      profilePhotoUrl
    }
  }
`;

const UPDATE_AUTHOR = gql`
  mutation UpdateAuthor(
    $id: Int!
    $name: String
    $biography: String
    $date_of_birth: String
    $profilePhotoUrl: String
  ) {
    updateAuthor(
      id: $id
      name: $name
      biography: $biography
      date_of_birth: $date_of_birth
      profilePhotoUrl: $profilePhotoUrl
    ) {
      id
      name
      biography
      date_of_birth
      profilePhotoUrl
    }
  }
`;

export default function AuthorComponent() {
  const params = useParams();
  const authorId = parseInt(params.authorId);
  const [updateAuthor] = useMutation(UPDATE_AUTHOR);
  const [isEditing, setIsEditing] = useState(false);
  const [editedAuthor, setEditedAuthor] = useState({});
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const { data, loading, error } = useQuery(GET_AUTHOR, {
    variables: { id: authorId },
  });
  useEffect(() => {
    if (data && data.author) {
      const { author } = data;
      console.log(author);
      console.log(JSON.stringify(author));
      setEditedAuthor(author);
    }
  }, [data]);
  useEffect(() => {
    async function localValidateImageUrl() {
      let validUrl = await validateImageUrl(
        editedAuthor.profilePhotoUrl,
        "author"
      );
      setProfilePhotoUrl(validUrl);
    }
    localValidateImageUrl();
  }, [editedAuthor.profilePhotoUrl]);
  const handleEdit = () => {
    setIsEditing(true);
    setIsFormChanged(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateAuthor({ variables: { ...editedAuthor } });
      setIsEditing(false);
      setIsFormChanged(false);
      let validUrl = await validateImageUrl(
        editedAuthor.profilePhotoUrl,
        "author"
      );
      setProfilePhotoUrl(validUrl);
    } catch (error) {
      console.error("Error updating author:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setEditedAuthor({
      ...editedAuthor,
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
  if (error) return <p>Error: {error.stack}</p>;
  return (
    editedAuthor && (
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-dark-primary">
          Author Details
        </h1>

        {isEditing ? (
          <form className="space-y-4">
            <label htmlFor="name" className="block text-dark-primary mb-1">
              Author Name:
            </label>
            <input
              className="input w-full text-dark-foreground"
              name="name"
              id="name"
              value={editedAuthor.name}
              onChange={handleChange}
              required
            />

            <label htmlFor="biography" className="block text-dark-primary mb-1">
              Author Biography:
            </label>
            <textarea
              className="input w-full h-32 text-dark-foreground"
              name="biography"
              id="biography"
              value={editedAuthor.biography}
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
              value={editedAuthor.profilePhotoUrl || ""}
              onChange={handleChange}
            />

            <label
              htmlFor="date_of_birth"
              className="block text-dark-primary mb-1"
            >
              Date of Birth:
            </label>
            <input
              className="input w-full text-dark-foreground"
              name="date_of_birth"
              id="date_of_birth"
              value={editedAuthor.date_of_birth}
              onChange={handleChange}
              type="date"
            />

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
            <AuthorItem
              name={editedAuthor.name}
              biography={editedAuthor.biography}
              profilePhotoUrl={profilePhotoUrl}
              date_of_birth={editedAuthor.date_of_birth}
            />
            <button className="btn w-full mt-4" onClick={handleEdit}>
              Edit Author
            </button>
          </>
        )}
      </div>
    )
  );
}
