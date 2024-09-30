'use client';
import { EditAuthorServerAction } from "./editAuthorServerAction";
export default function EditAuthorClientComponent({ author }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAuthor, setEditedAuthor] = useState(author);
  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleSave = (e) => {
    e.preventDefault();
    updateAuthor({ variables: { ...editedAuthor } });
    setIsEditing(false);
  };
  const handleChange = (e) => {
    setEditedAuthor({
      ...editedAuthor,
      [e.target.name]: e.target.value,
    });
    };
    return (isEditing ? (
        <>
        <form action={EditAuthorServerAction} className={styles.editForm}>
        <input type="hidden" name="id" value={author.id}>
        </input>
        <input
          className={styles.editInput}
          name="name"
          value={editedAuthor.name}
          onChange={handleChange}
        />
        <textarea
          className={styles.editTextarea}
          name="biography"
          value={editedAuthor.biography}
          onChange={handleChange}
        />
        <button className={styles.editButton} type="submit">
          Save Changes
        </button>
      </form>
        </>
        
      ) : (
        <>
          <button className={styles.editButton} onClick={handleEdit}>
            Edit Author
          </button>
        </>
      ));
}