const { faker } = require("@faker-js/faker");
const Book = require("../models/books");
const Author = require("../models/authors");

async function seedDatabase() {
  // Create 50 authors
  await Author.sync();
  await Book.sync();
  const authors = [];
  for (let i = 0; i < 50; i++) {
    const author = await Author.create({
      name: faker.person.fullName(),
      date_of_birth: faker.date.past(100),
      biography: faker.person.bio(),
    });
    authors.push(author);
  }

  // Create 100 books
  for (let i = 0; i < 100; i++) {
    const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
    await Book.create({
      title: faker.lorem.words(3),
      author_id: randomAuthor.id,
      description: faker.lorem.paragraph(),
      publishedAt: faker.date.past(50),
    });
  }

  console.log("Database seeded successfully!");
}

seedDatabase().catch(console.error);
