const crypto = require('crypto');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

// MongoDB connection details
const dbUrl = 'mongodb://localhost:27017';
const dbName = 'files_manager';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    // Validate email and password
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // Hash the password using SHA1
    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    try {
      // Connect to MongoDB
      const client = await MongoClient.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
      const db = client.db(dbName);
      const usersCollection = db.collection('users');

      // Check if the email already exists
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        client.close();
        return res.status(400).json({ error: 'Already exist' });
      }

      // Create new user
      const result = await usersCollection.insertOne({
        email,
        password: hashedPassword,
      });

      // Send response with the new user data
      const newUser = { id: result.insertedId, email };
      client.close();
      return res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = UsersController;
