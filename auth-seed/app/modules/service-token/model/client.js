const mongoose = require('mongoose');
const db = require('../../../config/database');

const schema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  clientId: {
    type: String,
    unique: true,
    required: true,
  },
  clientSecret: {
    type: String,
    required: true,
  },
}, {
  collection: 'Client',
  additionalProperties: false,
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
});

module.exports = db.mongooseConnection().model('Client', schema);
