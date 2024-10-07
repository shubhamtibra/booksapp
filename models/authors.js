const sequelize = require("./database");
const { Sequelize, DataTypes } = require("sequelize");
const Book = require("./books");
const moment = require("moment/moment");

const Author = sequelize.define(
  "Author",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    biography: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_of_birth: {
      type: DataTypes.DATE,
      allowNull: true,
      get() {
        return this.getDataValue("date_of_birth").toDateString();
      },
      set(value) {
        this.setDataValue("date_of_birth", moment(value).toDate());
      },
    },
    profilePhotoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    // Other model options go here
  }
);
// `sequelize.define` also returns the model
console.log(Author === sequelize.models.Author); // true
Author.hasMany(Book, { foreignKey: "author_id" });
Book.belongsTo(Author, { foreignKey: "author_id" });
module.exports = Author;
