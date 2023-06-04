const axios = require('axios');
const express = require('express');
const router = express.Router();

// GET /api/orders/:orderId/track
router.get('/track', async (req, res) => {
  const { orderId } = req.params;
  console.log("hsdjlkfjskdf is this salem")

  try {
    const response = await axios.get(`https://api.delhivery.com/v1/track/json/?waybill=${orderId}`);
    const trackingDetails = response.data;
    res.json(trackingDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch order tracking details' });
  }
});

module.exports = router;
