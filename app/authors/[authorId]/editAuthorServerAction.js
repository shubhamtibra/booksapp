"use server";
import {gql, useMutation } from "@apollo/client";

const UPDATE_AUTHOR = gql`
  mutation UpdateAuthor($id: Int!, $name: String, $biography: String) {
    updateAuthor(id: $id, name: $name, biography: $biography) {
      id
      name
      biography
    }
  }
`;
export async function EditAuthorServerAction(formData) {
    const [updateAuthor] = useMutation(UPDATE_AUTHOR);
  const { id, name, biography } = formData;
  updateAuthor({ variables: { id, name, biography } });

}