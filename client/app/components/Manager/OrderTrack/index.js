import React, { useState, useEffect } from 'react';
import { Col } from 'reactstrap';
import axios from 'axios';

const OrderTrack = props => {
  const { order } = props;
  const [trackingDetails, setTrackingDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderTracking = async () => {
      try {
        const response = await axios.get(`/api/orders/${order._id}/track`);
        setTrackingDetails(response.data);
        setError(null);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch order tracking details');
      }
    };

    if (order && order._id) {
      fetchOrderTracking();
    }
  }, [order]);

  return (
    <Col className='order-summary pt-3'>
      <h2>Order Track</h2>
      <p>Order ID: {order && order._id}</p>
      {error && <p>{error}</p>}
      {trackingDetails && (
        <div>
          <p>Status: {trackingDetails.Status}</p>
          <p>Shipment Date: {trackingDetails.ShipmentDate}</p>
          <p>Consignee: {trackingDetails.Consignee}</p>
          <p>Destination: {trackingDetails.Destination}</p>
          <p>Origin: {trackingDetails.Origin}</p>
          <p>Current Location: {trackingDetails.CurrentLocation}</p>
          <p>Estimated Delivery: {trackingDetails.EstimatedDelivery}</p>
          <p>Sender: {trackingDetails.Sender}</p>
          <p>Receiver: {trackingDetails.Receiver}</p>
          <p>Weight: {trackingDetails.Weight}</p>
          <p>Dimensions: {trackingDetails.Dimensions}</p>
          <p>Remarks: {trackingDetails.Remarks}</p>
          {/* ... other tracking details */}
        </div>
      )}
    </Col>
  );
};

export default OrderTrack;
