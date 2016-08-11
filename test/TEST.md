  Message endpoints
    /messages
      GET
        ✓ should return an empty list of messages initially
        ✓ should return a list of messages
        ✓ should allow filtering by from
        ✓ should allow filtering by to
        ✓ should allow filtering by from and to
      POST
        ✓ should allow adding a message
        ✓ should reject messages without text
        ✓ should reject non-string text
        ✓ should reject non-string to
        ✓ should reject non-string from
        5) should reject messages from non-existent users
        6) should reject messages to non-existent users
    /messages/:messageId
      GET
404 error
        ✓ should 404 on non-existent messages
        ✓ should return a single message

  User endpoints
    /users
      GET
        ✓ should return an empty list of users initially
        ✓ should return a list of users
      POST
        ✓ should allow adding a user
        ✓ should reject users without a username
        ✓ should reject non-string usernames
    /users/:userId
      GET
404 error
        ✓ should 404 on non-existent users
200 OK
        ✓ should return a single user
      PUT
200 OK
        ✓ should allow editing a user
        ✓ should create a user if they don't exist
        ✓ should reject users without a username
        ✓ should reject non-string usernames
      DELETE
404 error
        ✓ should 404 on non-existent users
        ✓ should delete a user
