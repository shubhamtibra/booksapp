const { Sequelize, DataTypes } = require("sequelize");
const Author = require("./authors");
const Book = require("./books");
const sequelize = require("./database");

const authors = [
  {
    name: "J.K. Rowling",
    biography: "British author, best known for the Harry Potter series.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/J._K._Rowling_2010.jpg/440px-J._K._Rowling_2010.jpg",
  },
  {
    name: "George R.R. Martin",
    biography:
      "American novelist and short story writer, author of A Song of Ice and Fire series.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/George_R.R._Martin_at_Archipelacon.jpg/440px-George_R.R._Martin_at_Archipelacon.jpg",
  },
  {
    name: "Stephen King",
    biography:
      "American author of horror, supernatural fiction, suspense, and fantasy novels.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Stephen_King%2C_Comicon.jpg/440px-Stephen_King%2C_Comicon.jpg",
  },
  {
    name: "Agatha Christie",
    biography:
      "English writer known for her detective novels and short story collections.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/c/cf/Agatha_Christie.png",
  },
  {
    name: "Jane Austen",
    biography: "English novelist known primarily for her six major novels.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/c/cc/CassandraAusten-JaneAusten%28c.1810%29_hires.jpg",
  },
  {
    name: "Ernest Hemingway",
    biography: "American novelist, short story writer, and journalist.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/2/28/ErnestHemingway.jpg",
  },
  {
    name: "Virginia Woolf",
    biography:
      "English writer, considered one of the most important modernist 20th-century authors.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/0/0b/George_Charles_Beresford_-_Virginia_Woolf_in_1902_-_Restoration.jpg",
  },
  {
    name: "Mark Twain",
    biography:
      "American writer, humorist, entrepreneur, publisher, and lecturer.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/0/0c/Mark_Twain_by_AF_Bradley.jpg",
  },
  {
    name: "Leo Tolstoy",
    biography:
      "Russian writer who is regarded as one of the greatest authors of all time.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/c/c6/L.N.Tolstoy_Prokudin-Gorsky.jpg",
  },
  {
    name: "Gabriel García Márquez",
    biography:
      "Colombian novelist, short-story writer, screenwriter and journalist.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/0/0f/Gabriel_Garcia_Marquez.jpg",
  },
];

