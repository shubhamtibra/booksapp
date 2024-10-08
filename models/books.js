const moment = require("moment/moment");
const sequelize = require("./database");
const { Sequelize, DataTypes } = require("sequelize");
const Book = sequelize.define(
  "Book",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Model attributes are defined here
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      get() {
        return this.getDataValue("publishedAt").toDateString();
      },
      set(value) {
        this.setDataValue("publishedAt", moment(value).toDate());
      },
    },
    profilePhotoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reviews: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
  },
  {
    // Other model options go here
  }
);
// `sequelize.define` also returns the model
console.log(Book === sequelize.models.Book);
sequelize.sync(); // true
module.exports = Book;
