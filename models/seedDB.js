const axios = require("axios");
const Book = require("./books");
const Author = require("./authors");
const moment = require("moment");
function randomDate(start, end, startHour, endHour) {
  var date = new Date(+start + Math.random() * (end - start));
  var hour = (startHour + Math.random() * (endHour - startHour)) | 0;
  date.setHours(hour);
  return date;
}
async function fetchSelfHelpBooks(limit = 2000) {
  const response = await axios.get(
    `https://openlibrary.org/search.json?subject=self-help_techniques&limit=${limit}`
  );
  return response.data.docs;
}

async function fetchAuthorDetails(authorKey) {
  try {
    const response = await axios.get(
      `https://openlibrary.org${authorKey}.json`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching author details for ${authorKey}:`,
      error.message
    );
    return null;
  }
}

async function populateDatabase() {
  try {
    const books = await fetchSelfHelpBooks();
    const processedAuthors = {};

    for (const bookData of books) {
      try {
        if (!bookData.author_key || bookData.author_key.length === 0) {
          console.log(
            `Skipping book "${bookData.title}" due to missing author information`
          );
          continue;
        }

        const authorKey = bookData.author_key[0];
        let author;

        if (!(authorKey in processedAuthors)) {
          const authorDetails = await fetchAuthorDetails(
            `/authors/${authorKey}`
          );

          if (!authorDetails) {
            console.log(
              `Skipping book "${bookData.title}" due to missing author details`
            );
            continue;
          }

          author = await Author.create({
            name: bookData.author_name[0],
            biography: authorDetails.bio
              ? typeof authorDetails.bio === "object"
                ? authorDetails.bio.value.substring(0, 200)
                : authorDetails.bio.substring(0, 200)
              : "No biography available",
            date_of_birth: authorDetails.birth_date
              ? moment(authorDetails.birth_date, "DD MMMM YYYY").toDate()
              : randomDate(new Date(1900, 0, 1), new Date(2024, 0, 1), 0, 23),
            profilePhotoUrl:
              authorDetails.photos && authorDetails.photos.length > 0
                ? `https://covers.openlibrary.org/a/id/${authorDetails.photos[0]}-L.jpg`
                : null,
          });

          processedAuthors[authorKey] = author.id;
          console.log(`Added author: ${author.name}`);
        } else {
          author = await Author.findByPk(processedAuthors[authorKey]);
        }

        const book = await Book.create({
          title: bookData.title,
          author_id: author.id,
          description: bookData.description
            ? bookData.description.substring(0, 200)
            : "No description available",
          publishedAt: bookData.first_publish_year
            ? moment(`${bookData.first_publish_year}`, "YYYY").toDate()
            : randomDate(new Date(1900, 0, 1), new Date(2024, 0, 1), 0, 23),
          profilePhotoUrl: bookData.cover_i
            ? `https://covers.openlibrary.org/b/id/${bookData.cover_i}-L.jpg`
            : null,
          reviews: [],
        });

        console.log(`Added book: ${book.title}`);
      } catch (error) {
        console.error(`Error processing book "${bookData.title}":`, error);
      }
    }

    console.log("Database population complete");
  } catch (error) {
    console.error("Error populating database:", error);
  }
}

populateDatabase();
