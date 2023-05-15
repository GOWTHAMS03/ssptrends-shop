const Mongoose = require('mongoose');

const { Schema } = Mongoose;

const returnRequestSchema = new Schema({
  orderNumber: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  refundMethod: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Mongoose.model('Return', returnRequestSchema);
