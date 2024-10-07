const BookItem = ({
  title,
  description,
  profilePhotoUrl,
  publishedAt,
  reviews,
  displayReviews,
}) => {
  const averageRating =
    reviews?.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "No reviews yet";

  const renderStars = (rating) => {
    return (
      <span className="text-yellow-500 text-2xl">
        {"★".repeat(rating)}
        <span className="text-gray-300">{"★".repeat(5 - rating)}</span>
      </span>
    );
  };
  const placeholderImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23ddd'/%3E%3Cpath d='M50 30 C40 30 35 40 35 50 C35 60 40 65 50 65 C60 65 65 60 65 50 C65 40 60 30 50 30 M30 85 L70 85 C70 75 60 70 50 70 C40 70 30 75 30 85' fill='%23999'/%3E%3C/svg%3E";

  return (
    <>
      <div className="card p-4 flex items-center gap-1 bg-dark-itemBackground shadow-custom shadow-dark-shadow hover:shadow-lg hover:shadow-dark-shadow transition-shadow duration-300">
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
          <h3 className="text-xl mb-3 text-dark-foreground">{title}</h3>
          <label className="block font-bold text-dark-primary mb-1">
            Book Description:
          </label>
          <p className="text-dark-foreground mb-3">{description}</p>
          <label className="block font-bold text-dark-primary mb-1">
            Published At:
          </label>
          <p className="text-dark-foreground mb-3">{publishedAt}</p>
          <label className="block font-bold text-dark-primary mb-1">
            Average Rating:
          </label>
          <p className="text-dark-foreground mb-3">
            {reviews?.length > 0
              ? renderStars(Math.round(averageRating))
              : "Be the first to review"}
          </p>
        </div>
      </div>
      {displayReviews && reviews?.length > 0 && (
        <div className="mt-4">
          <h2 className="font-bold text-dark-primary text-lg">Reviews:</h2>
          {reviews.map((review, index) => (
            <div key={index} className="mt-2">
              <p>{renderStars(review.rating)}</p>
              <p className="text-dark-foreground">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default BookItem;
