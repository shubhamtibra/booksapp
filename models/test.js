const Author = require("./authors");
const Book = require("./books");
const sequelize = require("./database");
const moment = require("moment/moment");

async function test() {
  try {
    const result = await Author.findByPk(12);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
  try {
    const date_of_birth = moment("1997-08-09 05:30:00+05:30");
    const result = await Author.update(
      {
        profilePhotoUrl: "https://www.google.com/1",
        date_of_birth,
      },
      { where: { id: 12 } }
    );
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}
test();
