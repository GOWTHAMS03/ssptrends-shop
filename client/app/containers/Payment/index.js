import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../../components/Common/Button';

const PaymentForm = ({ addressFormData, orderitems, placeOrder }) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [generatedCaptcha, setGeneratedCaptcha] = useState('');

  const url = 'http://localhost:3000/api';

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    // Generate a random 4-digit number as the captcha
    const newCaptcha = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedCaptcha(newCaptcha);
  };

  const handlePayment = async () => {
    setLoading(true);

    if (paymentMethod === 'cod') {
      if (captcha === generatedCaptcha) {
        // Perform cash on delivery logic
        try {
          // Make an API request to place the order
          await axios.post(`${url}/placeorder`, {
            address: addressFormData,
            items: orderitems,
            paymentMethod: 'Cash on Delivery',
          });

          // Dispatch the placeOrder action with addressFormData and orderitems
          placeOrder(addressFormData, orderitems);
        } catch (error) {
          console.log(error);
        }
      } else {
        setCaptchaError('Invalid captcha. Please enter the correct number.');
      }
    } else if (paymentMethod === 'online') {
      // Perform online payment logic
      try {
        // ...
        // Your existing online payment logic
        // ...
      } catch (err) {
        alert(err);
      }
    }

    setLoading(false);
  };

  return (
    <div>
      <h3>Select Payment Method:</h3>
      <div>
        <label>
          <input
            type="radio"
            value="cod"
            checked={paymentMethod === 'cod'}
            onChange={() => setPaymentMethod('cod')}
          />
          Cash on Delivery
        </label>
      </div>
      {paymentMethod === 'cod' && (
        <div>
          <p>Enter the Captcha: (Hint: {generatedCaptcha})</p>
          <input
            type="text"
            value={captcha}
            onChange={(e) => {
              setCaptcha(e.target.value);
              setCaptchaError('');
            }}
          />
          {captchaError && <p>{captchaError}</p>}
        </div>
      )}
      <div>
        <label>
          <input
            type="radio"
            value="online"
            checked={paymentMethod === 'online'}
            onChange={() => setPaymentMethod('online')}
          />
          Online Payment
        </label>
      </div>
      <div>
        <Button
          type="submit"
          disabled={loading}
          text="Proceed to Payment"
          onClick={handlePayment}
        />
      </div>
    </div>
  );
};

export default PaymentForm;
