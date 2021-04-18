const express = require('express');
const server = express();

// Get the Mongoose models used for querying the database
const { User } = require('./models.js');

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
    res.send(user);
  });
});

// Start the server, listening on port 3000.
server.listen(3000);
