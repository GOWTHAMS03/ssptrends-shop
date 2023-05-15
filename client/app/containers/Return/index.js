import React, { useState } from 'react';

const Return = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [reason, setReason] = useState('');
  const [refundMethod, setRefundMethod] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { orderNumber, reason, refundMethod } = e.target.elements;

    // Check if all fields are filled out
    if (!orderNumber.value || !reason.value || !refundMethod.value) {
      alert('Please fill out all fields');
      return;
    }

    // Send the return request to the server
    try {
      const response = await fetch('/api/return-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderNumber: orderNumber.value,
          reason: reason.value,
          refundMethod: refundMethod.value,
        }),
      });

      // Check if the return request was successful
      if (response.ok) {
        alert('Return request submitted successfully');
        // Clear the form fields
        e.target.reset();
      } else {
        const errorMessage = await response.text();
        alert(`Return request failed: ${errorMessage}`);
      }
    } catch (error) {
      console.log(error);
      alert('Return request failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Order Number:
        <input type="text" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} />
      </label>
      <label>
        Reason for Return:
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} />
      </label>
      <label>
        Refund Method:
        <select value={refundMethod} onChange={(e) => setRefundMethod(e.target.value)}>
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
          <option value="paypal">PayPal</option>
        </select>
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Return;
