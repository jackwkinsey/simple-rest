const express = require('express');
const server = express();

// Get the Mongoose models used for querying the database
const { User } = require('./models.js');

// Filter a user object based on the requested fields
const filterFields = (req, user) => {
  const { fields } = req.query;

  // If no fields were specified we return all of them.
  if (!fields) {
    return user;
  }

  /**
   * Otherwise, we assume the fields are a comma-separated list of field
   * names, and we generate a new object that contains only those fields.
   */
  const filteredUser = {};
  for (const field of fields.split(',')) {
    filteredUser[field] = user[field];
  }
  return filteredUser;
};

// Listen for all GET requests to /users
server.get('/users', (req, res) => {
  /**
   * Find all of the users in the database collection. (We pass in an empty
   * collection as we aren't filtering the results)
   */
  User.find({}, (error, users) => {
    if (error) {
      // The DB returned an error so we return a 500 error.
      return res.status(500).end(error);
    }

    // Return the array of users to the client, serialized as a JSON string.
    res.send(users.map(user => filterFields(req, user)));
  });
});

/**
 * Listen for all GET requests to /users/:id URL
 * where the ID is the ID of the user account
 */
server.get('/users/:id', (req, res) => {
  /**
   * Try to find the user by their ID (_id field) using the ID parameter
   * from the URL
   */
  User.findById(req.params.id, (error, user) => {
    if (error) {
      // The DB returned an error so we return a 500 error.
      return res.status(500).end(error);
    }

    if (!user) {
      // No user was found so we return a 404 error.
      return res.status(404).end();
    }

    // Return the user to the client, serialized as a JSON string.
    res.send(filterFields(req, user));
  });
});

// Start the server, listening on port 3000.
server.listen(3000);
