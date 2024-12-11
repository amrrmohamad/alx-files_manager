// utils/userUtils.js
const db = require('../db'); // Mocked DB module

function getUserById(userId) {
  return db.getUserById(userId); // Fetch the user from DB
}

module.exports = {
  getUserById,
};
