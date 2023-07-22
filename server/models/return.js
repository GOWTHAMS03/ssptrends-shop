const Mongoose = require('mongoose');
const { RETURNORDER_STATUS } = require('../constants');
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
  status: {
    type: String,
    default: RETURNORDER_STATUS.Waiting_Approval,
    enum: [
      RETURNORDER_STATUS.Waiting_Approval,
      RETURNORDER_STATUS.Rejected,
      RETURNORDER_STATUS.Approved
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Mongoose.model('Return', returnRequestSchema);
