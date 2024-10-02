const BookItem = ({ title, description, profilePhotoUrl, publishedAt }) => {
  const placeholderImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23ddd'/%3E%3Cpath d='M50 30 C40 30 35 40 35 50 C35 60 40 65 50 65 C60 65 65 60 65 50 C65 40 60 30 50 30 M30 85 L70 85 C70 75 60 70 50 70 C40 70 30 75 30 85' fill='%23999'/%3E%3C/svg%3E";

  return (
    <div className="card p-4 flex items-center">
      {profilePhotoUrl && (
        <img
          src={profilePhotoUrl || placeholderImage}
          alt={title}
          className="w-32 h-32 border border-dark-background rounded mr-4"
          loading="lazy"
        />
      )}
      <div>
        <label className="block font-bold text-dark-primary mb-1">
          Book Title:
        </label>
        <h3 className="text-xl mb-2 text-dark-foreground">{title}</h3>
        <label className="block font-bold text-dark-primary mb-1">
          Book Description:
        </label>
        <p className="text-dark-foreground">{description}</p>
        <label className="block font-bold text-dark-primary mb-1">
          Published At:
        </label>
        <p className="text-dark-foreground">{publishedAt}</p>
      </div>
    </div>
  );
};

export default BookItem;
