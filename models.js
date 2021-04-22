const mongoose = require('mongoose');

// Connect to the local MongoDB named "testdb_graphql-guide".
mongoose.connect('mongodb://localhost/testdb_graphql-guide');

// Create a Group schema to be stored in the MongoDB database
const GroupSchema = new mongoose.Schema({
  _id: String,
  name: String,
});

// Turn that schema into a model that we can query
const Group = mongoose.model('Group', GroupSchema);

// Create a User schema to be stored in the MongoDB database
const UserSchema = new mongoose.Schema({
  _id: String,
  groupId: String,
  name: String,
  username: String,
});

// Retrieve the group associated with the user
UserSchema.methods.group = function () {
  // Use .exec() to ensure a true Promise is returned
  return Group.findById(this.groupId).exec();
};

// Turn that schema into a model that we can query
const User = mongoose.model('User', UserSchema);

module.exports = { Group, User };