const books = [
  {
    title: "Harry Potter and the Philosopher's Stone",
    description: "The first novel in the Harry Potter series.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/en/6/6b/Harry_Potter_and_the_Philosopher%27s_Stone_Book_Cover.jpg",
    author_id: 1,
  },
  {
    title: "Harry Potter and the Chamber of Secrets",
    description: "The second novel in the Harry Potter series.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/en/5/5c/Harry_Potter_and_the_Chamber_of_Secrets.jpg",
    author_id: 1,
  },
  {
    title: "Harry Potter and the Prisoner of Azkaban",
    description: "The third novel in the Harry Potter series.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/en/a/a0/Harry_Potter_and_the_Prisoner_of_Azkaban.jpg",
    author_id: 1,
  },
  {
    title: "A Game of Thrones",
    description: "The first novel in A Song of Ice and Fire series.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/en/9/93/AGameOfThrones.jpg",
    author_id: 2,
  },
  {
    title: "A Clash of Kings",
    description: "The second novel in A Song of Ice and Fire series.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/en/3/39/AClashOfKings.jpg",
    author_id: 2,
  },
  {
    title: "The Shining",
    description: "A horror novel by Stephen King.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/en/4/4c/Shiningnovel.jpg",
    author_id: 3,
  },
  {
    title: "It",
    description: "A horror novel by Stephen King.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/en/5/5a/It_cover.jpg",
    author_id: 3,
  },
  {
    title: "Murder on the Orient Express",
    description: "A detective novel by Agatha Christie.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/en/c/c0/Murder_on_the_Orient_Express_First_Edition_Cover_1934.jpg",
    author_id: 4,
  },
  {
    title: "Pride and Prejudice",
    description: "A romantic novel by Jane Austen.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/1/17/PrideAndPrejudiceTitlePage.jpg",
    author_id: 5,
  },
  {
    title: "The Old Man and the Sea",
    description: "A short novel by Ernest Hemingway.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/en/7/73/Oldmansea.jpg",
    author_id: 6,
  },
  {
    title: "Mrs Dalloway",
    description: "A novel by Virginia Woolf.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/en/6/67/MrsDallowayVWoolf.jpg",
    author_id: 7,
  },
  {
    title: "The Adventures of Tom Sawyer",
    description: "A novel by Mark Twain.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/1/1d/Tom_Sawyer_1876_frontispiece.jpg",
    author_id: 8,
  },
  {
    title: "War and Peace",
    description: "A novel by Leo Tolstoy.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/a/af/Tolstoy_-_War_and_Peace_-_first_edition%2C_1869.jpg",
    author_id: 9,
  },
  {
    title: "One Hundred Years of Solitude",
    description: "A novel by Gabriel García Márquez.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/en/a/a0/Cien_a%C3%B1os_de_soledad_%28book_cover%2C_1967%29.jpg",
    author_id: 10,
  },
  {
    title: "Harry Potter and the Goblet of Fire",
    description: "The fourth novel in the Harry Potter series.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/en/c/c7/Harry_Potter_and_the_Goblet_of_Fire.jpg",
    author_id: 1,
  },
  {
    title: "A Storm of Swords",
    description: "The third novel in A Song of Ice and Fire series.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/en/2/24/AStormOfSwords.jpg",
    author_id: 2,
  },
  {
    title: "The Stand",
    description: "A post-apocalyptic dark fantasy novel by Stephen King.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/en/9/96/The_Stand_cover.jpg",
    author_id: 3,
  },
  {
    title: "Death on the Nile",
    description: "A detective novel by Agatha Christie.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/en/9/96/Death_on_the_Nile_First_Edition_Cover_1937.jpg",
    author_id: 4,
  },
  {
    title: "Sense and Sensibility",
    description: "A novel by Jane Austen.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/6/6c/Sense_and_Sensibility%2C_1811.jpg",
    author_id: 5,
  },
  {
    title: "A Farewell to Arms",
    description: "A novel by Ernest Hemingway.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/en/4/48/Hemingway_farewell.png",
    author_id: 6,
  },
  {
    title: "To the Lighthouse",
    description: "A novel by Virginia Woolf.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/en/4/4c/To_the_Lighthouse_cover.jpg",
    author_id: 7,
  },
  {
    title: "Adventures of Huckleberry Finn",
    description: "A novel by Mark Twain.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/6/61/Huckleberry_Finn_book.JPG",
    author_id: 8,
  },
  {
    title: "Anna Karenina",
    description: "A novel by Leo Tolstoy.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/c/c7/AnnaKareninaTitle.jpg",
    author_id: 9,
  },
  {
    title: "Love in the Time of Cholera",
    description: "A novel by Gabriel García Márquez.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/en/0/0b/Love_in_the_Time_of_Cholera.jpg",
    author_id: 10,
  },
  {
    title: "Harry Potter and the Order of the Phoenix",
    description: "The fifth novel in the Harry Potter series.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/en/7/70/Harry_Potter_and_the_Order_of_the_Phoenix.jpg",
    author_id: 1,
  },
  {
    title: "A Feast for Crows",
    description: "The fourth novel in A Song of Ice and Fire series.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/en/a/a3/AFeastForCrows.jpg",
    author_id: 2,
  },
  {
    title: "The Green Mile",
    description: "A supernatural novel by Stephen King.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/en/f/f7/Greenmile.jpg",
    author_id: 3,
  },
  {
    title: "And Then There Were None",
    description: "A mystery novel by Agatha Christie.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/en/4/4a/And_Then_There_Were_None_First_Edition_Cover_1939.jpg",
    author_id: 4,
  },
  {
    title: "Emma",
    description: "A novel by Jane Austen.",
    profilePhotoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/f/f6/Emma_title_page.jpg",
    author_id: 5,
  },
];
function randomDate(start, end, startHour, endHour) {
  var date = new Date(+start + Math.random() * (end - start));
  var hour = (startHour + Math.random() * (endHour - startHour)) | 0;
  date.setHours(hour);
  return date;
}

async function seedDatabase() {
  try {
    await sequelize.sync({ force: true });

    for (let authorData of authors) {
      await Author.create({
        ...authorData,
        date_of_birth: randomDate(
          new Date(1900, 0, 1),
          new Date(2024, 0, 1),
          0,
          23
        ),
      });
    }

    for (let bookData of books) {
      await Book.create({
        ...bookData,
        publishedAt: randomDate(
          new Date(1900, 0, 1),
          new Date(2024, 0, 1),
          0,
          23
        ),
      });
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await sequelize.close();
  }
}

seedDatabase();
