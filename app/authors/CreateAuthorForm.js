"use client";

import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CREATE_AUTHOR = gql`
  mutation CreateAuthor(
    $name: String!
    $biography: String!
    $profilePhotoUrl: String
    $date_of_birth: String!
  ) {
    addAuthor(
      name: $name
      biography: $biography
      profilePhotoUrl: $profilePhotoUrl
      date_of_birth: $date_of_birth
    ) {
      id
      name
      biography
      profilePhotoUrl
      date_of_birth
    }
  }
`;

export default function CreateAuthorForm() {
  const [name, setName] = useState("");
  const [biography, setBiography] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [date_of_birth, setDateOfBirth] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createAuthor] = useMutation(CREATE_AUTHOR);
  const router = useRouter();

  useEffect(() => {
    setIsFormValid(
      name.trim() !== "" &&
        biography.trim() !== "" &&
        date_of_birth.trim() !== ""
    );
  }, [name, biography, date_of_birth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newAuthor = await createAuthor({
        variables: {
          name,
          biography,
          profilePhotoUrl,
          date_of_birth,
        },
      });
      router.push(`/authors/${newAuthor.data.addAuthor.id}`);
    } catch (error) {
      console.error("Error creating author:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-dark-primary mb-4">
        Create Author
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="input w-full text-dark-foreground"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Author Name"
          required
        />
        <textarea
          className="input w-full h-32 text-dark-foreground"
          value={biography}
          onChange={(e) => setBiography(e.target.value)}
          placeholder="Author Biography"
          required
        />
        <input
          className="input w-full text-dark-foreground"
          value={profilePhotoUrl}
          onChange={(e) => setProfilePhotoUrl(e.target.value)}
          placeholder="Profile Photo URL (optional)"
        />
        {/* <label
          htmlFor="date_of_birth"
          className="block font-bold text-dark-primary mb-1"
        >
          Date of Birth:
        </label> */}
        {/* <input placeholder="Date" class="textbox-n" type="text" onfocus="(this.type='date')" onblur="(this.type='text')" id="date" /> */}

        <input
          className="input w-full text-dark-foreground"
          value={date_of_birth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          placeholder="Date of Birth"
          type="text"
          name="date_of_birth"
          id="date_of_birth"
          onFocus={(e) => (e.target.type = "date")}
          onBlur={(e) => (e.target.type = "text")}
        ></input>

        <button
          type="submit"
          className="btn w-full"
          disabled={!isFormValid || isSubmitting}
        >
          Create Author
        </button>
      </form>
    </div>
  );
}
