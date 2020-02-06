const mongoose = require('mongoose');
const db = require('../../../config/database');

const schema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  clientId: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    unique: true,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
}, {
  collection: 'AccessToken',
  additionalProperties: false,
});

module.exports = db.mongooseConnection().model('AccessToken', schema);
