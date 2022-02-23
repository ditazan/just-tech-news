const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../config/connection");
//create user model
class User extends Model {
  // set up method to run on instance data (per user) to check password
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

// create fields/columns for User model
User.init(
  {
    //table column definintions
    //id column
    id: {
      //use Sequelize Datatypes obj to provide what time of data it is
      type: DataTypes.INTEGER,
      //'NOT NULL'
      allowNull: false,
      //primary key
      primaryKey: true,
      //auto increment
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // no duplicate email values in this table
      unique: true,
      // if allowNull is set to false, we can run our data through validators before creating the table data
      validate: {
        //prebuilt sequelize validator
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // min length of 4 characters
        len: [4],
      },
    },
  },
  {
    hooks: {
      // beforeCreate(userData) {
      //   return bcrypt.hash(userData.password, 10).then((newUserData) => {
      //     return newUserData
      //   });
      // }

      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
      // set up beforeUpdate lifecycle "hook" functionality
      async beforeUpdate(updatedUserData) {
        updatedUserData.password = await bcrypt.hash(
          updatedUserData.password,
          10
        );
        return updatedUserData;
      },
    },

    //table config options
    //pass in imported sequelize connection (direct connection to database)
    sequelize,
    //dont automatically create createdAt/updatedAt timestamp fields
    timestamps: false,
    //dont pluralize name of db table
    freezeTableName: true,
    //use undercores instead of camel-casing
    underscored: true,
    //model name stays lowercase in db
    modelName: "user",
  }
);

module.exports = User;
