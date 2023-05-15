const mongoose = require('mongoose');
const ReturnRequest = require('../../models/return');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { orderNumber, reason, refundMethod } = req.body;

  // Validate the request data
  if (!orderNumber || !reason || !refundMethod) {
    return res.status(400).send('Invalid request data');
  }

  try {
    // Create a new return request object
    const returnRequest = new ReturnRequest({
      orderNumber,
      reason,
      refundMethod,
    });

    // Save the return request to the database
    await returnRequest.save();

    // Send an email notification to the customer service team
    sendReturnRequestNotificationEmail(returnRequest);

    res.send('Return request submitted successfully');
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
