const AuthorItem = ({ name, biography, profilePhotoUrl, date_of_birth }) => {
  return (
    <div className="card p-4 flex items-center">
      <img
        src={profilePhotoUrl}
        alt={name}
        className="w-32 h-32 border border-dark-background rounded mr-4"
        loading="lazy"
      />

      <div>
        <label className="block font-bold text-dark-primary mb-1">
          Author Name:
        </label>
        <h3 className="text-xl mb-2 text-dark-foreground">{name}</h3>
        <label className="block font-bold text-dark-primary mb-1">
          About Author:
        </label>
        <p className="text-dark-foreground">{biography}</p>
        <label className="block font-bold text-dark-primary mb-1">
          Date of Birth:
        </label>
        <p className="text-dark-foreground">{date_of_birth}</p>
      </div>
    </div>
  );
};
export default AuthorItem;
