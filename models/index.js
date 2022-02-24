const User = require("./User");
const Post = require("./Post");

// create associations
//users can have many posts
//declaring link to foreign key
User.hasMany(Post, {
  foreignKey: "user_id",
});

//defining the relationship of post model top user
//post can belong to one user but not many users
//we are also declaring the link to the foreign key
Post.belongsTo(User, {
  foreignKey: "user_id",
});

module.exports = { User, Post };
